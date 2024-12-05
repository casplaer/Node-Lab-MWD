const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userProfileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['Admin', 'Customer'],
    default: 'Customer',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

userProfileSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userProfileSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
