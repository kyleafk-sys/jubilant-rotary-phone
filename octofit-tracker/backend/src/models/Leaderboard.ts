import { Schema, model } from 'mongoose'

const leaderboardSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  totalCalories: { type: Number, default: 0 },
  totalDuration: { type: Number, default: 0 },
  generatedAt: { type: Date, default: Date.now }
})

export default model('Leaderboard', leaderboardSchema)
