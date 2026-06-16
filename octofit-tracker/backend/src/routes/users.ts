import { Router } from 'express'
import User from '../models/User'

const router = Router()

router.get('/', async (req, res) => {
  const users = await User.find()
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json(user)
})

router.post('/', async (req, res) => {
  const user = new User(req.body)
  await user.save()
  res.status(201).json(user)
})

export default router
