import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import {
  Church,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  FileText
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* =====================================================
   Helpers
===================================================== */

const COLORS = [
  "#10b981", // emerald - verified
  "#f59e0b", // amber - pending
  "#ef4444", // red - rejected
];

const CHART_COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#06b6d4', // cyan
];

const parseDate = (value) => {
  if (!value) return null;
  if (value.toDate) return value.toDate();
  const d = new Date(value);
  return isNaN(d) ? null : d;
};

/* =====================================================
   Component
===================================================== */

const Reports = () => {
  const [congregations, setCongregations] = useState([]);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= Fetch ================= */

  useEffect(() => {
    const fetchAll = async () => {
      const [cSnap, uSnap, eSnap] = await Promise.all([
        getDocs(collection(db, "congregations")),
        getDocs(collection(db, "users")),
        getDocs(collection(db, "events")),
      ]);

      setCongregations(cSnap.docs.map(d => d.data()));
      setUsers(uSnap.docs.map(d => d.data()));
      setEvents(eSnap.docs.map(d => d.data()));
      setLoading(false);
    };

    fetchAll();
  }, []);

  /* ================= KPIs ================= */

  const kpis = useMemo(() => {
    let verified = 0;
    let rejected = 0;
    let pending = 0;

    congregations.forEach(c => {
      if (c.verified === true) verified++;
      else if (c.rejected === true) rejected++;
      else pending++;
    });

    return {
      totalCongregations: congregations.length,
      verified,
      rejected,
      pending,
      totalUsers: users.length,
      totalEvents: events.length,
    };
  }, [congregations, users, events]);

  /* ================= Charts ================= */

  const congregationsByCountry = useMemo(() => {
    const map = {};
    congregations.forEach(c => {
      const country = c.country || "Unknown";
      map[country] = (map[country] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 countries
  }, [congregations]);

  const verificationBreakdown = useMemo(() => ([
    { name: "Verified", value: kpis.verified },
    { name: "Pending", value: kpis.pending },
    { name: "Rejected", value: kpis.rejected },
  ]), [kpis]);

  const growthByMonth = useMemo(() => {
    const map = {};
    congregations.forEach(c => {
      const date = parseDate(c.created_at);
      if (!date) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, value]) => ({ name, value }));
  }, [congregations]);

  /* ================= Export ================= */

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Congregation Analytics Report", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Metric", "Value"]],
      body: [
        ["Total Congregations", kpis.totalCongregations],
        ["Verified", kpis.verified],
        ["Pending", kpis.pending],
        ["Rejected", kpis.rejected],
        ["Total Users", kpis.totalUsers],
        ["Total Events", kpis.totalEvents],
      ],
    });

    doc.save("congregation-report.pdf");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 border-t-slate-600 dark:border-t-slate-300 rounded-full animate-spin"></div>
            Loading reports…
          </div>
        </div>
      </div>
    );
  }

  /* ================= Render ================= */

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <TrendingUp className="text-indigo-600 dark:text-indigo-400" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
                Reports & Analytics
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Congregation-focused platform insights
              </p>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <KPI 
            label="Congregations" 
            value={kpis.totalCongregations} 
            icon={Church} 
            color="indigo"
          />
          <KPI 
            label="Verified" 
            value={kpis.verified} 
            icon={CheckCircle} 
            color="emerald"
          />
          <KPI 
            label="Pending" 
            value={kpis.pending} 
            icon={Clock} 
            color="amber"
          />
          <KPI 
            label="Rejected" 
            value={kpis.rejected} 
            icon={XCircle} 
            color="rose"
          />
          <KPI 
            label="Users" 
            value={kpis.totalUsers} 
            icon={Users} 
            color="violet"
          />
          <KPI 
            label="Events" 
            value={kpis.totalEvents} 
            icon={Calendar} 
            color="cyan"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Top 10 Congregations by Country">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={congregationsByCountry}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  stroke="#cbd5e1"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fill: '#64748b' }}
                  stroke="#cbd5e1"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Verification Status">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={verificationBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {verificationBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="Congregation Growth Over Time">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={growthByMonth}>
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#64748b', fontSize: 12 }}
                stroke="#cbd5e1"
              />
              <YAxis 
                tick={{ fill: '#64748b' }}
                stroke="#cbd5e1"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
              />
              <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Export */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Export Data
          </h3>
          <button
            onClick={exportPDF}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 font-medium transition-colors shadow-sm"
          >
            <FileText size={18} />
            Export / Print PDF
          </button>
        </div>
      </div>
    </div>
  );
};

/* =====================================================
   UI Helpers
===================================================== */

const KPI = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
    violet: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400',
    cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3">
        <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {label}
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {value.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({ title, children }) => (
  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
      {title}
    </h3>
    {children}
  </div>
);

export default Reports;