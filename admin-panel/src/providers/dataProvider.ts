/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataProvider } from '@refinedev/core';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  QueryConstraint,
  getCountFromServer,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Cache for pagination cursors
const paginationCache = new Map<string, QueryDocumentSnapshot<DocumentData>>();

export const firestoreDataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const collectionRef = collection(db, resource);
    const constraints: QueryConstraint[] = [];
    let clientSideFilters: any[] = [];

    // Handle filters
    if (filters) {
      filters.forEach((filter) => {
        if (filter.operator === 'eq' && filter.value !== undefined && filter.value !== '') {
          constraints.push(where(filter.field, '==', filter.value));
        } else if (filter.operator === 'ne' && filter.value !== undefined) {
          constraints.push(where(filter.field, '!=', filter.value));
        } else if (filter.operator === 'lt' && filter.value !== undefined) {
          constraints.push(where(filter.field, '<', filter.value));
        } else if (filter.operator === 'lte' && filter.value !== undefined) {
          constraints.push(where(filter.field, '<=', filter.value));
        } else if (filter.operator === 'gt' && filter.value !== undefined) {
          constraints.push(where(filter.field, '>', filter.value));
        } else if (filter.operator === 'gte' && filter.value !== undefined) {
          constraints.push(where(filter.field, '>=', filter.value));
        } else if (filter.operator === 'in' && filter.value !== undefined) {
          constraints.push(where(filter.field, 'in', filter.value));
        } else if (filter.operator === 'contains' && filter.value) {
          // Store for client-side filtering (Firestore doesn't support native text search)
          clientSideFilters.push({ field: filter.field, value: filter.value.toLowerCase() });
        }
      });
    }

    // Handle sorting
    if (sorters && sorters.length > 0) {
      sorters.forEach((sorter) => {
        constraints.push(orderBy(sorter.field, sorter.order === 'asc' ? 'asc' : 'desc'));
      });
    } else {
      // Default sort by createdAt if available
      try {
        constraints.push(orderBy('createdAt', 'desc'));
      } catch {
        // If createdAt doesn't exist, skip ordering
      }
    }

    // Handle pagination
    const pageSize = pagination?.pageSize || 10;
    const currentPage = pagination?.current || 1;

    // Get pagination cursor if not first page
    const cacheKey = `${resource}_${currentPage - 1}`;
    if (currentPage > 1 && paginationCache.has(cacheKey)) {
      const cursor = paginationCache.get(cacheKey);
      if (cursor) {
        constraints.push(startAfter(cursor));
      }
    }

    constraints.push(limit(pageSize));

    // Execute query
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    // Store last document for pagination
    if (querySnapshot.docs.length > 0) {
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      paginationCache.set(`${resource}_${currentPage}`, lastDoc);
    }

    // Map data
    let data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamps to ISO strings for better compatibility
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
    }));

    // Apply client-side filters for text search
    if (clientSideFilters.length > 0) {
      data = data.filter((item: any) => {
        return clientSideFilters.every((filter) => {
          const fieldValue = item[filter.field];
          if (typeof fieldValue === 'string') {
            return fieldValue.toLowerCase().includes(filter.value);
          }
          return false;
        });
      });
    }

    // Get total count (for better pagination) - only if not using filters
    let total = data.length;
    if (currentPage === 1 && filters?.length === 0) {
      try {
        const countQuery = query(collectionRef);
        const snapshot = await getCountFromServer(countQuery);
        total = snapshot.data().count;
      } catch {
        // Fallback to data length if count fails
        total = data.length;
      }
    }

    return {
      data,
      total: total || data.length,
    };
  },

  getOne: async ({ resource, id }) => {
    const docRef = doc(db, resource, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`Document with id ${id} not found in ${resource}`);
    }

    const data = docSnap.data();
    return {
      data: {
        id: docSnap.id,
        ...data,
        // Convert Timestamps
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      },
    };
  },

  create: async ({ resource, variables }) => {
    const collectionRef = collection(db, resource);
    const data = {
      ...variables,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collectionRef, data);

    return {
      data: {
        id: docRef.id,
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString(),
      },
    };
  },

  update: async ({ resource, id, variables }) => {
    const docRef = doc(db, resource, id);
    const data = {
      ...variables,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(docRef, data);

    const updatedDoc = await getDoc(docRef);
    const docData = updatedDoc.data();

    return {
      data: {
        id,
        ...docData,
        createdAt: docData?.createdAt?.toDate?.()?.toISOString() || docData?.createdAt,
        updatedAt: docData?.updatedAt?.toDate?.()?.toISOString() || docData?.updatedAt,
      },
    };
  },

  deleteOne: async ({ resource, id }) => {
    const docRef = doc(db, resource, id);
    await deleteDoc(docRef);

    return {
      data: { id },
    };
  },

  deleteMany: async ({ resource, ids }) => {
    await Promise.all(
      ids.map(async (id) => {
        const docRef = doc(db, resource, String(id));
        await deleteDoc(docRef);
      })
    );

    return {
      data: ids.map((id) => ({ id })),
    };
  },

  getApiUrl: () => '',

  custom: async ({ url, method, payload, query: customQuery, headers }) => {
    // Custom method for special operations
    // Can be used for complex queries or custom Firebase operations
    return { data: payload || {} };
  },
};
