import { config } from "dotenv";

config();

export default {
    host: process.env.host || "",
    user: process.env.user || "",
    password: process.env.password || "",
    database: process.env.database || ""
};