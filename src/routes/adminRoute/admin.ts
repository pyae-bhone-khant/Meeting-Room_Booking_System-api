import { Router } from "express";
import { getAllBooking, getOwnBookings  , createBooking , } from "../../controllers/usercontroller";
import { deleteAnyBooking , getUserSummary } from "../../controllers/ownercontroller";
import { isAdmin, isAuthUser } from "../../middleware/auth";
import { getAllUsers , createUser , changeUserRole , deleteUser } from "../../controllers/admincontroller";

const router = Router();

router.get("/admin/getAllBookings", isAuthUser, isAdmin, getAllBooking );
router.get("/admin/getOwnBooking" , isAuthUser, isAdmin, getOwnBookings);
router.post("/admin/createBooking" , isAuthUser, isAdmin, createBooking);
router.delete("/admin/deleteBooking/:id" , isAuthUser, isAdmin, deleteAnyBooking);
router.get("/admin/summary" , isAuthUser , isAdmin , getUserSummary);

router.get("/admin/getAllUsers", isAuthUser, isAdmin, getAllUsers);
router.post("/admin/createUser", isAuthUser, isAdmin,  createUser);
router.post("/admin/changeUserRole/:id" , isAuthUser , isAdmin , changeUserRole) 
router.delete('/admin/deleteUser/:id' , isAuthUser , isAdmin , deleteUser)

export default router;