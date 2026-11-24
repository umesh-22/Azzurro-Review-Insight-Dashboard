import express from "express";
import cors from "cors";
import { settings } from "./config/settings.js";
import { api } from "./routes/api.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", api);
app.use(errorHandler);

app.listen(settings.port, () => console.log(`Server running on http://localhost:${settings.port}`));
