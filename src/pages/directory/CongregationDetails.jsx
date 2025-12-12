import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Clock,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Facebook,
  Twitter,
  Instagram,
  Globe,
  ChevronLeft,
  ChevronRight,
  Share2,
} from "lucide-react";
import MapSection from "./MapSection";

const CongregationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [congregation, setCongregation] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/congregations.json`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((c) => c.id === parseInt(id));
        setCongregation(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const nextImage = () => {
    if (congregation?.images) {
      setCurrentImageIndex((prev) =>
        prev === congregation.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (congregation?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? congregation.images.length - 1 : prev - 1
      );
    }
  };

  const getSocialIcon = (platform) => {
    const lowerPlatform = platform.toLowerCase();
    if (lowerPlatform.includes("facebook"))
      return <Facebook className="h-5 w-5" />;
    if (lowerPlatform.includes("twitter"))
      return <Twitter className="h-5 w-5" />;
    if (lowerPlatform.includes("instagram"))
      return <Instagram className="h-5 w-5" />;
    return <Globe className="h-5 w-5" />;
  };

  const handleShare = async () => {
    const shareData = {
      title: congregation.name,
      text: `Check out ${congregation.name} on Church of Christ Directory`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading congregation details...
          </p>
        </div>
      </div>
    );
  }

  if (!congregation) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Congregation Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The congregation you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Directory
        </button>
      </div>
    );
  }

  const hasImages = congregation.images && congregation.images.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-6 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Directory
        </button>

        {/* Image Carousel */}
        {hasImages && (
          <div className="mb-8">
            {/* Main Image */}
            <div className="relative w-full h-96 md:h-[500px] bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <img
                src={congregation.images[currentImageIndex]}
                alt={`${congregation.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              {congregation.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                {currentImageIndex + 1} / {congregation.images.length}
              </div>
            </div>

            {/* Thumbnails */}
            {congregation.images.length > 1 && (
              <div className="flex gap-2 justify-center mt-4 overflow-x-auto pb-2 px-5 lg:px-10">
                {congregation.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex
                        ? "border-blue-500 shadow-lg scale-105"
                        : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {congregation.name}
                  </h1>
                  <div className="flex items-center gap-3">
                    {congregation.verified ? (
                      <span className="inline-flex items-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center bg-gray-100 dark:bg-gray-700 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm font-semibold">
                        <XCircle className="h-4 w-4 mr-1" />
                        Unverified
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>

              <div className="flex items-start text-gray-700 dark:text-gray-300">
                <MapPin className="h-5 w-5 mr-2 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
                <p className="text-base">
                  {congregation.address}, {congregation.city},{" "}
                  {congregation.lga}, {congregation.state},{" "}
                  {congregation.country}
                </p>
              </div>
            </div>

            {/* Worship Times Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                Worship Times
              </h2>
              <div className="space-y-3">
                {congregation.worship_times?.map((wt, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-lg">
                          {wt.day}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          {wt.activity}
                        </p>
                      </div>
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                        {wt.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Section */}
            {congregation.location && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <MapPin className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                  Location Map
                </h2>
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <MapSection location={congregation.location} />
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact & Social */}
          <div className="space-y-6">
            {/* Contact Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h2>

              <div className="space-y-4">
                {/* Preacher */}
                {congregation.preacher_name && (
                  <div className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                        Preacher
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {congregation.preacher_name}
                      </p>
                    </div>
                  </div>
                )}

                {/* Phone */}
                <div className="flex items-start">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
                    <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                      Phone
                    </p>
                    <a
                      href={`tel:${congregation.contact_phone}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      {congregation.contact_phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                {congregation.contact_email && (
                  <div className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                        Email
                      </p>
                      <a
                        href={`mailto:${congregation.contact_email}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium break-all"
                      >
                        {congregation.contact_email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Created Date */}
                {congregation.created_at && (
                  <div className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                        Listed Since
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {new Date(congregation.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media Card */}
            {congregation.social_links?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Connect With Us
                </h2>
                <div className="space-y-2">
                  {congregation.social_links.map((sl, idx) => (
                    <a
                      key={idx}
                      href={sl.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors border border-blue-200 dark:border-blue-800"
                    >
                      <div className="mr-3 text-blue-600 dark:text-blue-400">
                        {getSocialIcon(sl.platform)}
                      </div>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {sl.platform}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CongregationDetails;
