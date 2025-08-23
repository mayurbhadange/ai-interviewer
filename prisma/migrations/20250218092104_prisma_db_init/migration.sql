-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'John Doe',
    "email" TEXT NOT NULL DEFAULT 'john.doe@gmail.com',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
