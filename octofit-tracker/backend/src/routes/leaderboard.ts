import { Router } from 'express'
import Activity from '../models/Activity'
import User from '../models/User'

const router = Router()

// GET top users by total calories burned
router.get('/', async (req, res) => {
  const agg = await Activity.aggregate([
    { $group: { _id: '$user', totalCalories: { $sum: '$calories' }, totalDuration: { $sum: '$durationMinutes' } } },
    { $sort: { totalCalories: -1 } },
    { $limit: 10 }
  ])

  const results = await Promise.all(agg.map(async (row: any) => {
    const user = await User.findById(row._id)
    return { user, totalCalories: row.totalCalories, totalDuration: row.totalDuration }
  }))

  res.json(results)
})

export default router
