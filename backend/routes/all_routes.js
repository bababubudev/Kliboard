import express from "express"
import { get_home, post_home } from "../controllers/home_controller.js"
import
{
    get_inbox,
    get_all_inbox,
    post_inbox,
    update_inbox,
    delete_inbox
} from "../controllers/inbox_controller.js"

const router = express.Router();

router.get("/", get_home).post("/", post_home);
router.get("/inbox/:id", get_inbox).get("/inbox", get_all_inbox).post("/inbox", post_inbox);
router.patch("/inbox/:id", update_inbox).delete("/inbox/:id", delete_inbox);

export default router;