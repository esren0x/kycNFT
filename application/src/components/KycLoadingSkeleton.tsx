export const KycLoadingSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Status/Action Skeleton */}
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded-md w-1/2 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-md w-3/4 mx-auto mb-4"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-1/3 mx-auto"></div>
      </div>
    </div>
  );
};
