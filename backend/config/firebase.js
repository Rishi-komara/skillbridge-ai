import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { getAuth } from "firebase-admin/auth";

import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      })
    : getApps()[0];

const db = getDatabase(app);
const auth = getAuth(app);

export { app, db, auth };