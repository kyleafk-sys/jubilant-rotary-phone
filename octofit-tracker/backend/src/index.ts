import express from 'express'
import { connectDB } from './database'

const app = express()
const PORT = process.env.PORT ? Number(process.env.PORT) : 8000

// Codespaces-aware host selection and preview URL support
const CODESPACE = process.env.CODESPACE_NAME
const HOST = process.env.HOST || (CODESPACE ? '0.0.0.0' : 'localhost')
const codespacesPreviewUrl = CODESPACE ? `https://${CODESPACE}-${PORT}.githubpreview.dev` : null

app.use(express.json())

// Routes
import usersRouter from './routes/users'
import teamsRouter from './routes/teams'
import activitiesRouter from './routes/activities'
import workoutsRouter from './routes/workouts'
import leaderboardRouter from './routes/leaderboard'

app.use('/api/users', usersRouter)
app.use('/api/teams', teamsRouter)
app.use('/api/activities', activitiesRouter)
app.use('/api/workouts', workoutsRouter)
app.use('/api/leaderboard', leaderboardRouter)

app.get('/', (req, res) => {
  res.json({ message: 'OctoFit Tracker API' })
})

async function start() {
  try {
    await connectDB()
    app.listen(PORT, HOST, () => {
      console.log(`Server listening on ${HOST}:${PORT}`)
      if (codespacesPreviewUrl) {
        console.log(`Codespaces preview URL: ${codespacesPreviewUrl}`)
      }
    })
  } catch (err) {
    console.error('Failed to start server', err)
    process.exit(1)
  }
}

start()
