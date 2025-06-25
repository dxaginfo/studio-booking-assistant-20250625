const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - studioId
 *         - roomId
 *         - clientId
 *         - startTime
 *         - endTime
 *         - status
 *       properties:
 *         studioId:
 *           type: string
 *           format: uuid
 *           description: Reference to the studio
 *         roomId:
 *           type: string
 *           format: uuid
 *           description: Reference to the specific room in the studio
 *         clientId:
 *           type: string
 *           format: uuid
 *           description: Reference to the client user
 *         staffAssigned:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: List of staff assigned to this booking
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Booking start time (ISO8601 format)
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: Booking end time (ISO8601 format)
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *           description: Current status of the booking
 *         purpose:
 *           type: string
 *           description: Purpose of the booking session
 *         attendees:
 *           type: integer
 *           description: Number of people attending the session
 *         specialRequests:
 *           type: string
 *           description: Any special requirements for the session
 *         equipmentReserved:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               equipmentId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *           description: Equipment reserved for this booking
 *         payment:
 *           type: object
 *           properties:
 *             amount:
 *               type: number
 *               format: float
 *               description: Total amount for the booking
 *             currency:
 *               type: string
 *               default: USD
 *               description: Currency code
 *             status:
 *               type: string
 *               enum: [pending, partial, paid, refunded]
 *               description: Payment status
 *             transactions:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   transactionId:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: [payment, refund]
 *                   amount:
 *                     type: number
 *                     format: float
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   method:
 *                     type: string
 *                   notes:
 *                     type: string
 */

const BookingSchema = new mongoose.Schema(
  {
    studioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Studio',
      required: true
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    staffAssigned: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
      required: true
    },
    purpose: {
      type: String
    },
    attendees: {
      type: Number
    },
    specialRequests: {
      type: String
    },
    equipmentReserved: [
      {
        equipmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Equipment'
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1
        }
      }
    ],
    payment: {
      amount: {
        type: Number
      },
      currency: {
        type: String,
        default: 'USD'
      },
      status: {
        type: String,
        enum: ['pending', 'partial', 'paid', 'refunded'],
        default: 'pending'
      },
      transactions: [
        {
          transactionId: {
            type: String
          },
          type: {
            type: String,
            enum: ['payment', 'refund']
          },
          amount: {
            type: Number
          },
          date: {
            type: Date,
            default: Date.now
          },
          method: {
            type: String
          },
          notes: {
            type: String
          }
        }
      ]
    },
    notes: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        content: {
          type: String
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    prepMaterials: [
      {
        title: {
          type: String
        },
        description: {
          type: String
        },
        fileUrl: {
          type: String
        },
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    remindersSent: [
      {
        type: {
          type: String,
          enum: ['email', 'sms']
        },
        sentAt: {
          type: Date,
          default: Date.now
        },
        status: {
          type: String
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Validate that start time is before end time
BookingSchema.pre('save', function(next) {
  if (this.startTime >= this.endTime) {
    const err = new Error('Booking start time must be before end time');
    return next(err);
  }
  next();
});

// Index for efficient querying by date ranges and status
BookingSchema.index({ studioId: 1, startTime: 1, endTime: 1, status: 1 });

module.exports = mongoose.model('Booking', BookingSchema);