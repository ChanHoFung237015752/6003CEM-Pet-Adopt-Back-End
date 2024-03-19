-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "isNeutered" BOOLEAN NOT NULL,
    "isVaccinated" BOOLEAN NOT NULL,
    "personality" TEXT NOT NULL,
    "ownerId" INTEGER,
    CONSTRAINT "Dog_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Dog" ("age", "breed", "color", "gender", "id", "isNeutered", "isVaccinated", "name", "personality", "size") SELECT "age", "breed", "color", "gender", "id", "isNeutered", "isVaccinated", "name", "personality", "size" FROM "Dog";
DROP TABLE "Dog";
ALTER TABLE "new_Dog" RENAME TO "Dog";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
