/**
 * Schema: GoogleSheetsIntegration
 * Purpose: Google Sheets sync configuration
 */

const mongoose = require('mongoose');

const googleSheetsIntegrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },

    sheetId: {
      type: String,
      required: true,
      description: 'Google Sheets ID'
    },

    sheetName: {
      type: String,
      required: true,
      description: 'Sheet name'
    },

    tokens: {
      accessToken: String,
      refreshToken: String,
      tokenType: String
    },

    tokenExpiresAt: {
      type: Date,
      default: null
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      description: 'Sync field mappings'
    },

    syncEnabled: {
      type: Boolean,
      default: false,
      index: true
    },

    syncInterval: {
      type: Number,
      default: 60,
      description: 'Sync interval in minutes'
    },

    lastSyncAt: {
      type: Date,
      default: null
    },

    syncStatus: {
      type: String,
      enum: ['success', 'error', 'pending'],
      default: 'pending'
    },

    lastError: {
      type: String,
      default: null
    },

    createdAt: {
      type: Date,
      default: Date.now
    },

    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false,
    collection: 'googlesheetintegrations'
  }
);


googleSheetsIntegrationSchema.methods.enableSync = async function() {
  this.syncEnabled = true;
  await this.save();
  return this;
};

googleSheetsIntegrationSchema.methods.disableSync = async function() {
  this.syncEnabled = false;
  await this.save();
  return this;
};

googleSheetsIntegrationSchema.methods.recordSync = async function(status, error = null) {
  this.lastSyncAt = new Date();
  this.syncStatus = status;
  if (error) this.lastError = error;
  await this.save();
  return this;
};

googleSheetsIntegrationSchema.methods.updateTokens = async function(accessToken, refreshToken) {
  this.tokens = {
    accessToken,
    refreshToken,
    tokenType: 'Bearer'
  };
  this.tokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await this.save();
  return this;
};

googleSheetsIntegrationSchema.statics.findByUser = function(userId) {
  return this.findOne({ userId });
};

googleSheetsIntegrationSchema.statics.findSyncEnabled = function() {
  return this.find({ syncEnabled: true });
};

module.exports = mongoose.model('GoogleSheetsIntegration', googleSheetsIntegrationSchema);
