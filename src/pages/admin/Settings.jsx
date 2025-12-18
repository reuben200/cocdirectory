import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, serverTimestamp, addDoc, collection } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import {
  Settings as SettingsIcon,
  Shield,
  Globe,
  Calendar,
  Save
} from "lucide-react";

const Settings = () => {
  const { profile } = useAuth();
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  const canEdit = profile?.role === "super_admin";

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, "settings", "platform"));
      if (snap.exists()) setSettings(snap.data());
    };
    load();
  }, []);

  const logSettingsChange = async () => {
    if (!profile) return;

    await addDoc(collection(db, "activity_logs"), {
      actor_uid: profile.uid,
      actor_name: profile.name,
      role: profile.role,
      action: "update_platform_settings",
      target_type: "settings",
      target_id: "platform",
      timestamp: serverTimestamp(),
    });
  };

  const update = async () => {
    if (!canEdit) return;

    setSaving(true);

    await updateDoc(doc(db, "settings", "platform"), {
      ...settings,
      system: {
        ...settings.system,
        last_updated: serverTimestamp(),
        updated_by: {
          uid: profile.uid,
          name: profile.name
        }
      }
    });

    await logSettingsChange();
    
    setSaving(false);
  };

  if (!settings) return <p>Loading settings…</p>;

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
          <SettingsIcon className="text-white" />
        </div>
        <h1 className="text-2xl font-bold">Platform Settings</h1>
      </header>

      {/* APPROVALS */}
      <section className="bg-white border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 font-semibold">
          <Shield size={18} /> Approvals
        </div>

        <label className="flex items-center justify-between">
          <span>Allow admins to approve congregations</span>
          <input
            type="checkbox"
            disabled={!canEdit}
            checked={settings.approvals.allow_admin_approve}
            onChange={e =>
              setSettings(s => ({
                ...s,
                approvals: {
                  ...s.approvals,
                  allow_admin_approve: e.target.checked
                }
              }))
            }
          />
        </label>

        <label className="flex items-center justify-between">
          <span>Enable bulk approval / rejection</span>
          <input
            type="checkbox"
            disabled={!canEdit}
            checked={settings.approvals.allow_bulk_actions}
            onChange={e =>
              setSettings(s => ({
                ...s,
                approvals: {
                  ...s.approvals,
                  allow_bulk_actions: e.target.checked
                }
              }))
            }
          />
        </label>
      </section>

      {/* DIRECTORY */}
      <section className="bg-white border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 font-semibold">
          <Globe size={18} /> Directory
        </div>

        <label className="flex items-center justify-between">
          <span>Public congregation directory visible</span>
          <input
            type="checkbox"
            disabled={!canEdit}
            checked={settings.directory.public_visible}
            onChange={e =>
              setSettings(s => ({
                ...s,
                directory: {
                  ...s.directory,
                  public_visible: e.target.checked
                }
              }))
            }
          />
        </label>
      </section>

      {/* EVENTS */}
      <section className="bg-white border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 font-semibold">
          <Calendar size={18} /> Events
        </div>

        <label className="flex items-center justify-between">
          <span>Show past events publicly</span>
          <input
            type="checkbox"
            disabled={!canEdit}
            checked={settings.events.show_past_events}
            onChange={e =>
              setSettings(s => ({
                ...s,
                events: {
                  ...s.events,
                  show_past_events: e.target.checked
                }
              }))
            }
          />
        </label>
      </section>

      {/* SAVE */}
      {canEdit && (
        <div className="flex justify-end">
          <button
            onClick={update}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg"
          >
            <Save size={16} />
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;
