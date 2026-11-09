import { model, Schema } from 'mongoose';

const leaderboardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    points: { type: Number, required: true, min: 0, default: 0 },
    period: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

leaderboardSchema.index({ user: 1, period: 1 }, { unique: true });

export default model('Leaderboard', leaderboardSchema);
