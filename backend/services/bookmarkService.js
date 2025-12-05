const BookBookmark = require('../schemas/BookBookmark');

const createBookmark = async ({ userId, bookId, label, page, position, isPublic }) => {
  const bookmark = new BookBookmark({
    userId,
    bookId,
    label: label || null,
    page: page || null,
    position: position ? JSON.stringify(position) : null,
    isPublic: !!isPublic
  });
  await bookmark.save();
  return bookmark.toJSON();
};

const listBookmarks = async ({ userId, bookId }) => {
  const bookmarks = await BookBookmark.find({ userId, bookId }).sort({ createdAt: -1 });
  return bookmarks.map(b => b.toJSON());
};

const updateBookmark = async ({ id, userId, label, page, position, isPublic }) => {
  const bookmark = await BookBookmark.findOneAndUpdate(
    { _id: id, userId },
    {
      label: label || null,
      page: page || null,
      position: position ? JSON.stringify(position) : null,
      isPublic: !!isPublic
    },
    { new: true, runValidators: true }
  );
  return bookmark ? bookmark.toJSON() : null;
};

const deleteBookmark = async ({ id, userId }) => {
  await BookBookmark.findOneAndDelete({ _id: id, userId });
  return true;
};

module.exports = { createBookmark, listBookmarks, updateBookmark, deleteBookmark };
