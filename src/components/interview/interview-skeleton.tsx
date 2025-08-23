import { Skeleton } from "@/components/ui/skeleton";

const InterviewDashboardSkeleton = () => {
  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-10 w-28" />
      </div>

      {/* Personal Interviews Skeleton */}
      <section className="mb-8">
        <Skeleton className="h-7 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((item) => (
            <div key={item} className="border rounded-lg p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <div className="flex mt-4 justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Skeleton className="h-6 w-24" />
        </div>
      </section>

      {/* Custom Interviews Skeleton */}
      <section>
        <Skeleton className="h-7 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((item) => (
            <div key={item} className="border rounded-lg p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Skeleton className="h-6 w-24" />
        </div>
      </section>
    </div>
  );
};

export default InterviewDashboardSkeleton;
