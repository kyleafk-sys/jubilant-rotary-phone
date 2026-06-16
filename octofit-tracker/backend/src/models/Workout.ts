import { Schema, model } from 'mongoose'

const workoutSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  exercises: [{ name: String, reps: Number, sets: Number, weight: Number }],
  date: { type: Date, default: Date.now }
}, { timestamps: true })

export default model('Workout', workoutSchema)
