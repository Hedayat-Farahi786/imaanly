import mongoose, { Document, Schema } from 'mongoose';

export interface IProgress extends Document {
  user: Schema.Types.ObjectId;
  quran: {
    lastRead: {
      surah: number;
      ayah: number;
      date: Date;
    };
    completedJuz: number[];
    completedSurah: number[];
    memorized: {
      surah: number;
      ayahRange: {
        start: number;
        end: number;
      };
      strength: number; // 1-5 rating
      lastRevised: Date;
    }[];
  };
  duas: {
    learned: string[];
    favorites: string[];
    lastPracticed: Date;
  };
  prayers: {
    streak: number;
    totalPrayers: number;
    lastPrayer: Date;
  };
}

const progressSchema = new Schema<IProgress>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  quran: {
    lastRead: {
      surah: Number,
      ayah: Number,
      date: Date,
    },
    completedJuz: [Number],
    completedSurah: [Number],
    memorized: [{
      surah: Number,
      ayahRange: {
        start: Number,
        end: Number,
      },
      strength: {
        type: Number,
        min: 1,
        max: 5,
      },
      lastRevised: Date,
    }],
  },
  duas: {
    learned: [String],
    favorites: [String],
    lastPracticed: Date,
  },
  prayers: {
    streak: {
      type: Number,
      default: 0,
    },
    totalPrayers: {
      type: Number,
      default: 0,
    },
    lastPrayer: Date,
  },
});

export default mongoose.model<IProgress>('Progress', progressSchema);