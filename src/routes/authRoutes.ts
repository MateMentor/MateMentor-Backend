/** @format */

import express from "express";
import register from "../controllers/auth/register";

const router = express.Router();

router.post("/register", register);

export default router;
