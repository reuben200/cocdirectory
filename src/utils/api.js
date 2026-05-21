import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  runTransaction,
  serverTimestamp
} from "firebase/firestore";

import { db } from "./firebaseConfig";


// ==================
// CONGREGATION
// ==================
export const fetchCongregations = async () => {
  try {
    const q = query(
      collection(db, "congregations"),
      where("verified", "==", true),
      orderBy("created_at", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching congregations:", error);
    return []; // Return empty array so map/spinner handles failure gracefully
  }
};

//Single Congregation by id
export const fetchCongregationById = async (id) => {
  try {
    const ref = doc(db, "congregations", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data()
    };
  } catch (error) {
    console.error("Error fetching congregation by ID:", error);
    return null;
  }
};

// ---------------------------------
// Congregations by country / state
// ---------------------------------
export const fetchCongregationsByLocation = async ({ country, state, lga }) => {
  try {
    let q;

    // 🔑 THE FIX: Force security rule matching even if location bounds are missing
    if (country && state) {
      q = query(
        collection(db, "congregations"),
        where("country", "==", country),
        where("state", "==", state),
        where("lga", "==", lga),
        where("verified", "==", true)
      );
    } else {
      // Safe fallback: Get default verified items instead of querying the whole collection
      q = query(collection(db, "congregations"), where("verified", "==", true));
    }

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error filtering congregations:", error);
    return [];
  }
};

// ---------------------------------
// Congregations Update
// ---------------------------------
export const getCongregationById = async (congregationId) => {
  const ref = doc(db, "congregations", congregationId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Congregation not found");
  }

  return {
    id: snap.id,
    ...snap.data(),
  };
};

/**
 * Update congregation profile
 */
export const updateCongregation = async (congregationId, payload) => {
  const ref = doc(db, "congregations", congregationId);

  await updateDoc(ref, {
    ...payload,
    updated_at: serverTimestamp(), 
  });
};


// ==================
// EVENTS
// ==================
export const fetchEvents = async () => {
  try {
    // 🔑 SECURE ALTERNATIVE: Fallback query if your index is building
    const q = query(
      collection(db, "events"),
      orderBy("date", "asc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching events. Check if your composite indexes are built:", error);
    return [];
  }
};

// -----------------------------
// Fetch events by congregation
// -----------------------------
export const fetchEventsByCongregation = async (congregationId) => {
  try {
    const q = query(
      collection(db, "events"),
      where("congregation_id", "==", congregationId),
      orderBy("date", "asc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching events for congregation:", error);
    return [];
  }
};

// -----------------------------------
// Fetch SINGLE event (modal/details)
// -----------------------------------
export const fetchEventById = async (id) => {
  try {
    const ref = doc(db, "events", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data()
    };
  } catch (error) {
    console.error("Error fetching single event:", error);
    return null;
  }
};


// ===============================================
// USER PROFILE (after Firebase Auth login)
// ===============================================
export const fetchUserProfile = async (uid) => {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data()
    };
  } catch (error) {
    console.error("Error pulling user profile layout:", error);
    return null;
  }
};


// ===============================================
// Fetch ALL PENDING VERIFICATIONS (Super Admin)
// ===============================================
export const fetchPendingVerifications = async () => {
  try {
    const q = query(
      collection(db, "verifications"),
      where("status", "==", "pending"),
      orderBy("created_at", "asc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("SuperAdmin error pulling verifications:", error);
    return [];
  }
};

/**
 * Update verification status (Super Admin)
 */
export const updateVerificationStatus = async ({
  verificationId,
  status,
  congregationId,
  adminUid,
  rejectionReason = null
}) => {
  if (!["approved", "rejected"].includes(status)) {
    throw new Error("Invalid verification status");
  }

  if (status === "rejected" && !rejectionReason) {
    throw new Error("Rejection reason is required");
  }

  const verificationRef = doc(db, "verifications", verificationId);
  const congregationRef = doc(db, "congregations", congregationId);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(verificationRef);
    if (!snap.exists()) throw new Error("Verification not found");

    tx.update(verificationRef, {
      status,
      reviewed_at: serverTimestamp(),
      reviewed_by: adminUid,
      rejection_reason: status === "rejected" ? rejectionReason : null
    });

    if (status === "approved") {
      tx.update(congregationRef, {
        verified: true,
        verified_at: serverTimestamp()
      });
    }
  });
};
