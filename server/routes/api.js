import { Router } from "express";
import { overview } from "../controllers/overviewController.js";
import { trends } from "../controllers/trendsController.js";
import { issues } from "../controllers/issuesController.js";
import { reviews, exportReviews } from "../controllers/reviewsController.js";
import { summary } from "../controllers/summaryController.js";
import { status, properties } from "../controllers/statusController.js";
import { refresh } from "../controllers/refreshController.js";
import { translate } from "../controllers/translateController.js";
import { languages } from "../controllers/languagesController.js";

export const api = Router();

api.get("/properties", properties);
api.get("/overview", overview);
api.get("/trends", trends);
api.get("/issues", issues);
api.get("/reviews", reviews);
api.get("/reviews/export", exportReviews);
api.post("/reviews/:id/translate", translate);
api.get("/languages", languages);
api.get("/summary", summary);
api.get("/status", status);
api.post("/refresh", refresh);
