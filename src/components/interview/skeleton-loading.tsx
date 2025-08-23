import { Skeleton } from "@/components/ui/skeleton"

export function InterviewFeedbackSkeleton() {
  return (
    <div>
      {/* Header Skeleton */}
      <div className="bg-blue-500 text-white py-8 px-4">
        <div className="container mx-auto">
          <Skeleton className="h-8 w-64 bg-blue-400/50" />
          <Skeleton className="h-4 w-96 mt-2 bg-blue-400/50" />
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="space-y-8">
          {/* Performance Overview Skeleton */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-72" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-7 w-16" />
              </div>
              <Skeleton className="h-2 w-32" />
            </div>
          </div>

          {/* Tabs Skeleton */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-blue-50 p-1 rounded-md">
                <div className="flex space-x-1">
                  <Skeleton className="h-9 w-32 bg-blue-500/20" />
                  <Skeleton className="h-9 w-24 bg-blue-500/20" />
                </div>
              </div>
              <Skeleton className="h-9 w-24" />
            </div>

            {/* Feedback Items Skeleton */}
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <FeedbackItemSkeleton key={index} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeedbackItemSkeleton() {
  return (
    <div className="mb-4">
      <div className="p-4 bg-card rounded-lg border shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function SummaryCardSkeleton() {
  return (
    <div className="border rounded-lg p-6">
      <Skeleton className="h-7 w-48 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <SummaryItemSkeleton key={index} />
          ))}
      </div>

      <SummaryItemSkeleton />

      <div className="mt-6 pt-6 border-t flex justify-between items-center">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}

function SummaryItemSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full bg-blue-500/30" />
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
    </div>
  )
}
