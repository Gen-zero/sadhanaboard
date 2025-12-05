/**
 * Schema: SadhanaStoreItem
 * 
 * Purpose: Stores metadata for items/offerings in a sadhana
 * 
 * Key Fields:
 *   - sadhanaId: Reference to parent Sadhana
 *   - data: Flexible data storage for custom items
 * 
 * Relationships:
 *   - Many-to-one with Sadhana
 * 
 * Indexes:
 *   - sadhanaId: For finding items in a sadhana
 */

const mongoose = require('mongoose');

const sadhanaStoreItemSchema = new mongoose.Schema(
  {
    // Reference to sadhana
    sadhanaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sadhana',
      required: [true, 'Sadhana ID is required'],
      index: true,
      description: 'Reference to parent Sadhana'
    },

    // Flexible data storage (can store any structure)
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      description: 'Flexible data storage for sadhana items'
    },

    // Item metadata
    itemType: {
      type: String,
      enum: ['offering', 'ritual_item', 'tool', 'resource', 'other'],
      default: 'offering',
      description: 'Type of item'
    },

    itemName: {
      type: String,
      trim: true,
      maxlength: 200,
      default: null,
      description: 'Name of the item'
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
      description: 'Description of the item'
    },

    // Quantity tracking
    quantity: {
      type: Number,
      min: 0,
      default: 1,
      description: 'Quantity of items'
    },

    unit: {
      type: String,
      trim: true,
      default: null,
      description: 'Unit of measurement'
    },

    // Status
    status: {
      type: String,
      enum: ['available', 'used', 'unavailable', 'archived'],
      default: 'available',
      description: 'Current status of item'
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
      description: 'When item was created'
    },

    updatedAt: {
      type: Date,
      default: Date.now,
      description: 'When item was last updated'
    }
  },
  {
    timestamps: false,
    collection: 'sadhastoreitems'
  }
);

// ============================================================================
// INDEXES
// ============================================================================

sadhanaStoreItemSchema.index({ sadhanaId: 1 });
sadhanaStoreItemSchema.index({ sadhanaId: 1, status: 1 });
sadhanaStoreItemSchema.index({ createdAt: -1 });

// ============================================================================
// VALIDATIONS & HOOKS
// ============================================================================

sadhanaStoreItemSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Mark as used
 * @returns {Promise} Updated item
 */
sadhanaStoreItemSchema.methods.markAsUsed = async function() {
  this.status = 'used';
  await this.save();
  return this;
};

/**
 * Mark as available
 * @returns {Promise} Updated item
 */
sadhanaStoreItemSchema.methods.markAsAvailable = async function() {
  this.status = 'available';
  await this.save();
  return this;
};

/**
 * Archive item
 * @returns {Promise} Updated item
 */
sadhanaStoreItemSchema.methods.archive = async function() {
  this.status = 'archived';
  await this.save();
  return this;
};

/**
 * Update quantity
 * @param {Number} newQuantity
 * @returns {Promise} Updated item
 */
sadhanaStoreItemSchema.methods.updateQuantity = async function(newQuantity) {
  this.quantity = Math.max(0, newQuantity);
  await this.save();
  return this;
};

/**
 * Decrease quantity
 * @param {Number} amount
 * @returns {Promise} Updated item
 */
sadhanaStoreItemSchema.methods.decreaseQuantity = async function(amount = 1) {
  this.quantity = Math.max(0, this.quantity - amount);
  if (this.quantity === 0) {
    this.status = 'unavailable';
  }
  await this.save();
  return this;
};

/**
 * Increase quantity
 * @param {Number} amount
 * @returns {Promise} Updated item
 */
sadhanaStoreItemSchema.methods.increaseQuantity = async function(amount = 1) {
  this.quantity += amount;
  if (this.quantity > 0 && this.status === 'unavailable') {
    this.status = 'available';
  }
  await this.save();
  return this;
};

/**
 * Get item summary
 * @returns {Object}
 */
sadhanaStoreItemSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    name: this.itemName,
    type: this.itemType,
    quantity: this.quantity,
    unit: this.unit,
    status: this.status,
    description: this.description
  };
};

/**
 * Convert to JSON
 * @returns {Object}
 */
sadhanaStoreItemSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Find all items for sadhana
 * @param {String} sadhanaId
 * @returns {Promise<Array>}
 */
sadhanaStoreItemSchema.statics.findBySadhana = function(sadhanaId) {
  return this.find({ sadhanaId }).sort({ createdAt: -1 });
};

/**
 * Find available items for sadhana
 * @param {String} sadhanaId
 * @returns {Promise<Array>}
 */
sadhanaStoreItemSchema.statics.findAvailableBySadhana = function(sadhanaId) {
  return this.find({ sadhanaId, status: 'available' });
};

/**
 * Find by type
 * @param {String} sadhanaId
 * @param {String} itemType
 * @returns {Promise<Array>}
 */
sadhanaStoreItemSchema.statics.findByType = function(sadhanaId, itemType) {
  return this.find({ sadhanaId, itemType });
};

/**
 * Count items in sadhana
 * @param {String} sadhanaId
 * @returns {Promise<Number>}
 */
sadhanaStoreItemSchema.statics.countBySadhana = function(sadhanaId) {
  return this.countDocuments({ sadhanaId, status: { $ne: 'archived' } });
};

/**
 * Find items needing replenishment
 * @param {String} sadhanaId
 * @returns {Promise<Array>}
 */
sadhanaStoreItemSchema.statics.findLowStock = function(sadhanaId) {
  return this.find({
    sadhanaId,
    status: { $ne: 'archived' },
    quantity: { $lt: 5 }
  });
};

/**
 * Archive old unused items
 * @param {String} sadhanaId
 * @param {Number} daysOld
 * @returns {Promise} Update result
 */
sadhanaStoreItemSchema.statics.archiveOldUnused = async function(sadhanaId, daysOld = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return this.updateMany(
    {
      sadhanaId,
      status: 'available',
      updatedAt: { $lt: cutoffDate }
    },
    {
      status: 'archived',
      updatedAt: new Date()
    }
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = mongoose.model('SadhanaStoreItem', sadhanaStoreItemSchema);
