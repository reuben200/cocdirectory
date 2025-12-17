import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import { Clock, ShieldCheck } from "lucide-react";

const formatDateTime = (value) => {
  if (!value?.toDate) return "—";
  return value.toDate().toLocaleString();
};

const AdminActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const q = query(
        collection(db, "activity_logs"),
        orderBy("timestamp", "desc")
      );
      const snap = await getDocs(q);
      setLogs(snap.docs.map(d => d.data()));
      setLoading(false);
    };

    fetchLogs();
  }, []);

  if (loading) return <p>Loading activity logs…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Activity Logs</h1>
        <p className="text-gray-500">
          Audit trail of administrative actions
        </p>
      </div>

      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Admin</th>
              <th className="p-3">Action</th>
              <th className="p-3">Target</th>
              <th className="p-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className="border-t">
                <td className="p-3 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-indigo-600" />
                  {log.actor_name}
                </td>
                <td className="p-3 capitalize">
                  {log.action.replace("_", " ")}
                </td>
                <td className="p-3">
                  {log.target_name}
                </td>
                <td className="p-3 flex items-center gap-1 text-xs text-gray-600">
                  <Clock size={12} />
                  {formatDateTime(log.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminActivityLogs;
