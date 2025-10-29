import { MapPin } from "lucide-react";

// Placeholder map section - later we will integrate Leaflet or Google Maps
const MapSection = ({ latitude, longitude, name }) => {
  return (
    <div className="w-full h-64 bg-gray-200 flex flex-col justify-center items-center rounded-lg mt-8">
      <MapPin size={32} className="mb-2" />
      <p className="text-gray-700 text-sm">Map preview will be shown here</p>
      {latitude && longitude && (
        <p className="text-xs mt-1 text-gray-500">Location: {latitude}, {longitude}</p>
      )}
    </div>
  );
};

export default MapSection;
