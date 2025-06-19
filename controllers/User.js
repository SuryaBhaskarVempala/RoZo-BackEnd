const mongoose = require("mongoose");
const Users = require("../Schemas/User");
const logger = require("../utils/logger");
const { generateToken } = require("../Auth/Auth");

const signup = async (req, res) => {
  const endpoint = "[POST /signup]";
  const { name, email, password, phone } = req.body;
  logger.info(`${endpoint} Received signup data for email: ${email}`);

  if (!name || !email || !password || !phone) {
    logger.warn(`${endpoint} Missing fields in signup`);
    return res.status(400).json({ message: 'Name, email, password, and phone are required' });
  }

  try {
    // Check for existing user with the same email
    const existingEmailUser = await Users.findOne({ email });
    if (existingEmailUser) {
      logger.warn(`${endpoint} User already exists with email: ${email}`);
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Check for existing user with the same phone number
    const existingPhoneUser = await Users.findOne({ phone });
    if (existingPhoneUser) {
      logger.warn(`${endpoint} User already exists with phone: ${phone}`);
      return res.status(400).json({ message: 'User already exists with this phone number' });
    }

    // Create new user
    const newUser = await Users.create({ name, email, password, phone });
    const token = generateToken(newUser);

    if (!token) {
      logger.error(`${endpoint} Token generation failed`);
      return res.status(500).json({ message: 'Token generation failed' });
    }

    logger.info(`${endpoint} User registered successfully: ${email}`);
    res.status(201).json({ message: 'User registered successfully', token });

  } catch (error) {
    logger.error(`${endpoint} Error: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const login = async (req, res) => {
  const endpoint = "[POST /login]";
  const { email, password } = req.body;
  logger.info(`${endpoint} Login attempt for: ${email}`);

  try {
    const user = await Users.findOne({ email });
    if (!user) {
      logger.warn(`${endpoint} User not found: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn(`${endpoint} Password mismatch for: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    if (!token) {
      logger.error(`${endpoint} Token generation failed for user: ${email}`);
      return res.status(500).json({ message: 'Token generation failed' });
    }

    logger.info(`${endpoint} Login successful for: ${email}`);
    res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    logger.error(`${endpoint} Error logging in user: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const profile = async (req, res) => {
  const endpoint = "[GET /profile]";
  try {
    const userId = req.user.id;
    logger.info(`${endpoint} Fetching profile for user ID: ${userId}`);

    const user = await Users.findById(new mongoose.Types.ObjectId(userId)).select('-password');
    if (!user) {
      logger.warn(`${endpoint} User not found for ID: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info(`${endpoint} Profile fetched for user: ${user.email}`);
    res.status(200).json({ user });

  } catch (error) {
    logger.error(`${endpoint} Error fetching profile: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateName = async (req, res) => {
  const endpoint = "[PATCH /update-name]";
  const { name, id } = req.body;
  logger.info(`${endpoint} Updating name for user ID: ${id} to "${name}"`);

  try {
    const user = await Users.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      { name },
      { new: true }
    );

    if (!user) {
      logger.warn(`${endpoint} User not found with ID: ${id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info(`${endpoint} Name updated successfully for: ${user.email}`);
    res.status(200).json({
      message: 'User name updated successfully',
      user,
    });

  } catch (error) {
    logger.error(`${endpoint} Error updating name: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  signup,
  login,
  profile,
  updateName
};
