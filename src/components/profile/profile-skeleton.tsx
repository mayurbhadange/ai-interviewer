import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ProfileSkeleton() {
  return (
    <main className="container p-4 md:p-6">
      {/* Avatar and User Info Skeleton */}
      <div className="mb-8 flex flex-col items-center gap-6 md:flex-row md:items-start">
        <Skeleton className="h-24 w-24 px-14 rounded-full ring-4 ring-blue-100 ring-offset-2 md:h-32 md:w-32" />
        <div className="w-full text-center md:text-left">
          <Skeleton className="mx-auto h-10 w-3/4 md:mx-0 md:w-1/2" />
          <Skeleton className="mx-auto mt-2 h-6 w-2/3 md:mx-0 md:w-1/3" />
          <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
            <Skeleton className="h-6 w-40" />
          </div>
        </div>
      </div>

      {/* About Me Card Skeleton */}
      <Card className="border mb-8">
        <CardHeader className="border-b border-blue-100 bg-blue-50">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="p-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/4" />
        </CardContent>
      </Card>

      {/* Experience Card Skeleton */}
      <Card className="border mb-8">
        <CardHeader className="border-b border-blue-100 bg-blue-50">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-1 h-4 w-48" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {[1, 2, 3].map((_, index) => (
              <div key={index}>
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                  <div>
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="mt-1 h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-28" />
                </div>
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-5/6" />
                {index < 2 && <Separator className="mt-4 bg-blue-100" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Projects Card Skeleton */}
      <Card className="border mb-8">
        <CardHeader className="border-b border-blue-100 bg-blue-50">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-1 h-4 w-48" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="p-4 bg-blue-50 border-b border-blue-100">
                  <Skeleton className="h-5 w-3/4" />
                </CardHeader>
                <CardContent className="p-4 pt-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-1 h-4 w-full" />
                  <Skeleton className="mt-1 h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Card Skeleton */}
      <Card className="border mb-8">
        <CardHeader className="border-b border-blue-100 bg-blue-50">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-1 h-4 w-48" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="h-6 w-16 md:w-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
