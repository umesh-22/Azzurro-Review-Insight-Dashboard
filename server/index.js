import express from "express";
import cors from "cors";
import { settings } from "./config/settings.js";
import { api } from "./routes/api.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { health } from "./controllers/healthController.js";

const app = express();

app.use(cors({ origin: settings.allowedOrigins }));
app.use(express.json());
app.get("/health", health);
app.use("/api", api);
app.use(errorHandler);

app.listen(settings.port, () => console.log(`Server running on http://localhost:${settings.port}`));
