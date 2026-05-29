import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { notes } from "../schema/notes.js";
import { createSchema } from "../validator/notes.validator.js";
import { v4 as uuidv4 } from "uuid";
import { generateTag } from "../services/groq.services.js";

//Get all notes
const getAllNotes = async (req, res) => {
  try {
    const { search, page = 1, limit } = req.query;

    let query = db.select().from(notes);

    //filtering
    if (search) {
      query = query.where(sql`${notes.title} ILIKE ${"%" + search + "%"}`);
    }

    //pagination
    const offset = (page - 1) * limit;
    const result = await query.limit(Number(limit)).offset(offset);

    res.status(200).json({
      success: true,
      total: result.length,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to get all notes" });
  }
};

//Create new Notes
const createNote = async (req, res) => {
  try {
    const validatedSchema = createSchema.parse(req.body);

    const [newNote] = await db
      .insert(notes)
      .values({
        userId: req.user.id,
        title: validatedSchema.title,
        body: validatedSchema.body,
      })
      .returning();

    res.status(200).json({
      success: true,
      data: newNote,
      message: "New Note Created",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to create new notes" });
  }
};

//Update a Note by its id
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;

    const [updatedNote] = await db
      .update(notes)
      .set({
        ...(title && { title }),
        ...(body && { body }),
      })
      .where(eq(notes.id, Number(id)))
      .returning();

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: updatedNote,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to update notes" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNote = await db
      .delete(notes)
      .where(eq(notes.id, Number(id)))
      .returning();

    if (!deletedNote.length) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to delete note" });
  }
};

const generateNoteTags = async (req, res) => {
  try {
    const NoteId = req.params.id;
    const note = await db
      .select()
      .from(notes)
      .where(eq(notes.id, Number(NoteId)));

    if (!note) {
      return res.status(401).json({
        sucees: false,
        message: "There are no notes",
      });
    }

    if (note[0].tags && note[0].tags.length > 0) {
      return res.status(200).json({
        success: true,
        cached: true,
        tags: note[0].tags,
      });
    }

    const generatedTags = generateTag(note[0].body);

    //check if generatedtags is a string is an array or string before splitting
    const tagsArray = Array.isArray(generatedTags)
      ? generatedTags.map((tag) => tag.trim())
      : String(generatedTags)
          .split(",")
          .map((tag) => tag.trim());

    await db
      .update(notes)
      .set({ tags: tagsArray })
      .where(eq(notes.id, Number(NoteId)));

    res.status(200).json({
      success: true,
      cached: false,
      tags: tagsArray,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to generate tags for note" });
  }
};

export { getAllNotes, createNote, updateNote, deleteNote, generateNoteTags };
