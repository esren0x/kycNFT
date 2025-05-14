export function SkeletonCard() {
  return (
    <div className="relative w-80 rounded-xl overflow-hidden bg-gray-200 p-[16px] shadow-lg animate-pulse">
      <div className="bg-gray-300 rounded-xl p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-24 bg-gray-400 rounded"></div>
          <div className="w-3 h-3 rounded-full bg-gray-400"></div>
        </div>
        <div className="w-full h-48 bg-gray-400 rounded-lg mb-4"></div>
        <div className="space-y-3">
          <div>
            <div className="h-4 w-24 bg-gray-400 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-400 rounded"></div>
          </div>
          <div>
            <div className="h-4 w-24 bg-gray-400 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-400 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
