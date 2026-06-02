import { Router } from "express";
import { getAllBooking, getOwnBookings  , createBooking , } from "../../controllers/usercontroller.js";
import { deleteAnyBooking , getUserSummary } from "../../controllers/ownercontroller.js";
import { isAuthUser , isOwner } from "../../middleware/auth.js";

const router = Router();

router.get("/owner/getAllBookings", isAuthUser, isOwner, getAllBooking );
router.get("/owner/getOwnBooking" , isAuthUser, isOwner, getOwnBookings);
router.post("/owner/createBooking" , isAuthUser, isOwner, createBooking);
router.delete("/owner/deleteBooking/:id" , isAuthUser, isOwner, deleteAnyBooking);
router.get("/owner/summary" , isAuthUser , isOwner , getUserSummary);

export default router;