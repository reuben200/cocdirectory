import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Verification = () => {
  const { profile, user, loading } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // Redirect if already verified or not a congregation admin
    if (!loading) {
      if (profile?.verified) {
        navigate("/dashboard");
      }
      if (profile?.role !== "congregation_admin") {
        navigate("/");
      }
    }
  }, [loading, profile, navigate]);

  const handleRefresh = async () => {
    setChecking(true);
    try {
      // reload user profile from firestore
      const res = await fetch(`/api/users/${user.uid}`); // Or your Firestore fetch
      const data = await res.json();
      if (data.verified) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error refreshing verification status", err);
    }
    setChecking(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Account Verification Pending
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Your congregation account is pending verification by the admin team.
          Once verified, you will gain full access to your dashboard.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={handleRefresh}
            disabled={checking}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {checking ? "Checking..." : "Refresh Status"}
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verification;
