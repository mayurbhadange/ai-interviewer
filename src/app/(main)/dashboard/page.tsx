"use client";
import DashboardContent from "@/components/dashboard/dashboard-content";
import { withAuth } from "@/context/auth.context";
import useInterviews from "@/hooks/use-interviews";

function DashboardPage() {
  const { loading, interviews } = useInterviews();

  return <DashboardContent loading={loading} interviews={interviews} />;
}

export default withAuth(DashboardPage);
