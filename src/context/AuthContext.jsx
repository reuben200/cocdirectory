import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../utils/firebaseConfig";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [profile, setProfile] = useState(null);
const [congregation, setCongregation] = useState(null);
const [loading, setLoading] = useState(true);

const authReady = !loading && user !== null && profile !== null;


useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (authUser) => {
    setLoading(true);

    await updateDoc(doc(db, "users", authUser.uid), {
        last_login: serverTimestamp()
      });

    if (!authUser) {
      setUser(null);
      setProfile(null);
      setCongregation(null);
      setLoading(false);
      return;
    }

    setUser(authUser);

    try {
      const userSnap = await getDoc(doc(db, "users", authUser.uid));
      const userData = userSnap.exists() ? userSnap.data() : {};

      const role = userData.role || null;

      // 1️⃣ Set profile FIRST
      setProfile({ ...userData, role });

      console.log("AUTH STATE", {
        uid: authUser.uid,
        role,
        profile: { ...userData, role }
      });


      // 2️⃣ Handle congregation ONLY for congregation admins
      if (role === "congregation_admin" && userData.congregation_id) {
        try {
          const congSnap = await getDoc(
            doc(db, "congregations", userData.congregation_id)
          );
          setCongregation(congSnap.exists() ? congSnap.data() : null);
        } catch {
          setCongregation(null);
        }
      } else {
        // super_admin OR no congregation
        setCongregation(null);
      }

    } catch (error) {
      console.error("Auth bootstrap failed:", error);
      setProfile(null);
      setCongregation(null);
    }finally {
          setLoading(false);
        }
      });

      return () => unsub();
}, []);



const login = (email, password) =>
signInWithEmailAndPassword(auth, email, password);


const logout = () => signOut(auth);


return (
<AuthContext.Provider
  value={{
    user,
    profile,
    congregation,
    loading,
    authReady,
    login,
    logout,
    isAuthenticated: !!user,
    isSuperAdmin: profile?.role === "super_admin",
    isCongregationAdmin: profile?.role === "congregation_admin",
  }}
>

{children}
</AuthContext.Provider>
);
};


export const useAuth = () => useContext(AuthContext);
export default AuthContext;