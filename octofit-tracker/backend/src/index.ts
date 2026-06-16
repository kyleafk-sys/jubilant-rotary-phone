import express from 'express'
import mongoose from 'mongoose'

const app = express()
const PORT = process.env.PORT ? Number(process.env.PORT) : 8000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/octofit'

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'OctoFit Tracker API' })
})

async function start() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
  } catch (err) {
    console.error('Failed to start server', err)
    process.exit(1)
  }
}

start()
