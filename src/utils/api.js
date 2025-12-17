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
};

//Single Congregation by id
export const fetchCongregationById = async (id) => {
  const ref = doc(db, "congregations", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data()
  };
};

// ---------------------------------
// Congregations by country / state
// ---------------------------------
export const fetchCongregationsByLocation = async ({ country, state, lga }) => {
  let q = collection(db, "congregations");

  if (country && state) {
    q = query(
      q,
      where("country", "==", country),
      where("state", "==", state),
      where("lga", "==", lga),
      where("verified", "==", true)
    );
  }

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
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
    updated_at: serverTimestamp(), // 🔥 correct way
  });
};




// ==================
// EVENTS
// ==================

export const fetchEvents = async () => {
  const q = query(
    collection(db, "events"),
    orderBy("date", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// -----------------------------
// Fetch events by congregation
// -----------------------------
export const fetchEventsByCongregation = async (congregationId) => {
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
};

// -----------------------------------
// Fetch SINGLE event (modal/details)
// -----------------------------------
export const fetchEventById = async (id) => {
  const ref = doc(db, "events", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data()
  };
};


// ===============================================
// USER PROFILE (after Firebase Auth login)
// ===============================================
export const fetchUserProfile = async (uid) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data()
  };
};


// ===============================================
// Fetch ALL PENDING VERIFICATIONS (Super Admin)
// ===============================================

export const fetchPendingVerifications = async () => {
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
};

/**
 * --------------------------------------------------
 * Update verification request status (Super Admin)
 * ------------------------------------------------- *
 * @param {Object} params
 * @param {string} params.verificationId
 * @param {"approved" | "rejected"} params.status
 * @param {string} params.congregationId
 * @param {string} params.adminUid
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