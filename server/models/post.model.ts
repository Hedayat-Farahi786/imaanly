import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  user: Schema.Types.ObjectId;
  content: string;
  media?: string[];
  likes: Schema.Types.ObjectId[];
  comments: {
    user: Schema.Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];
  tags: string[];
  visibility: 'public' | 'private' | 'followers';
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  media: [String],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  tags: [String],
  visibility: {
    type: String,
    enum: ['public', 'private', 'followers'],
    default: 'public',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamps on save
postSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for efficient queries
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ tags: 1 });

export default mongoose.model<IPost>('Post', postSchema);