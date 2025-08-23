"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowRightIcon } from "lucide-react";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { Moon_4 } from "@/components/layout/logo";

export default function LandingPage() {
  // Animation variants for text elements
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.2,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
      {/* Enhanced background gradient effects */}
      <div className="absolute inset-0 z-0">
        {/* Bottom-right gradient blob */}
        <div
          className="absolute bottom-0 right-0 w-[1300px] h-[500px] bg-gradient-to-b from-blue-400 
        to-blue-100 rounded-full blur-3xl opacity-60 transform translate-x-1/3 translate-y-1/3"
        />

        {/* Bottom-left gradient blob */}
        <div
          className="absolute bottom-0 left-0 w-[1300px] h-[500px] bg-gradient-to-tr from-blue-400 
        to-cyan-100 rounded-full blur-3xl opacity-60 transform -translate-x-1/3 translate-y-1/3"
        />
      </div>

      {/* Content positioned above the DotPattern and gradients */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center"
            >
              {" "}
              {/* <Image
                src="/assets/brand.png"
                alt="logo"
                height={30}
                width={30}
                className="px-1"
              /> */}
              <Moon_4 className="" />
              <div className="text-2xl ml-3 font-bold text-blue-600">
                <span className="tracking-tight">Interview</span>
                <span className="tracking-tight text-blue-800">Prep</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center space-x-4"
          >
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-600/80 shadow-xl 
              transition-all duration-300 hover:shadow-lg hover:translate-y-px"
            >
              <Link href="/dashboard">Get started</Link>
            </Button>
          </motion.div>
        </nav>

        {/* Hero Section with enhanced gradient effects */}
        <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="z-10 flex items-center justify-center"
          >
            <div
              className={cn(
                "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
              )}
            >
              <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                <span>✨ Your AI Interview Assistant</span>
                <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </AnimatedShinyText>
            </div>
          </motion.div>
          <div className="relative">
            {/* Hero-specific gradient effect */}
            <div className="absolute inset-0 -z-10 flex place-items-center">
              <div className="absolute h-[500px] w-full max-w-3xl mx-auto -translate-x-1/2 left-1/2 rounded-full bg-gradient-radial from-white to-transparent opacity-70 blur-2xl"></div>
              <div className="absolute h-[300px] w-[300px] -translate-x-1/2 left-1/2 translate-y-1/4 rounded-full bg-gradient-conic from-sky-200 via-blue-200 to-transparent opacity-30 blur-2xl"></div>
            </div>

            <motion.h1
              custom={0}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900"
            >
              <motion.span custom={0} variants={textVariants}>
                The all-in-one AI platform
              </motion.span>
              <br />
              <motion.span
                custom={1}
                variants={textVariants}
                className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400"
              >
                for your interviews.
              </motion.span>
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
            >
              InterviewPrep is the enterprise-ready platform to prepare for all of
              your interviews. Plus, enabling personalized feedback to improve
              your interview skills.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-600/80 w-64 shadow-xl 
                transition-all duration-300 hover:shadow-lg hover:translate-y-px"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Get started - it&apos;s free{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-4 text-sm text-gray-500"
            >
              Prepare for your next interview with our AI-assistant
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
