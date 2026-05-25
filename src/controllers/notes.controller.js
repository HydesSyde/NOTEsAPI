import { notes } from "../data/notes.store.js";
import { createSchema } from "../validator/notes.validator.js";
import { v4 as uuidv4 } from "uuid";

//Get all notes
const getAllNotes = (req, res) => {
  try {
    const result = [...notes];

    const { search, sort, order, page = 1, limit } = req.query;

    //filtering
    if (search) {
      result.filter((note) => {
        note.toLowerCase().includes(search.toLowerCase());
      });
    }

    //pagination
    const start = (page - 1) * limit;
    const end = start + Number(limit);

    const paginatedNotes = result.splice(start, end);

    res.status(200).json({
      success: true,
      total: result.length,
      data: paginatedNotes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to get all notes" });
  }
};

//Create new Notes
const createNote = (req, res) => {
  try {
    const validatedSchema = createSchema.parse(req.body);

    const newNote = {
      id: uuidv4(),
      ...validatedSchema,
      createdAt: Date.now(),
      upDatedAt: Date.now(),
    };

    notes.push(newNote);

    res.status(200).json({
      success: true,
      data: newNote,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to create new notes" });
  }
};

//Update a Note by its id
const updateNote = (req, res) => {
  try {
    const note = notes.find((note) => note.id === req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (req.body.title) note.title = req.body.title;
    if (req.body.body) note.body = req.body.body;

    note.updatedAt = new Date();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: note,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to find notes" });
  }
};

const deleteNote = (req, res) => {
  const noteIndex = notes.findIndex((note) => note.id === req.params.id);

  if (noteIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
    });
  }

  notes.splice(noteIndex, 1);

  res.status(200).json({
    success: true,
    message: "Note deleted successfully",
  });
};

export { getAllNotes, createNote, updateNote, deleteNote };
