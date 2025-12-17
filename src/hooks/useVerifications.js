import { useEffect, useState } from "react";
import {
  fetchPendingVerifications,
  updateVerificationStatus
} from "../utils/api";

const useVerifications = (adminEmail) => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadVerifications = async () => {
    setLoading(true);
    const data = await fetchPendingVerifications();
    setVerifications(data);
    setLoading(false);
  };

  const approve = async (id) => {
    await updateVerificationStatus(id, "approved", adminEmail);
    loadVerifications();
  };

  const reject = async (id) => {
    await updateVerificationStatus(id, "rejected", adminEmail);
    loadVerifications();
  };

  useEffect(() => {
    loadVerifications();
  }, []);

  return {
    verifications,
    loading,
    approve,
    reject
  };
};

export default useVerifications;
