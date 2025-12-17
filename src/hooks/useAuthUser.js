import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";
import { fetchUserProfile } from "../utils/api";

const useAuthUser = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profileData = await fetchUserProfile(firebaseUser.uid);

        setUser(firebaseUser);
        setProfile(profileData);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isSuperAdmin: profile?.role === "super_admin",
    isCongregationAdmin: profile?.role === "congregation_admin"
  };
};

export default useAuthUser;
