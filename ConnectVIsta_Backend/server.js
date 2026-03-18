const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

// Load env vars FIRST - before any other imports that use process.env
dotenv.config();

// Now import other modules that depend on process.env
const connectDB = require('./src/config/db');

// Import routes (these should be after dotenv.config)
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/admin_routes');
const verificationRoutes = require('./src/routes/verificationRoutes');
const providerprofileRoutes = require('./src/routes/providerProfileRoutes');
const seekerProfileRoutes = require('./src/routes/seekerProfileRoutes');
const seekerServiceRoutes = require('./src/routes/seekerServiceRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const subscriptionRoutes = require('./src/routes/subscriptionRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const walletRoutes = require('./src/routes/walletRoutes');
const invoiceRoutes = require('./src/routes/invoiceRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const settingsRoutes = require('./src/routes/settingsRoutes');
const authController = require('./src/controllers/authController');
const auth = require('./src/middleware/auth');
const socketManager = require('./src/utils/socketManager');
const User = require('./src/models/User');

// Initialize express
const app = express();

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Connect to database
connectDB();

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173', process.env.ADMIN_URL || 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Store io instance in socket manager
socketManager.setIO(io);

// Socket.IO Authentication Middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication token required'));
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new Error('User not found'));
    }

    // Attach user to socket
    socket.user = user;
    next();
  } catch (error) {
    console.error('Socket authentication error:', error.message);
    next(new Error('Invalid authentication token'));
  }
});

// Socket.IO Connection Handling
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id} | User: ${socket.user._id} (${socket.user.role})`);

  // Map user to socket
  socketManager.addUserSocket(socket.user._id, socket.id);

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`Socket disconnected: ${socket.id} | Reason: ${reason}`);
    socketManager.removeUserSocket(socket.id);
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Security middleware
app.use(helmet());
const corsOptions = {
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', process.env.ADMIN_URL || 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // increased for development/testing
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/profile', providerprofileRoutes);
app.use('/api/seeker', seekerProfileRoutes);
app.use('/api/seeker', seekerServiceRoutes);
app.use('/api/service-catalog', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/chat', chatRoutes);
app.get('/api/auth/profile', auth(), authController.getProfile);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Service Platform API'
  });
});

// Test profile endpoint
app.get('/api/test/profile', auth(['provider']), (req, res) => {
  res.json({
    success: true,
    message: 'Profile endpoint is working',
    user: req.user
  });
});

// // 404 handler for API routes
// app.use('/api/*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'API endpoint not found',
//     path: req.originalUrl
//   });
// });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

// Use server.listen instead of app.listen for Socket.IO
server.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`🔌 Socket.IO enabled`);
  console.log(`📝 Available routes:`);
  console.log(`   - Health: http://localhost:${PORT}/api/health`);
  console.log(`   - Auth Profile: http://localhost:${PORT}/api/auth/profile`);
  console.log(`   - Provider Profile: http://localhost:${PORT}/api/profile/provider`);
  console.log(`   - Bookings: http://localhost:${PORT}/api/bookings`);
  console.log(`   - Notifications: http://localhost:${PORT}/api/notifications`);
});