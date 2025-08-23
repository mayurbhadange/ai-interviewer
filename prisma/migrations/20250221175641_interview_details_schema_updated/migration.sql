/*
  Warnings:

  - You are about to drop the column `fkInterviewFeedbackId` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the `InterviewFeedback` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[fkInterviewDetailsId]` on the table `Feedback` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fkInterviewDetailsId` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_fkInterviewFeedbackId_fkey";

-- DropForeignKey
ALTER TABLE "InterviewFeedback" DROP CONSTRAINT "InterviewFeedback_fkInterviewId_fkey";

-- DropIndex
DROP INDEX "Feedback_fkInterviewFeedbackId_key";

-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "fkInterviewFeedbackId",
DROP COLUMN "score",
ADD COLUMN     "fkInterviewDetailsId" TEXT NOT NULL;

-- DropTable
DROP TABLE "InterviewFeedback";

-- CreateTable
CREATE TABLE "InterviewDetails" (
    "id" TEXT NOT NULL,
    "fkInterviewId" TEXT NOT NULL,
    "video" TEXT NOT NULL,

    CONSTRAINT "InterviewDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Summary" (
    "id" TEXT NOT NULL,
    "fkInterviewDetailsId" TEXT NOT NULL,
    "relevantResponses" TEXT NOT NULL,
    "clarityAndStructure" TEXT NOT NULL,
    "professionalLanguage" TEXT NOT NULL,
    "initialIdeas" TEXT NOT NULL,
    "additionalNotableAspects" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "Summary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InterviewDetails_fkInterviewId_key" ON "InterviewDetails"("fkInterviewId");

-- CreateIndex
CREATE UNIQUE INDEX "Summary_fkInterviewDetailsId_key" ON "Summary"("fkInterviewDetailsId");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_fkInterviewDetailsId_key" ON "Feedback"("fkInterviewDetailsId");

-- AddForeignKey
ALTER TABLE "InterviewDetails" ADD CONSTRAINT "InterviewDetails_fkInterviewId_fkey" FOREIGN KEY ("fkInterviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_fkInterviewDetailsId_fkey" FOREIGN KEY ("fkInterviewDetailsId") REFERENCES "InterviewDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Summary" ADD CONSTRAINT "Summary_fkInterviewDetailsId_fkey" FOREIGN KEY ("fkInterviewDetailsId") REFERENCES "InterviewDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
