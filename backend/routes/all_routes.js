import express from "express";
import { get_home } from "../controllers/home_controller.js";
import
{
    get_inbox_name,
    post_inbox,
    update_inbox
} from "../controllers/inbox_controller.js";

const router = express.Router();

router.get("/", get_home);
router.get("/inbox/:name", get_inbox_name).post("/inbox", post_inbox);
router.patch("/inbox/:name", update_inbox);

export default router;