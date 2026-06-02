import { Router } from "express";
import { getAllBooking, getOwnBookings  , createBooking , deleteBooking} from "../../controllers/usercontroller.js";
import { isAuthUser } from "../../middleware/auth.js";

const router = Router();

router.get("/user/getAllBookings", isAuthUser,  getAllBooking );
router.get("/user/getOwnBooking" , isAuthUser , getOwnBookings);
router.post("/user/createBooking" , isAuthUser , createBooking);
router.delete("/user/deleteBooking/:id" , isAuthUser , deleteBooking);

export default router;