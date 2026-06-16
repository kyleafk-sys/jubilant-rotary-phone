import { Schema, model } from 'mongoose'

const activitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  durationMinutes: { type: Number, default: 0 },
  calories: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
}, { timestamps: true })

export default model('Activity', activitySchema)
