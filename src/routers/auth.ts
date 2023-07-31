import { Router } from "express";
import { googleOAuth } from "../controllers/auth";

const router = Router();

router.get("/google", googleOAuth);

export default router;
