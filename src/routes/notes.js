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

router.use(authenticate);
router.get('/', getNotes);
router.get('/stats', getNotesStats);
router.get('/:id', getNoteById);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
