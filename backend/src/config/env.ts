import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/ekart",
  jwtSecret: process.env.JWT_SECRET || "ekart-dev-secret-change-me",
  adminUsername: process.env.ADMIN_USERNAME || "admin",
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
};
