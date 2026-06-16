import mongoose from 'mongoose'
import User from '../src/models/User'
import Team from '../src/models/Team'
import Activity from '../src/models/Activity'
import Workout from '../src/models/Workout'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/octofit_db'

async function seed() {
  await mongoose.connect(MONGO_URI)
  console.log('Connected to MongoDB for seeding')

  // Clear collections
  await User.deleteMany({})
  await Team.deleteMany({})
  await Activity.deleteMany({})
  await Workout.deleteMany({})

  // Create users
  const users = await User.create([
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' },
    { name: 'Carol', email: 'carol@example.com' }
  ])

  // Create teams
  const teams = await Team.create([
    { name: 'Team Red', members: [users[0]._id, users[1]._id] },
    { name: 'Team Blue', members: [users[2]._id] }
  ])

  // Create activities
  const activities = await Activity.create([
    { user: users[0]._id, type: 'running', durationMinutes: 30, calories: 300 },
    { user: users[1]._id, type: 'cycling', durationMinutes: 45, calories: 450 },
    { user: users[2]._id, type: 'swimming', durationMinutes: 60, calories: 600 }
  ])

  // Create workouts
  const workouts = await Workout.create([
    { user: users[0]._id, title: 'Leg Day', exercises: [{ name: 'Squat', reps: 8, sets: 4, weight: 100 }] },
    { user: users[1]._id, title: 'Cardio', exercises: [{ name: 'Treadmill', reps: 1, sets: 1, weight: 0 }] }
  ])

  console.log('Seeding complete')
  await mongoose.disconnect()
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
