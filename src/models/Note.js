const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Note title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Note content is required'],
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  tags: {
    type: String,
    default: '',
    trim: true,
    maxlength: [500, 'Tags cannot exceed 500 characters']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    index: true 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
    ref: 'User',
    index: true
  }
}, {
  timestamps: true, 
  collection: 'tb_notes'
});

// index query untuk pengguna yg login
noteSchema.index({ userId: 1, createdAt: -1 });
noteSchema.index({ username: 1, createdAt: -1 });

// index untuk pencarian
noteSchema.index({
  title: 'text',
  content: 'text',
  tags: 'text'
});

// method untuk menampilkan catatan
noteSchema.statics.getUserNotes = async function(userId, options = {}) {
  const {
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;

  const query = { userId };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const notes = await this.find(query)
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const total = await this.countDocuments(query);

  return {
    notes,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  };
};

// format catatan
noteSchema.methods.toAPIResponse = function() {
  const note = this.toObject();
  
  // format tanggal untuk catatan
  note.createdAt = this.createdAt.toLocaleDateString('id-ID');
  note.updatedAt = this.updatedAt.toLocaleDateString('id-ID');
  
  return note;
};

// method untuk tags (biar bisa disearch)
noteSchema.pre('save', function(next) {
  if (this.tags) {
    const tagArray = this.tags.match(/#?[\w\u00C0-\u017F]+/g) || [];
    const cleanTags = [...new Set(tagArray.map(tag => 
      tag.startsWith('#') ? tag : `#${tag}`
    ))];
    this.tags = cleanTags.join(' ');
  }
  next();
});

module.exports = mongoose.model('Note', noteSchema);
