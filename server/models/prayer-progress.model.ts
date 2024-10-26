import mongoose, { Document, Schema } from 'mongoose';

export interface IPrayerProgress extends Document {
  user: Schema.Types.ObjectId;
  date: Date;
  prayers: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  qadha: {
    count: number;
    dates: Date[];
  };
  streak: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

const prayerProgressSchema = new Schema<IPrayerProgress>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  prayers: {
    fajr: { type: Boolean, default: false },
    dhuhr: { type: Boolean, default: false },
    asr: { type: Boolean, default: false },
    maghrib: { type: Boolean, default: false },
    isha: { type: Boolean, default: false },
  },
  qadha: {
    count: { type: Number, default: 0 },
    dates: [Date],
  },
  streak: {
    type: Number,
    default: 0,
  },
  location: {
    latitude: Number,
    longitude: Number,
  },
});

// Index for efficient queries
prayerProgressSchema.index({ user: 1, date: 1 });

export default mongoose.model<IPrayerProgress>('PrayerProgress', prayerProgressSchema);