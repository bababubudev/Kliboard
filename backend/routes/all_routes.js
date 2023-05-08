import express from "express"
import get_home from "../controllers/home_controller.js"
import post_inbox from "../controllers/inbox_controller.js"

const router = express.Router();

router.get("/", get_home).post("/inbox", post_inbox);

export default router;