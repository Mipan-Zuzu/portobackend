import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import type { NextFunction, Request, Response } from "express"

import router from "./Routing/Routing.js"

dotenv.config()

const app: express.Express = express()

const urlFrontend = process.env.FRONTEND_URL
const urlFrontendLocal = process.env.FRONTEND_URL_LOCAL

const allowedOrigin = [urlFrontend, urlFrontendLocal].filter(
  (origin): origin is string => Boolean(origin)
)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true)
      if (allowedOrigin.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error("Cors Di Tolak Cek Domain Required nya"))
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
)

app.use(express.json())
app.use(router)

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(500).json({
      data: err.message,
      status: 500
    })
  }

  return res.status(500).json({
    data: "Terjadi kesalahan pada server",
    status: 500
  })
})

export default app
