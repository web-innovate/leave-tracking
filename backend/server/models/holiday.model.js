import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * Holiday Schema
 */
const HolidaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
HolidaySchema.method({
});

/**
 * Statics
 */
HolidaySchema.statics = {
  /**
   * Get holiday
   * @param {ObjectId} id - The objectId of holiday.
   * @returns {Promise<Holiday, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((holiday) => {
        if (holiday) {
          return holiday;
        }
        const err = new APIError('No such Holiday exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List holidays in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of holidays to be skipped.
   * @param {number} limit - Limit number of holidays to be returned.
   * @returns {Promise<Holiday[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef Holiday
 */
export default mongoose.model('Holiday', HolidaySchema);
