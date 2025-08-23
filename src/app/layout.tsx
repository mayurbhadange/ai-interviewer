import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { UserProvider } from "@/context/user.context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InterviewPrep - Your AI Interviewer Assistant",

  description:
    "InterviewPrep enables user to create a personalized or customizable AI Interviews and get detailed description of the interviews with feedback, score and areas for improvements.",
  metadataBase: new URL("https://interviewprep-sigma.vercel.app/"),
  openGraph: {
    title: "InterviewPrep - AI Interviewer Assistant",
    description:
      "InterviewPrep enables user to create a personalized or customizable AI Interviews and get detailed description of the interviews with feedback, score and areas for improvements.",
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "InterviewPrep",
    images: [
      {
        url: `https://ghxuqlactvkbaqopaemm.supabase.co/storage/v1/object/public/profiles/public/Screenshot%202025-04-12%20233852.png`,
        width: 1200,
        height: 630,
        alt: "AI Interviewer Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InterviewPrep - AI Interviewer Assistant",
    description:
      "InterviewPrep enables user to create a personalized or customizable AI Interviews and get detailed description of the interviews with feedback, score and areas for improvements.",

    images: [
      `https://ghxuqlactvkbaqopaemm.supabase.co/storage/v1/object/public/profiles/public/Screenshot%202025-04-12%20233852.png`,
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            duration={2000}
            closeButton
          />
        </UserProvider>
      </body>
    </html>
  );
}
