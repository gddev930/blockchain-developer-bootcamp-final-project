import { Router } from "express";
// *added* import for bridge route
import Bridge from "./bridge";
const router = Router();
// *change here to address routes*
router.use("/bridge", Bridge);
export default router;
