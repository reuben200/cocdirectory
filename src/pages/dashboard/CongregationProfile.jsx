import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { updateCongregation } from "../../utils/api";
import { uploadToImgBB } from "../../utils/uploadImage";
import { useCongregation } from "../../hooks";

const CongregationProfile = () => {
  const { authState } = useContext(AuthContext);
  const congregationId = authState?.user?.congregationId;

  const { data: congregation, loading } = useCongregation(congregationId);

  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  if (loading) return <p>Loading congregation...</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const url = await uploadToImgBB(file);
      setForm((prev) => ({ ...prev, [field]: url }));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateCongregation(congregationId, form);
      alert("Congregation updated successfully");
    } catch (err) {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold mb-6">Congregation Information</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Congregation Name
          </label>
          <input
            name="name"
            defaultValue={congregation.name}
            onChange={handleChange}
            className="w-full input"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold mb-1">Address</label>
          <input
            name="address"
            defaultValue={congregation.address}
            onChange={handleChange}
            className="w-full input"
          />
        </div>

        {/* About */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            About Congregation
          </label>
          <textarea
            name="about"
            rows={4}
            defaultValue={congregation.about}
            onChange={handleChange}
            className="w-full textarea"
          />
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Congregation Logo
          </label>
          {form.logoUrl || congregation.logoUrl ? (
            <img
              src={form.logoUrl || congregation.logoUrl}
              alt="logo"
              className="h-20 mb-2 rounded"
            />
          ) : null}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "logoUrl")}
          />
        </div>

        {/* Banner Upload */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Banner Image
          </label>
          {form.bannerUrl || congregation.bannerUrl ? (
            <img
              src={form.bannerUrl || congregation.bannerUrl}
              alt="banner"
              className="h-32 w-full object-cover rounded mb-2"
            />
          ) : null}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "bannerUrl")}
          />
        </div>

        <button
          disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default CongregationProfile;
