import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import {
  Trash2,
  UserCheck,
  UserX,
  Search,
  Clock,
  Users
} from "lucide-react";
import { db } from "../../utils/firebaseConfig";

/* =====================================================
   Helpers
===================================================== */

const formatDateTime = (value) => {
  if (!value) return "—";
  if (value.toDate) return value.toDate().toLocaleString();
  const parsed = new Date(value);
  return isNaN(parsed) ? "—" : parsed.toLocaleString();
};

/* =====================================================
   Component
===================================================== */

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  /* =====================================================
     Fetch Users
  ===================================================== */

  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };

    fetchUsers();
  }, []);

  /* =====================================================
     Derived Data
  ===================================================== */

  const filteredUsers = useMemo(() => {
    return users.filter(u =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.congregation_name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  /* =====================================================
     Actions
  ===================================================== */

  const updateRole = async (userId, role) => {
    await updateDoc(doc(db, "users", userId), { role });
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, role } : u))
    );
  };

  const toggleActive = async (user) => {
    const active = user.active === false ? true : false;
    await updateDoc(doc(db, "users", user.id), { active });

    setUsers(prev =>
      prev.map(u => (u.id === user.id ? { ...u, active } : u))
    );
  };

  const deleteUser = async () => {
    await deleteDoc(doc(db, "users", confirmDelete.id));
    setUsers(prev => prev.filter(u => u.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 border-t-slate-600 dark:border-t-slate-300 rounded-full animate-spin"></div>
            Loading users…
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     Render
  ===================================================== */

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Users className="text-indigo-600 dark:text-indigo-400" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
                User Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Manage users, roles, congregation, and activity
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500" size={18} />
          <input
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 focus:border-transparent transition-all"
            placeholder="Search by name, email, or congregation"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Congregation
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                      {user.name || "—"}
                    </td>

                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {user.email || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={user.role || "member"}
                        onChange={(e) => updateRole(user.id, e.target.value)}
                        className="border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 transition-all"
                      >
                        <option value="member">Member</option>
                        <option value="congregation_admin">Congregation Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {user.congregation_name ||
                        user.congregation_id?.id ||
                        "—"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Clock size={14} className="text-slate-400 dark:text-slate-500" />
                        <span className="text-xs">{formatDateTime(user.last_login)}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {user.active === false ? (
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400">
                          Inactive
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400">
                      {formatDateTime(user.created_at)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleActive(user)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          {user.active === false ? (
                            <>
                              <UserCheck size={14} /> Activate
                            </>
                          ) : (
                            <>
                              <UserX size={14} /> Deactivate
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => setConfirmDelete(user)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-rose-600 dark:bg-rose-700 text-white rounded-lg hover:bg-rose-700 dark:hover:bg-rose-800 transition-colors"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                      <Users size={48} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                      <p className="font-medium">No users found</p>
                      <p className="text-xs mt-1">Try adjusting your search criteria</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl max-w-sm w-full shadow-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                <Trash2 className="text-rose-600 dark:text-rose-400" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                  Delete User
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Are you sure you want to delete{" "}
                  <strong className="text-slate-900 dark:text-slate-100">
                    {confirmDelete.name || confirmDelete.email}
                  </strong>? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 text-sm font-medium bg-rose-600 dark:bg-rose-700 text-white rounded-lg hover:bg-rose-700 dark:hover:bg-rose-800 transition-colors"
                onClick={deleteUser}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;