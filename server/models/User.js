const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function() {
      return this.googleAuth === undefined || !this.googleAuth;
    },
    minlength: [6, 'Password should be at least 6 characters long']
  },
  googleAuth: { type: Boolean, default: false },
});

userSchema.pre('save', async function(next) {
  if (this.password && !this.isModified('password')) return next(); 
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10); 
  }
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
