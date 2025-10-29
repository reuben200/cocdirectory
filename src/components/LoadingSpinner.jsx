const LoadingSpinner = () => {
  return (
    <div className="w-full flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-800"></div>
    </div>
  );
};

export default LoadingSpinner;