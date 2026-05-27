import express from "express";
import { authMiddleware } from "../middleware/auth.midleware.js";
import {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/notes.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/getAllNotes", getAllNotes);
router.post("/createNewNote", createNote);
router.patch("/updateNote/:id", updateNote);
router.delete("/deleteNote/:id", deleteNote);

export default router;
