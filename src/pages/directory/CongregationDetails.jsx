import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Phone, Mail, ArrowLeft } from "lucide-react";

const CongregationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [congregation, setCongregation] = useState(null);

  useEffect(() => {
    fetch(`/api/congregations.json`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((c) => c.id === parseInt(id));
        setCongregation(found || null);
      });
  }, [id]);

  if (!congregation)
    return (
      <div className="flex justify-center items-center h-40">Loading...</div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-4 text-sm text-gray-600 hover:text-black"
      >
        <ArrowLeft size={18} className="mr-2" /> Back to Directory
      </button>

      {/* HEADER IMAGE */}
      {congregation.images && congregation.images.length > 0 && (
        <img
          src={congregation.images[0]}
          alt={congregation.name}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
      )}

      <h1 className="text-2xl font-bold mb-2">{congregation.name}</h1>
      <p className="text-gray-700 flex items-center mb-2">
        <MapPin size={18} className="mr-2" />
        {congregation.address}, {congregation.city}, {congregation.state}, {congregation.country}
      </p>

      <div className="flex flex-col md:flex-row gap-6 my-6">
        {/* CONTACT INFO */}
        <div className="space-y-3">
          <p className="flex items-center text-gray-700">
            <Phone size={18} className="mr-2" /> {congregation.contact_phone}
          </p>
          {congregation.contact_email && (
            <p className="flex items-center text-gray-700">
              <Mail size={18} className="mr-2" /> {congregation.contact_email}
            </p>
          )}
        </div>
      </div>

      {/* WORSHIP TIMES */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Worship Times</h2>
        <ul className="space-y-2">
          {congregation.worship_times?.map((wt, idx) => (
            <li key={idx} className="border p-3 rounded-lg">
              <strong>{wt.day}</strong>: {wt.activity} ({wt.time})
            </li>
          ))}
        </ul>
      </div>

      {/* SOCIAL LINKS */}
      {congregation.social_links?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Social Media</h2>
          <ul className="flex gap-4">
            {congregation.social_links.map((sl, idx) => (
              <li key={idx}>
                <a href={sl.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                  {sl.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CongregationDetails;