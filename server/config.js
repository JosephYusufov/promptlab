import * as dotenv from "dotenv";
dotenv.config();
// require('dotenv').config()
const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3001,
  backendUri: process.env.BACKEND_URI || null,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri:
    process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    "mongodb://" +
      (process.env.IP || "localhost") +
      ":" +
      (process.env.MONGO_PORT || "27017") +
      "/mernproject",
  openaiKey: process.env.OPENAI_KEY || null,
  openaiModel: process.env.OPENAI_MODEL || null,
  openaiOrganization: process.env.OPENAI_ORGANIZATION || null,
};

export default config;
