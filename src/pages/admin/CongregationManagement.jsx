import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  where,
  writeBatch,
} from "firebase/firestore";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  History,
  Church,
  MapPin,
  Calendar,
  X,
  ThumbsUp,
  ThumbsDown,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { db } from "../../utils/firebaseConfig";
import { useAuth } from "../../context/AuthContext";

/* =========================
   Helpers
========================= */

const formatDate = (value) => {
  if (!value) return "—";
  if (value.toDate) return value.toDate().toLocaleDateString();
  return value;
};

const StatusBadge = ({ status }) => {
  const styles = {
    verified:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    pending:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    rejected:
      "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  };

  const icons = {
    verified: CheckCircle,
    pending: Clock,
    rejected: XCircle,
  };

  const Icon = icons[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border ${styles[status]}`}
    >
      <Icon size={14} />
      <span className="capitalize">{status}</span>
    </span>
  );
};

/* =========================
   Component
========================= */

const CongregationManagement = () => {
  const { profile, platformSettings } = useAuth();

  const [congregations, setCongregations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkAction, setBulkAction] = useState(null);

  const [confirm, setConfirm] = useState(null);
  const [reason, setReason] = useState("");

  const [historyTarget, setHistoryTarget] = useState(null);
  const [history, setHistory] = useState([]);

  /* =========================
     Fetch Congregations
  ========================= */

  useEffect(() => {
    const fetchCongregations = async () => {
      const q = query(
        collection(db, "congregations"),
        orderBy("created_at", "desc")
      );

      const snap = await getDocs(q);

      setCongregations(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            status: data.verified
              ? "verified"
              : data.rejected
              ? "rejected"
              : "pending",
          };
        })
      );

      setLoading(false);
    };

    fetchCongregations();
  }, []);

  /* =========================
      Stats
    ========================= */

    const stats = useMemo(() => {
      return {
        total: congregations.length,
        verified: congregations.filter(c => c.status === "verified").length,
        pending: congregations.filter(c => c.status === "pending").length,
        rejected: congregations.filter(c => c.status === "rejected").length,
      };
    }, [congregations]);


  /* =========================
     Filters & Pagination
  ========================= */

  const filteredCongregations = useMemo(() => {
    return congregations.filter((c) => {
      const matchesSearch =
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.city?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || c.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [congregations, search, statusFilter]);

  const paginatedCongregations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCongregations.slice(start, start + itemsPerPage);
  }, [filteredCongregations, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(
    filteredCongregations.length / itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  /* =========================
     Selection
  ========================= */

  const toggleSelection = (id) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedCongregations.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedCongregations.map((c) => c.id)));
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  /* =========================
     Logging
  ========================= */

  const logActivity = async (action, congregation) => {
    if (!profile) return;

    await addDoc(collection(db, "activity_logs"), {
      actor_uid: profile.uid,
      actor_name: profile.name,
      action,
      target_type: "congregation",
      target_id: congregation.id,
      target_name: congregation.name,
      timestamp: serverTimestamp(),
    });
  };

  /* =========================
     Single Actions
  ========================= */

  const approve = async (c) => {
    await updateDoc(doc(db, "congregations", c.id), {
      verified: true,
      rejected: false,
      verified_at: serverTimestamp(),
    });

    await addDoc(collection(db, "verifications"), {
      congregation_id: c.id,
      action: "approved",
      reviewed_at: serverTimestamp(),
    });

    await logActivity("approve_congregation", c);

    setCongregations((prev) =>
      prev.map((x) =>
        x.id === c.id ? { ...x, status: "verified" } : x
      )
    );

    setConfirm(null);
  };

  const reject = async (c) => {
    await updateDoc(doc(db, "congregations", c.id), {
      verified: false,
      rejected: true,
    });

    await addDoc(collection(db, "verifications"), {
      congregation_id: c.id,
      action: "rejected",
      reason,
      reviewed_at: serverTimestamp(),
    });

    await logActivity("reject_congregation", c);

    setCongregations((prev) =>
      prev.map((x) =>
        x.id === c.id ? { ...x, status: "rejected" } : x
      )
    );

    setReason("");
    setConfirm(null);
  };

  /* =========================
     Bulk Actions (FIXED)
  ========================= */

  const handleBulkApprove = async () => {
    if (
      profile?.role !== "super_admin" ||
      !platformSettings?.approvals?.allow_bulk_actions ||
      selectedIds.size === 0
    )
      return;

    const batch = writeBatch(db);
    const selected = congregations.filter((c) =>
      selectedIds.has(c.id)
    );

    selected.forEach((c) => {
      batch.update(doc(db, "congregations", c.id), {
        verified: true,
        rejected: false,
        verified_at: serverTimestamp(),
      });
    });

    await batch.commit();

    for (const c of selected) {
      await addDoc(collection(db, "verifications"), {
        congregation_id: c.id,
        action: "approved",
        reason: "Bulk approval",
        reviewed_at: serverTimestamp(),
      });
      await logActivity("bulk_approve_congregation", c);
    }

    setCongregations((prev) =>
      prev.map((x) =>
        selectedIds.has(x.id) ? { ...x, status: "verified" } : x
      )
    );

    clearSelection();
    setBulkAction(null);
  };

  const handleBulkReject = async () => {
    if (
      profile?.role !== "super_admin" ||
      !platformSettings?.approvals?.allow_bulk_actions ||
      selectedIds.size === 0
    )
      return;

    const batch = writeBatch(db);
    const selected = congregations.filter((c) =>
      selectedIds.has(c.id)
    );

    selected.forEach((c) => {
      batch.update(doc(db, "congregations", c.id), {
        verified: false,
        rejected: true,
      });
    });

    await batch.commit();

    for (const c of selected) {
      await addDoc(collection(db, "verifications"), {
        congregation_id: c.id,
        action: "rejected",
        reason: reason || "Bulk rejection",
        reviewed_at: serverTimestamp(),
      });
      await logActivity("bulk_reject_congregation", c);
    }

    setCongregations((prev) =>
      prev.map((x) =>
        selectedIds.has(x.id) ? { ...x, status: "rejected" } : x
      )
    );

    setReason("");
    clearSelection();
    setBulkAction(null);
  };

  /* =========================
     History
  ========================= */

  const openHistory = async (c) => {
    setHistoryTarget(c);

    const q = query(
      collection(db, "verifications"),
      where("congregation_id", "==", c.id),
      orderBy("reviewed_at", "desc")
    );

    const snap = await getDocs(q);
    setHistory(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  /* =========================
     Render
  ========================= */

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading congregations…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Church className="text-indigo-600 dark:text-indigo-400" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
                Congregation Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Review and manage congregation verifications
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            label="Total" 
            value={stats.total} 
            icon={Church}
            color="indigo"
          />
          <StatCard 
            label="Verified" 
            value={stats.verified} 
            icon={CheckCircle}
            color="emerald"
          />
          <StatCard 
            label="Pending" 
            value={stats.pending} 
            icon={Clock}
            color="amber"
          />
          <StatCard 
            label="Rejected" 
            value={stats.rejected} 
            icon={XCircle}
            color="rose"
          />
        </div>

        {/* Filters & Bulk Actions */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500"
              size={18}
            />
            <input
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 focus:border-transparent transition-all"
              placeholder="Search by name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 focus:border-transparent transition-all lg:w-48"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Items per page */}
          <select
            className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 focus:border-transparent transition-all lg:w-32"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
        </div>

        {/* ✅ Bulk Actions Bar — CORRECTLY WRAPPED */}
        {profile?.role === "super_admin" &&
          platformSettings?.approvals?.allow_bulk_actions &&
          selectedIds.size > 0 && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">
                    {selectedIds.size} selected
                  </span>
                  <button
                    onClick={clearSelection}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                  >
                    Clear
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkApprove}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    <ThumbsUp size={16} />
                    Bulk Approve
                  </button>

                  <button
                    onClick={handleBulkReject}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    <ThumbsDown size={16} />
                    Bulk Reject
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
        {/* Table */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === paginatedCongregations.length && paginatedCongregations.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Congregation
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {paginatedCongregations.map(c => (
                  <tr 
                    key={c.id} 
                    className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${
                      selectedIds.has(c.id) ? 'bg-indigo-50 dark:bg-indigo-900/10' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(c.id)}
                        onChange={() => toggleSelection(c.id)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Church className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {c.name}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <MapPin className="w-4 h-4" />
                        {c.city || "—"}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Calendar className="w-4 h-4" />
                        {formatDate(c.created_at)}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={c.status} />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {c.status !== "verified" && (
                          <button
                            onClick={() => setConfirm({ action: "approve", congregation: c })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors"
                          >
                            <ThumbsUp size={14} />
                            Approve
                          </button>
                        )}

                        {c.status !== "rejected" && (
                          <button
                            onClick={() => setConfirm({ action: "reject", congregation: c })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium transition-colors"
                          >
                            <ThumbsDown size={14} />
                            Reject
                          </button>
                        )}

                        <button
                          onClick={() => openHistory(c)}
                          className="inline-flex items-center justify-center w-8 h-8 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <History size={16} className="text-slate-600 dark:text-slate-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {paginatedCongregations.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <Church size={48} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                      <p className="text-slate-600 dark:text-slate-400 font-medium">
                        No congregations found
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                        Try adjusting your search or filter criteria
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {Math.min(currentPage * itemsPerPage, filteredCongregations.length)}
                  </span>{" "}
                  of <span className="font-semibold text-slate-900 dark:text-slate-100">{filteredCongregations.length}</span> congregations
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-indigo-600 dark:bg-indigo-700 text-white'
                              : 'border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Single Action Modal */}
      {confirm && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full shadow-xl border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                  confirm.action === "approve" 
                    ? "bg-emerald-100 dark:bg-emerald-900/30" 
                    : "bg-rose-100 dark:bg-rose-900/30"
                }`}>
                  {confirm.action === "approve" ? (
                    <ThumbsUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ThumbsDown className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 capitalize">
                    {confirm.action} Congregation
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <span className="font-medium text-slate-900 dark:text-slate-100">{confirm.congregation.name}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {confirm.action === "reject" ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Reason for Rejection *
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 dark:focus:ring-rose-400/50 resize-none"
                    placeholder="Please provide a reason..."
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              ) : (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                  <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">
                    ✓ This congregation will be marked as verified and will appear in public listings.
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button
                className="px-5 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => {
                  setConfirm(null);
                  setReason("");
                }}
              >
                Cancel
              </button>

              <button
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  confirm.action === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-rose-600 hover:bg-rose-700 text-white"
                }`}
                disabled={confirm.action === "reject" && !reason.trim()}
                onClick={() =>
                  confirm.action === "approve"
                    ? approve(confirm.congregation)
                    : reject(confirm.congregation)
                }
              >
                {confirm.action === "approve" ? <ThumbsUp size={16} /> : <ThumbsDown size={16} />}
                Confirm {confirm.action === "approve" ? "Approval" : "Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Action Modal */}
      {bulkAction && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full shadow-xl border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                  bulkAction.action === "approve" 
                    ? "bg-emerald-100 dark:bg-emerald-900/30" 
                    : "bg-rose-100 dark:bg-rose-900/30"
                }`}>
                  {bulkAction.action === "approve" ? (
                    <ThumbsUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ThumbsDown className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 capitalize">
                    Bulk {bulkAction.action}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {selectedIds.size} congregation{selectedIds.size !== 1 ? 's' : ''} selected
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {bulkAction.action === "reject" ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Reason for Rejection (Optional)
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 dark:focus:ring-rose-400/50 resize-none"
                    placeholder="Provide a reason for bulk rejection..."
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    This reason will be applied to all selected congregations.
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                  <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">
                    ✓ All {selectedIds.size} selected congregation{selectedIds.size !== 1 ? 's' : ''} will be marked as verified.
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button
                className="px-5 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => {
                  setBulkAction(null);
                  setReason("");
                }}
              >
                Cancel
              </button>

              <button
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-colors ${
                  bulkAction.action === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-rose-600 hover:bg-rose-700 text-white"
                }`}
                onClick={() =>
                  bulkAction.action === "approve"
                    ? handleBulkApprove()
                    : handleBulkReject()
                }
              >
                {bulkAction.action === "approve" ? <ThumbsUp size={16} /> : <ThumbsDown size={16} />}
                Confirm Bulk {bulkAction.action === "approve" ? "Approval" : "Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyTarget && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full shadow-xl border border-slate-200 dark:border-slate-700 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                    <History className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      Verification History
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {historyTarget.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setHistoryTarget(null)}
                  className="w-9 h-9 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText size={48} className="mb-4 text-slate-300 dark:text-slate-600" />
                  <p className="text-slate-600 dark:text-slate-400 font-medium">No history available</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                    This congregation has no verification history yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map(h => (
                    <div 
                      key={h.id} 
                      className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg ${
                          h.action === "approved"
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                            : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
                        }`}>
                          {h.action === "approved" ? (
                            <CheckCircle size={14} />
                          ) : (
                            <XCircle size={14} />
                          )}
                          <span className="capitalize">{h.action}</span>
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <Calendar size={12} />
                          {formatDate(h.reviewed_at)}
                        </div>
                      </div>
                      {h.reason && (
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-3">
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Reason:
                          </p>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            {h.reason}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
              <button
                onClick={() => setHistoryTarget(null)}
                className="w-full px-6 py-2.5 bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800 text-white rounded-xl font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =====================================================
   Stat Card
===================================================== */

const StatCard = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {label}
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {value.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CongregationManagement;