/**
 * Seed the octofit_db database with test data
 *
 * This script populates users, teams, activities, workouts, and leaderboard collections.
 */
import { connectDB, disconnectDB } from '../database'
import User from '../models/User'
import Team from '../models/Team'
import Activity from '../models/Activity'
import Workout from '../models/Workout'
import Leaderboard from '../models/Leaderboard'

async function seed() {
  console.log('Seed the octofit_db database with test data')
  await connectDB()

  // Clear existing data
  await Leaderboard.deleteMany({})
  await Activity.deleteMany({})
  await Workout.deleteMany({})
  await Team.deleteMany({})
  await User.deleteMany({})

  // Create realistic users
  const users = await User.create([
    { name: 'Alice Johnson', email: 'alice.johnson@example.com' },
    { name: 'Bob Martinez', email: 'bob.martinez@example.com' },
    { name: 'Carol Singh', email: 'carol.singh@example.com' },
    { name: 'Danielle Wu', email: 'danielle.wu@example.com' }
  ])

  // Create teams
  const teams = await Team.create([
    { name: 'Morning Runners', members: [users[0]._id, users[1]._id] },
    { name: 'Evening Lifters', members: [users[2]._id, users[3]._id] }
  ])

  // Create activities with varied dates and realistic metrics
  const activities = await Activity.create([
    { user: users[0]._id, type: 'running', durationMinutes: 35, calories: 380, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
    { user: users[1]._id, type: 'cycling', durationMinutes: 50, calories: 520, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) },
    { user: users[2]._id, type: 'swimming', durationMinutes: 60, calories: 650, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1) },
    { user: users[3]._id, type: 'strength', durationMinutes: 45, calories: 400, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) },
    { user: users[0]._id, type: 'yoga', durationMinutes: 30, calories: 120, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) }
  ])

  // Create workouts
  const workouts = await Workout.create([
    { user: users[0]._id, title: '5k Tempo Run', exercises: [{ name: 'Run', reps: 1, sets: 1, weight: 0 }], date: new Date() },
    { user: users[1]._id, title: 'Road Bike', exercises: [{ name: 'Cycle', reps: 1, sets: 1, weight: 0 }], date: new Date() },
    { user: users[2]._id, title: 'Lap Swim', exercises: [{ name: 'Swim', reps: 1, sets: 1, weight: 0 }], date: new Date() }
  ])

  // Build leaderboard entries from activity aggregates
  const agg = await Activity.aggregate([
    { $group: { _id: '$user', totalCalories: { $sum: '$calories' }, totalDuration: { $sum: '$durationMinutes' } } },
    { $sort: { totalCalories: -1 } }
  ])

  const leaderboardDocs = []
  for (const row of agg) {
    leaderboardDocs.push({ user: row._id, totalCalories: row.totalCalories, totalDuration: row.totalDuration })
  }
  await Leaderboard.create(leaderboardDocs)

  console.log('Seeding complete — created:')
  console.log(`  users: ${users.length}`)
  console.log(`  teams: ${teams.length}`)
  console.log(`  activities: ${activities.length}`)
  console.log(`  workouts: ${workouts.length}`)
  console.log(`  leaderboard entries: ${leaderboardDocs.length}`)

  // Optional verification via API routes (if API server is running)
  try {
    // Node 18+ includes global fetch; attempt to verify endpoints
    const base = process.env.API_BASE || 'http://localhost:8000'
    const endpoints = ['/api/users', '/api/teams', '/api/activities', '/api/workouts', '/api/leaderboard']
    for (const ep of endpoints) {
      const res = await fetch(base + ep)
      const body = await res.text()
      console.log(`Verified ${ep}: status=${res.status}, length=${body.length}`)
    }
  } catch (err) {
    console.log('API verification skipped or failed (server may not be running):', String(err))
  }

  await disconnectDB()
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
