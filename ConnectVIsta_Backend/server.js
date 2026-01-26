const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars FIRST - before any other imports that use process.env
dotenv.config();

// Now import other modules that depend on process.env
const connectDB = require('./src/config/db');

// Import routes (these should be after dotenv.config)
const authRoutes = require('./src/routes/authRoutes');
const verificationRoutes = require('./src/routes/verificationRoutes');
const providerprofileRoutes = require('./src/routes/providerProfileRoutes'); // Add this import
const seekerProfileRoutes = require('./src/routes/seekerProfileRoutes'); // Add this import
const serviceRoutes = require('./src/routes/serviceRoutes'); // Add service routes
const authController = require('./src/controllers/authController');
const auth = require('./src/middleware/auth');


// Initialize express
const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
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
app.use('/api/verification', verificationRoutes);
app.use('/api/profile', providerprofileRoutes); // Add this line to register profile routes
app.use('/api/seeker', seekerProfileRoutes); // Add this line to register seeker profile routes
app.use('/api/service-catalog', serviceRoutes); // Mount service routes at /api/service-catalog
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

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📝 Available routes:`);
  console.log(`   - Health: http://localhost:${PORT}/api/health`);
  console.log(`   - Auth Profile: http://localhost:${PORT}/api/auth/profile`);
  console.log(`   - Provider Profile: http://localhost:${PORT}/api/profile/provider`);
  console.log(`   - Test Profile: http://localhost:${PORT}/api/test/profile`);
});