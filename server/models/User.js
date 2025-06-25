const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *         - role
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address (unique)
 *         password:
 *           type: string
 *           format: password
 *           description: User's password (hashed)
 *         name:
 *           type: string
 *           description: User's full name
 *         phone:
 *           type: string
 *           description: User's phone number
 *         role:
 *           type: string
 *           enum: [admin, staff, client]
 *           description: User's role in the system
 *         profileImage:
 *           type: string
 *           format: uri
 *           description: URL to user's profile image
 *         preferences:
 *           type: object
 *           properties:
 *             notificationPreferences:
 *               type: object
 *               properties:
 *                 email:
 *                   type: boolean
 *                   default: true
 *                 sms:
 *                   type: boolean
 *                   default: false
 *             timezone:
 *               type: string
 *               default: 'UTC'
 *         staffDetails:
 *           type: object
 *           properties:
 *             position:
 *               type: string
 *             specialties:
 *               type: array
 *               items:
 *                 type: string
 *             availability:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   day:
 *                     type: number
 *                     minimum: 0
 *                     maximum: 6
 *                     description: Day of week (0=Sunday, 6=Saturday)
 *                   startTime:
 *                     type: string
 *                     pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                     description: Start time in HH:MM format
 *                   endTime:
 *                     type: string
 *                     pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                     description: End time in HH:MM format
 *         clientDetails:
 *           type: object
 *           properties:
 *             company:
 *               type: string
 *             previousBookings:
 *               type: array
 *               items:
 *                 type: string
 *                 format: uuid
 *             paymentMethods:
 *               type: array
 *               items:
 *                 type: string
 *                 format: uuid
 */

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'staff', 'client'],
      default: 'client'
    },
    profileImage: {
      type: String
    },
    preferences: {
      notificationPreferences: {
        email: {
          type: Boolean,
          default: true
        },
        sms: {
          type: Boolean,
          default: false
        }
      },
      timezone: {
        type: String,
        default: 'UTC'
      }
    },
    staffDetails: {
      position: {
        type: String
      },
      specialties: [String],
      availability: [
        {
          day: {
            type: Number,
            min: 0,
            max: 6
          },
          startTime: {
            type: String
          },
          endTime: {
            type: String
          }
        }
      ]
    },
    clientDetails: {
      company: {
        type: String
      },
      previousBookings: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Booking'
        }
      ],
      paymentMethods: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'PaymentMethod'
        }
      ]
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);