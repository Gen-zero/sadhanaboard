const bookProgressService = require('../services/bookProgressService');
const bookmarkService = require('../services/bookmarkService');
const annotationService = require('../services/annotationService');

const upsertProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = Number(req.params.bookId);
    const { position, page, percent, timeSpentMinutes } = req.body;
    const result = await bookProgressService.upsertProgress({ userId, bookId, position, page, percent, timeSpentMinutes });
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('upsertProgress error', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = Number(req.params.bookId);
    const progress = await bookProgressService.getProgress({ userId, bookId });
    res.json({ success: true, data: progress });
  } catch (err) {
    console.error('getProgress error', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const createBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = Number(req.params.bookId);
    const { label, page, position, isPublic } = req.body;
    const bm = await bookmarkService.createBookmark({ userId, bookId, label, page, position, isPublic });
    res.json({ success: true, data: bm });
  } catch (err) {
    console.error('createBookmark error', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const listBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = Number(req.params.bookId);
    const bms = await bookmarkService.listBookmarks({ userId, bookId });
    res.json({ success: true, data: bms });
  } catch (err) {
    console.error('listBookmarks error', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const updateBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { label, page, position, isPublic } = req.body;
    const bm = await bookmarkService.updateBookmark({ id: Number(id), userId, label, page, position, isPublic });
    res.json({ success: true, data: bm });
  } catch (err) {
    console.error('updateBookmark error', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const deleteBookmark = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await bookmarkService.deleteBookmark({ id: Number(id), userId });
    res.json({ success: true });
  } catch (err) {
    console.error('deleteBookmark error', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const createAnnotation = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = Number(req.params.bookId);
    const { page, position, content, isPrivate } = req.body;
    const ann = await annotationService.createAnnotation({ userId, bookId, page, position, content, isPrivate });
    res.json({ success: true, data: ann });
  } catch (err) {
    console.error('createAnnotation error', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const listAnnotations = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = Number(req.params.bookId);
    const includePublic = req.query.includePublic === '1' || req.query.includePublic === 'true';
    const anns = await annotationService.listAnnotations({ userId, bookId, includePublic });
    res.json({ success: true, data: anns });
  } catch (err) {
    console.error('listAnnotations error', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const updateAnnotation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { page, position, content, isPrivate } = req.body;
    const ann = await annotationService.updateAnnotation({ id: Number(id), userId, page, position, content, isPrivate });
    res.json({ success: true, data: ann });
  } catch (err) {
    console.error('updateAnnotation error', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const deleteAnnotation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await annotationService.deleteAnnotation({ id: Number(id), userId });
    res.json({ success: true });
  } catch (err) {
    console.error('deleteAnnotation error', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  upsertProgress,
  getProgress,
  createBookmark,
  listBookmarks,
  updateBookmark,
  deleteBookmark,
  createAnnotation,
  listAnnotations,
  updateAnnotation,
  deleteAnnotation
};
