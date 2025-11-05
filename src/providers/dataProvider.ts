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
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const firestoreDataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters }) => {
    const collectionRef = collection(db, resource);
    const constraints: QueryConstraint[] = [];

    // Handle filters
    if (filters) {
      filters.forEach((filter) => {
        if (filter.operator === 'eq' && filter.value !== undefined) {
          constraints.push(where(filter.field, '==', filter.value));
        } else if (filter.operator === 'contains' && filter.value) {
          // For text search, we'll do client-side filtering
          // Firestore doesn't support full-text search natively
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
    const pageSize = pagination?.pageSize || 10;
    constraints.push(limit(pageSize));

    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      data,
      total: data.length, // Note: Firestore doesn't provide total count easily
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

  // Optional methods for advanced features
  custom: async ({ url, method, payload }) => {
    // Custom method for special operations
    return { data: {} };
  },
};
