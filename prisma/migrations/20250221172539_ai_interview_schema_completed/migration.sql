/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerkUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkUserId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InterviewType" AS ENUM ('PERSONAL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "FeedbackLabel" AS ENUM ('GOOD', 'NEEDS_IMPROVEMENT');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "clerkUserId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ALTER COLUMN "email" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "fkUserId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "aboutMe" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "fkProfileId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "fkProfileId" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "fkProfileId" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "fkUserId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "InterviewType" NOT NULL,
    "questions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewFeedback" (
    "id" TEXT NOT NULL,
    "fkInterviewId" TEXT NOT NULL,

    CONSTRAINT "InterviewFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "fkInterviewFeedbackId" TEXT NOT NULL,
    "label" "FeedbackLabel" NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "suggesstionForImprovement" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_fkUserId_key" ON "Profile"("fkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Experience_fkProfileId_key" ON "Experience"("fkProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_fkProfileId_key" ON "Project"("fkProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_fkProfileId_key" ON "Skill"("fkProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Interview_fkUserId_key" ON "Interview"("fkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewFeedback_fkInterviewId_key" ON "InterviewFeedback"("fkInterviewId");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_fkInterviewFeedbackId_key" ON "Feedback"("fkInterviewFeedbackId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_fkUserId_fkey" FOREIGN KEY ("fkUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_fkProfileId_fkey" FOREIGN KEY ("fkProfileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_fkProfileId_fkey" FOREIGN KEY ("fkProfileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_fkProfileId_fkey" FOREIGN KEY ("fkProfileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_fkUserId_fkey" FOREIGN KEY ("fkUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewFeedback" ADD CONSTRAINT "InterviewFeedback_fkInterviewId_fkey" FOREIGN KEY ("fkInterviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_fkInterviewFeedbackId_fkey" FOREIGN KEY ("fkInterviewFeedbackId") REFERENCES "InterviewFeedback"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
