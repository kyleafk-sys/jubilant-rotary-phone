import { Router } from 'express'
import Workout from '../models/Workout'

const router = Router()

router.get('/', async (req, res) => {
  const workouts = await Workout.find().populate('user')
  res.json(workouts)
})

router.post('/', async (req, res) => {
  const workout = new Workout(req.body)
  await workout.save()
  res.status(201).json(workout)
})

export default router
