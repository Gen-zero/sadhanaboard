const Message = require('../schemas/UserNotification');
const sanitizeHtml = str => (typeof str === 'string' ? str.replace(/<[^>]*>/g, '') : str);

const messageService = {
  async sendMessage(senderId, receiverId, content) {
    try {
      const clean = sanitizeHtml(content);
      const message = new Message({
        fromUserId: senderId,
        userId: receiverId,
        content: clean,
        type: 'message',
        isRead: false
      });
      await message.save();
      return { id: message._id, createdAt: message.createdAt };
    } catch (e) {
      console.error('sendMessage error', e);
      throw e;
    }
  },

  async getMessagesForUser(userId, limit = 50, offset = 0) {
    try {
      const messages = await Message.find({
        $or: [
          { fromUserId: userId },
          { userId: userId }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(offset))
      .select('id fromUserId userId content createdAt isRead');
      
      return messages.map(m => m.toJSON()) || [];
    } catch (e) {
      console.error('getMessagesForUser error', e);
      throw e;
    }
  },

  async markAsRead(messageId) {
    try {
      await Message.findByIdAndUpdate(messageId, { isRead: true });
      return { ok: true };
    } catch (e) {
      console.error('markAsRead error', e);
      throw e;
    }
  },

  async unreadCount(userId) {
    try {
      const count = await Message.countDocuments({ userId, isRead: false });
      return count || 0;
    } catch (e) {
      console.error('unreadCount error', e);
      throw e;
    }
  }
};

module.exports = messageService;
