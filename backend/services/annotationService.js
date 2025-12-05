const BookAnnotation = require('../schemas/BookAnnotation');

const createAnnotation = async ({ userId, bookId, page, position, content, isPrivate }) => {
  const annotation = new BookAnnotation({
    userId,
    bookId,
    page: page || null,
    position: position ? JSON.stringify(position) : null,
    content: content || null,
    isPrivate: isPrivate === undefined ? true : !!isPrivate
  });
  await annotation.save();
  return annotation.toJSON();
};

const listAnnotations = async ({ userId, bookId, includePublic = false }) => {
  let query = { bookId };
  
  if (includePublic) {
    query.$or = [
      { userId },
      { isPrivate: false }
    ];
  } else {
    query.userId = userId;
  }
  
  const annotations = await BookAnnotation.find(query).sort({ createdAt: -1 });
  return annotations.map(a => a.toJSON());
};

const updateAnnotation = async ({ id, userId, page, position, content, isPrivate }) => {
  const annotation = await BookAnnotation.findOneAndUpdate(
    { _id: id, userId },
    {
      page: page || null,
      position: position ? JSON.stringify(position) : null,
      content: content || null,
      isPrivate: !!isPrivate
    },
    { new: true, runValidators: true }
  );
  return annotation ? annotation.toJSON() : null;
};

const deleteAnnotation = async ({ id, userId }) => {
  await BookAnnotation.findOneAndDelete({ _id: id, userId });
  return true;
};

module.exports = { createAnnotation, listAnnotations, updateAnnotation, deleteAnnotation };
