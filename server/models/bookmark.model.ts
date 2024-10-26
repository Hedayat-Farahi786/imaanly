import mongoose, { Document, Schema } from 'mongoose';

export interface IBookmark extends Document {
  user: Schema.Types.ObjectId;
  type: 'quran' | 'dua' | 'hadith';
  reference: {
    surah?: number;
    ayah?: number;
    duaId?: string;
    hadithId?: string;
  };
  note?: string;
  tags: string[];
  createdAt: Date;
}

const bookmarkSchema = new Schema<IBookmark>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['quran', 'dua', 'hadith'],
    required: true,
  },
  reference: {
    surah: Number,
    ayah: Number,
    duaId: String,
    hadithId: String,
  },
  note: String,
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for efficient queries
bookmarkSchema.index({ user: 1, type: 1 });

export default mongoose.model<IBookmark>('Bookmark', bookmarkSchema);