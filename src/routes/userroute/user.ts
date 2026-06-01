import { Router } from "express";
import { getAllBooking, getOwnBookings  , createBooking , deleteBooking} from "../../controllers/usercontroller";
import { isAuthUser } from "../../middleware/auth";

const router = Router();

router.get("/getAllBookings", isAuthUser,  getAllBooking );
router.get("/getOwnBooking" , isAuthUser , getOwnBookings);
router.post("/createBooking" , isAuthUser , createBooking);
router.delete("/deleteBooking/:id" , isAuthUser , deleteBooking);

export default router;