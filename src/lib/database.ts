import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const addDocument = async (collectionName: string, data: object) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

export const getDocumentsByUserId = async (
  collectionName: string,
  userId: string
) => {
  try {
    const q = query(
      collection(db, collectionName),
      where("user_id", "==", userId)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting documents by user_id:", error);
    throw error;
  }
};

export const getAccountsByUserId = async (userId: string) => {
  try {
    const q = query(collection(db, "accounts"), where("user_id", "==", userId));
    const snapshot = await getDocs(q);

    const accounts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Sort by balance descending (after parsing strings to floats)
    return accounts.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));
  } catch (error) {
    console.error("Error fetching and sorting accounts:", error);
    throw error;
  }
};


export const getTotalBalanceByUserId = async (
  userId: string
): Promise<number> => {
  try {
    const q = query(collection(db, "accounts"), where("user_id", "==", userId));
    const snapshot = await getDocs(q);

    const total = snapshot.docs.reduce((sum, doc) => {
      const data = doc.data();
      const balance =
        typeof data.balance === "string"
          ? parseFloat(data.balance)
          : Number(data.balance);

      return sum + (isNaN(balance) ? 0 : balance);
    }, 0);

    return total;
  } catch (error) {
    console.error("Error fetching total balance:", error);
    throw error;
  }
};
