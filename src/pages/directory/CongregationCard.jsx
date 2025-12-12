import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CongregationCard = ({ congregation }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {congregation.images && congregation.images.length > 0 && (
        <img
          src={congregation?.images?.[0] || "/images/congregation-default.jpg"}
          alt={congregation?.name || "Congregation"}
          className="w-full h-48 object-cover"
          onError={(e) => (e.target.src = "/images/congregation-default.jpg")}
        />
      )}

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">
          {congregation.congregation_name}
        </h2>

        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          {congregation.city}, {congregation.country}
        </div>

        {congregation.preacher_name && (
          <p className="text-gray-700 text-sm mb-2 font-medium">
            Preacher: {congregation.preacher_name}
          </p>
        )}

        {congregation.contact_phone && (
          <div className="flex items-center text-gray-600 text-sm mb-1">
            <Phone className="w-4 h-4 mr-1" /> {congregation.contact_phone}
          </div>
        )}

        {congregation.contact_email && (
          <div className="flex items-center text-gray-600 text-sm mb-4">
            <Mail className="w-4 h-4 mr-1" /> {congregation.contact_email}
          </div>
        )}

        <Link
          to={`/directory/${congregation.id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          View Details <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default CongregationCard;
