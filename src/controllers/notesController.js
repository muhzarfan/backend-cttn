const Note = require('../models/Note');

// Get all notes for authenticated user
const getNotes = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const result = await Note.getUserNotes(userId, {
      page: parseInt(page),
      search,
      sortBy,
      sortOrder
    });

    // Format notes for API response
    const formattedNotes = result.notes.map(note => note.toAPIResponse());

    res.json({
      success: true,
      data: {
        notes: formattedNotes,
        pagination: {
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          total: result.total,
          hasNextPage: result.currentPage < result.totalPages,
          hasPrevPage: result.currentPage > 1
        }
      }
    });

  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notes'
    });
  }
};

// Get single note by ID
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const note = await Note.findOne({ _id: id, userId });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.json({
      success: true,
      data: {
        note: note.toAPIResponse()
      }
    });

  } catch (error) {
    console.error('Get note by ID error:', error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching note'
    });
  }
};

// Create new note
const createNote = async (req, res) => {
  try {
    const { title, content, tags = '' } = req.body;
    const userId = req.user._id;
    const username = req.user.username;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    const note = new Note({
      title: title.trim(),
      content: content.trim(),
      tags: tags.trim(),
      userId,
      username
    });

    await note.save();

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: {
        note: note.toAPIResponse()
      }
    });

  } catch (error) {
    console.error('Create note error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating note'
    });
  }
};

// Update existing note
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const userId = req.user._id;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    const updateData = {
      title: title.trim(),
      content: content.trim(),
      tags: tags ? tags.trim() : ''
    };

    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.json({
      success: true,
      message: 'Note updated successfully',
      data: {
        note: note.toAPIResponse()
      }
    });

  } catch (error) {
    console.error('Update note error:', error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID format'
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating note'
    });
  }
};

// Delete note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const note = await Note.findOneAndDelete({ _id: id, userId });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });

  } catch (error) {
    console.error('Delete note error:', error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting note'
    });
  }
};

// Get notes statistics for user
const getNotesStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Note.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalNotes: { $sum: 1 },
          totalTags: {
            $sum: {
              $size: {
                $filter: {
                  input: { $split: ["$tags", " "] },
                  as: "tag",
                  cond: { $ne: ["$$tag", ""] }
                }
              }
            }
          },
          averageContentLength: { $avg: { $strLenCP: "$content" } },
          latestNote: { $max: "$createdAt" },
          oldestNote: { $min: "$createdAt" }
        }
      }
    ]);

    const result = stats[0] || {
      totalNotes: 0,
      totalTags: 0,
      averageContentLength: 0,
      latestNote: null,
      oldestNote: null
    };

    res.json({
      success: true,
      data: {
        stats: result
      }
    });

  } catch (error) {
    console.error('Get notes stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notes statistics'
    });
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getNotesStats
};
