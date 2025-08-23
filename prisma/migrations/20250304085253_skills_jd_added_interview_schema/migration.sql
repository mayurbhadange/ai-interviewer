-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "jobDescription" TEXT,
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[];
