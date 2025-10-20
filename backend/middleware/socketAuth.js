const jwt = require('jsonwebtoken');
const { adminAuthenticate, ADMIN_COOKIE } = require('./adminAuth');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

function parseCookie(header) {
  if (!header) return {};
  return header.split(';').reduce((acc, part) => {
    const [key, ...rest] = part.trim().split('=');
    acc[decodeURIComponent(key)] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
}

async function socketAuthMiddleware(socket, next) {
  try {
    const cookieHeader = socket.handshake.headers.cookie || '';
    const cookies = parseCookie(cookieHeader);
    const token = cookies[ADMIN_COOKIE] || (socket.handshake.query && socket.handshake.query.token);
    if (!token) return next(new Error('Authentication required'));
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || decoded.role !== 'admin') return next(new Error('Access denied'));
    // Attach user info to socket
    socket.user = { id: decoded.userId || 0, username: decoded.username, role: decoded.role };
    return next();
  } catch (err) {
    return next(new Error('Invalid or expired token'));
  }
}

module.exports = socketAuthMiddleware;
