const BookProgress = require('../schemas/BookProgress');

const upsertProgress = async ({ userId, bookId, position, page, percent, timeSpentMinutes }) => {
  // Find existing progress or create new
  let progress = await BookProgress.findOne({ userId, bookId });
  
  if (progress) {
    // Update existing: add time spent, update position/page/percent
    progress.position = position;
    progress.currentPage = page || progress.currentPage;
    progress.percentageRead = percent || progress.percentageRead;
    progress.totalTimeSpent = (progress.totalTimeSpent || 0) + (timeSpentMinutes || 0);
    progress.lastReadAt = new Date();
    await progress.save();
  } else {
    // Create new
    progress = new BookProgress({
      userId,
      bookId,
      position,
      currentPage: page,
      percentageRead: percent,
      totalTimeSpent: timeSpentMinutes || 0,
      lastReadAt: new Date()
    });
    await progress.save();
  }
  
  return progress.toJSON();
};

const getProgress = async ({ userId, bookId }) => {
  const progress = await BookProgress.findOne({ userId, bookId });
  return progress ? progress.toJSON() : null;
};

module.exports = { upsertProgress, getProgress };