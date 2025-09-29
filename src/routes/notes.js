const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getNotesStats
} = require('../controllers/notesController');

// All routes require authentication
router.use(authenticate);

// @route   GET /api/notes
// @desc    Get all notes for authenticated user
// @access  Private
router.get('/', getNotes);

// @route   GET /api/notes/stats
// @desc    Get notes statistics for user
// @access  Private
router.get('/stats', getNotesStats);

// @route   GET /api/notes/:id
// @desc    Get single note by ID
// @access  Private
router.get('/:id', getNoteById);

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post('/', createNote);

// @route   PUT /api/notes/:id
// @desc    Update existing note
// @access  Private
router.put('/:id', updateNote);

// @route   DELETE /api/notes/:id
// @desc    Delete note
// @access  Private
router.delete('/:id', deleteNote);

module.exports = router;