import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const ForceLogout = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout().then(() => {
      window.location.href = "/login";
    });
  }, []);

  return <p>Logging out…</p>;
};

export default ForceLogout;



