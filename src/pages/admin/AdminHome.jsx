import { useEffect, useState } from "react";
import {
  collection,
  getCountFromServer,
  query,
  where
} from "firebase/firestore";
import {
  Church,
  CheckCircle,
  Clock,
  Calendar,
  Users
} from "lucide-react";
import { db } from "../../utils/firebaseConfig";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
          {value}
        </p>
      </div>
      <div
        className={`h-12 w-12 rounded-lg flex items-center justify-center ${color}`}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

const AdminHome = () => {
  const [stats, setStats] = useState({
    congregations: 0,
    verifiedCongregations: 0,
    pendingVerifications: 0,
    events: 0,
    users: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          congregationsSnap,
          verifiedCongregationsSnap,
          pendingVerificationsSnap,
          eventsSnap,
          usersSnap
        ] = await Promise.all([
          getCountFromServer(collection(db, "congregations")),

          getCountFromServer(
            query(collection(db, "congregations"), where("verified", "==", true))
          ),

          getCountFromServer(
            query(collection(db, "verifications"), where("status", "==", "pending"))
          ),

          getCountFromServer(collection(db, "events")),

          getCountFromServer(collection(db, "users"))
        ]);

        setStats({
          congregations: congregationsSnap.data().count,
          verifiedCongregations: verifiedCongregationsSnap.data().count,
          pendingVerifications: pendingVerificationsSnap.data().count,
          events: eventsSnap.data().count,
          users: usersSnap.data().count
        });
      } catch (error) {
        console.error("Failed to load admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading dashboard summary…</p>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Platform overview and key metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Congregations"
          value={stats.congregations}
          icon={Church}
          color="bg-indigo-600"
        />
        <StatCard
          title="Verified Congregations"
          value={stats.verifiedCongregations}
          icon={CheckCircle}
          color="bg-green-600"
        />
        <StatCard
          title="Pending Verifications"
          value={stats.pendingVerifications}
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatCard
          title="Total Events"
          value={stats.events}
          icon={Calendar}
          color="bg-blue-600"
        />
        <StatCard
          title="Total Users"
          value={stats.users}
          icon={Users}
          color="bg-purple-600"
        />
      </div>

      {/* Alerts / Insights */}
      {stats.pendingVerifications > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-300 font-medium">
            ⚠ {stats.pendingVerifications} congregation(s) awaiting verification.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminHome;
