/**
 * Socket Manager Utility
 * Manages Socket.IO connections and provides helper functions for emitting events
 */

let io = null;
const userSocketMap = new Map(); // userId -> socketId mapping

/**
 * Initialize the socket manager with the Socket.IO instance
 * @param {Object} socketIO - The Socket.IO server instance
 */
const setIO = (socketIO) => {
  io = socketIO;
};

/**
 * Get the Socket.IO instance
 * @returns {Object} The Socket.IO server instance
 */
const getIO = () => {
  if (!io) {
    console.warn('Socket.IO not initialized');
  }
  return io;
};

/**
 * Add a user-socket mapping when user connects
 * @param {string} userId - The user's ID
 * @param {string} socketId - The socket connection ID
 */
const addUserSocket = (userId, socketId) => {
  if (userId && socketId) {
    userSocketMap.set(userId.toString(), socketId);
    console.log(`Socket mapped: User ${userId} -> Socket ${socketId}`);
  }
};

/**
 * Remove a socket mapping when user disconnects
 * @param {string} socketId - The socket connection ID to remove
 */
const removeUserSocket = (socketId) => {
  for (const [userId, sId] of userSocketMap.entries()) {
    if (sId === socketId) {
      userSocketMap.delete(userId);
      console.log(`Socket unmapped: User ${userId}`);
      return userId;
    }
  }
  return null;
};

/**
 * Get the socket ID for a specific user
 * @param {string} userId - The user's ID
 * @returns {string|null} The socket ID or null if not found
 */
const getUserSocketId = (userId) => {
  return userSocketMap.get(userId.toString()) || null;
};

/**
 * Check if a user is currently connected
 * @param {string} userId - The user's ID
 * @returns {boolean} Whether the user is connected
 */
const isUserOnline = (userId) => {
  return userSocketMap.has(userId.toString());
};

/**
 * Emit an event to a specific user
 * @param {string} userId - The user's ID to send to
 * @param {string} event - The event name
 * @param {Object} data - The data to send
 * @returns {boolean} Whether the event was sent successfully
 */
const emitToUser = (userId, event, data) => {
  if (!io) {
    console.warn('Socket.IO not initialized, cannot emit event');
    return false;
  }

  const socketId = getUserSocketId(userId);
  if (socketId) {
    io.to(socketId).emit(event, data);
    console.log(`Event '${event}' emitted to user ${userId}`);
    return true;
  } else {
    console.log(`User ${userId} is not connected, event '${event}' not sent`);
    return false;
  }
};

/**
 * Emit an event to multiple users
 * @param {string[]} userIds - Array of user IDs
 * @param {string} event - The event name
 * @param {Object} data - The data to send
 * @returns {number} Number of users the event was sent to
 */
const emitToUsers = (userIds, event, data) => {
  let sentCount = 0;
  userIds.forEach(userId => {
    if (emitToUser(userId, event, data)) {
      sentCount++;
    }
  });
  return sentCount;
};

/**
 * Broadcast an event to all connected users
 * @param {string} event - The event name
 * @param {Object} data - The data to send
 */
const broadcast = (event, data) => {
  if (io) {
    io.emit(event, data);
    console.log(`Event '${event}' broadcasted to all users`);
  }
};

/**
 * Get count of currently connected users
 * @returns {number} Number of connected users
 */
const getConnectedUsersCount = () => {
  return userSocketMap.size;
};

/**
 * Get all connected user IDs
 * @returns {string[]} Array of connected user IDs
 */
const getConnectedUsers = () => {
  return Array.from(userSocketMap.keys());
};

module.exports = {
  setIO,
  getIO,
  addUserSocket,
  removeUserSocket,
  getUserSocketId,
  isUserOnline,
  emitToUser,
  emitToUsers,
  broadcast,
  getConnectedUsersCount,
  getConnectedUsers
};
