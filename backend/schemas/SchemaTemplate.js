/**
 * Schema Template for SaadhanaBoard
 * 
 * This is a template file showing the pattern for creating Mongoose schemas.
 * Copy this file and customize for each collection.
 * 
 * Naming Conventions:
 * - Fields: camelCase (not snake_case)
 * - Collections: lowercase (e.g., users, sadhanas)
 * - Models: PascalCase (e.g., User, Sadhana)
 * - Foreign Keys: userId, bookId, etc. (not user_id)
 * 
 * Documentation:
 * - All fields must be documented with purpose
 * - All indexes must be documented with reason
 * - All validations must be documented with rules
 */

const mongoose = require('mongoose');

/**
 * Schema: SchemaName
 * 
 * Purpose: Brief description of what this collection stores
 * 
 * Key Fields:
 *   - fieldName: Description
 * 
 * Relationships:
 *   - userId: References User collection
 * 
 * Indexes:
 *   - userId: For user-specific queries
 *   - createdAt: For chronological ordering
 */
const schemaNameSchema = new mongoose.Schema(
  {
    // Example field - replace with actual fields
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
      description: 'Reference to the user who owns this record'
    },

    // Text field example
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      description: 'Main title or name'
    },

    // Optional text field
    description: {
      type: String,
      trim: true,
      default: null,
      description: 'Optional detailed description'
    },

    // Enumerated field example
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active',
      index: true,
      description: 'Current status of the record'
    },

    // Boolean flag
    isPublic: {
      type: Boolean,
      default: false,
      description: 'Whether this record is publicly visible'
    },

    // Number field
    priority: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
      description: 'Priority level (1-10)'
    },

    // Date field
    dueDate: {
      type: Date,
      description: 'When this item is due'
    },

    // Timestamps - automatically managed by Mongoose
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      description: 'When this record was created'
    },

    updatedAt: {
      type: Date,
      default: Date.now,
      description: 'When this record was last updated'
    }
  },
  {
    timestamps: false, // Set to true to auto-update createdAt/updatedAt
    collection: 'schemaname' // Lowercase collection name
  }
);

// ============================================================================
// INDEXES
// ============================================================================

// Single field indexes
schemaNameSchema.index({ createdAt: -1 });

// Compound indexes for common query patterns
schemaNameSchema.index({ userId: 1, createdAt: -1 });
schemaNameSchema.index({ status: 1, isPublic: 1 });

// Unique indexes

// Text search indexes (for full-text search)
schemaNameSchema.index({ title: 'text', description: 'text' });

// TTL (Time To Live) indexes - auto-delete after expiry
// schemaNameSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// ============================================================================
// VALIDATIONS
// ============================================================================

// Custom validation example
schemaNameSchema.pre('save', async function(next) {
  try {
    // Validate custom business logic here
    // Example: Check if user exists
    // const user = await mongoose.model('User').findById(this.userId);
    // if (!user) {
    //   throw new Error('User does not exist');
    // }
    
    next();
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// MIDDLEWARE HOOKS
// ============================================================================

// Pre-save hook - runs before saving
schemaNameSchema.pre('save', function(next) {
  // Auto-update the updatedAt timestamp
  this.updatedAt = new Date();
  next();
});

// Post-save hook - runs after saving
schemaNameSchema.post('save', function(doc) {
  // Log successful save
  console.log(`${doc._id} has been saved`);
});

// Post-find hooks - populate references
schemaNameSchema.post('findOne', async function(doc) {
  if (doc) {
    // Add post-retrieval processing if needed
  }
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Convert to JSON response format
 * Remove sensitive fields, format data for API responses
 */
schemaNameSchema.methods.toJSON = function() {
  const obj = this.toObject();
  
  // Remove sensitive fields
  delete obj.__v;
  
  return obj;
};

/**
 * Check if user owns this record
 * @param {String} userId - User ID to check
 * @returns {Boolean}
 */
schemaNameSchema.methods.isOwnedBy = function(userId) {
  return this.userId.toString() === userId.toString();
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Find by user ID
 * @param {String} userId - User ID
 * @returns {Promise<Array>} Array of documents
 */
schemaNameSchema.statics.findByUserId = function(userId) {
  return this.find({ userId });
};

/**
 * Find active records
 * @returns {Promise<Array>} Array of active documents
 */
schemaNameSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

/**
 * Count by user
 * @param {String} userId - User ID
 * @returns {Promise<Number>} Count of documents
 */
schemaNameSchema.statics.countByUserId = function(userId) {
  return this.countDocuments({ userId });
};

// ============================================================================
// VIRTUAL FIELDS (computed properties)
// ============================================================================

/**
 * Virtual field example - computed property not stored in database
 * Usage: doc.isDue (no parentheses needed)
 */
schemaNameSchema.virtual('isDue').get(function() {
  if (!this.dueDate) return false;
  return new Date() > this.dueDate;
});

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = mongoose.model('SchemaName', schemaNameSchema);

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/**
 * How to use this schema:
 * 
 * const SchemaName = require('./schemas/SchemaName');
 * 
 * // Create
 * const doc = await SchemaName.create({
 *   userId: '507f1f77bcf86cd799439011',
 *   title: 'Example'
 * });
 * 
 * // Read
 * const doc = await SchemaName.findById(id);
 * 
 * // Update
 * const doc = await SchemaName.findByIdAndUpdate(id, { title: 'New' });
 * 
 * // Delete
 * await SchemaName.findByIdAndDelete(id);
 * 
 * // Query
 * const docs = await SchemaName.find({ status: 'active' });
 * 
 * // Complex query with aggregation
 * const docs = await SchemaName.aggregate([
 *   { $match: { userId: ObjectId('...') } },
 *   { $sort: { createdAt: -1 } },
 *   { $limit: 10 }
 * ]);
 */
