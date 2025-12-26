const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  phone: {
    type: String,
    trim: true
  },
  
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  
  role: {
    type: String,
    enum: ['service-seeker', 'service-provider', 'admin'],
    required: [true, 'User role is required'],
    default: 'service-seeker'
  },
  
  // Firebase integration fields
  authMethod: {
    type: String,
    enum: ['email', 'google', 'phone'],
    default: 'email'
  },
  
  firebaseUID: {
    type: String,
    sparse: true,
    index: true
  },
  
  // Status flags
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastLogin: {
    type: Date
  },
  
  // Profile completion
  profileCompleted: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving (only for email auth)
userSchema.pre('save', async function(next) {
  if (this.authMethod !== 'email' || !this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compare password method (only for email auth)
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (this.authMethod !== 'email') return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive data from JSON response
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  delete user.firebaseUID;
  return user;
};

// Indexes for better query performance
// userSchema.index({ email: 1 });
// userSchema.index({ role: 1 });
// userSchema.index({ isActive: 1 });
// userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);
module.exports = User;