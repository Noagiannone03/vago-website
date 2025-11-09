// @ts-nocheck
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
  getCountFromServer,
  Timestamp,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const firestoreDataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters }) => {
    const collectionRef = collection(db, resource);
    const constraints: QueryConstraint[] = [];

    // Handle filters
    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if ('field' in filter && filter.value !== undefined && filter.value !== '') {
          switch (filter.operator) {
            case 'eq':
              constraints.push(where(filter.field, '==', filter.value));
              break;
            case 'ne':
              constraints.push(where(filter.field, '!=', filter.value));
              break;
            case 'lt':
              constraints.push(where(filter.field, '<', filter.value));
              break;
            case 'lte':
              constraints.push(where(filter.field, '<=', filter.value));
              break;
            case 'gt':
              constraints.push(where(filter.field, '>', filter.value));
              break;
            case 'gte':
              constraints.push(where(filter.field, '>=', filter.value));
              break;
            case 'in':
              if (Array.isArray(filter.value)) {
                constraints.push(where(filter.field, 'in', filter.value));
              }
              break;
          }
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
      constraints.push(orderBy('createdAt', 'desc'));
    }

    // Handle pagination
    const current = pagination?.current || 1;
    const pageSize = pagination?.pageSize || 10;

    if (pageSize) {
      constraints.push(limit(pageSize));
    }

    // Build query
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    // Get total count (approximate)
    const countQuery = query(collectionRef);
    const countSnapshot = await getCountFromServer(countQuery);
    const total = countSnapshot.data().count;

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      data,
      total,
    };
  },

  getOne: async ({ resource, id }) => {
    const docRef = doc(db, resource, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Document not found');
    }

    return {
      data: {
        id: docSnap.id,
        ...docSnap.data(),
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

    return {
      data: {
        id,
        ...data,
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

  getApiUrl: () => '',

  // Optional method for many deletions
  deleteMany: async ({ resource, ids }) => {
    await Promise.all(ids.map((id) => deleteDoc(doc(db, resource, String(id)))));
    return { data: ids.map((id) => ({ id })) };
  },

  // Custom method for advanced operations
  custom: async ({ url, method, payload }) => {
    return { data: {} };
  },
};
