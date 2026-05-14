// TODO: Third Party Modules
import dotenv from "dotenv"
import express from "express"
import cors from "cors"


import router from "./src/Routing/Routing.js"

// TODO: Config express
const app = express()
app.use(express.json())
dotenv.config()
app.use(router)

// TODO: ENV URL
const url_frontend = process.env.FRONTEND_URL
const url_frontend_local = process.env.FRONTEND_URL_LOCAL

const AllowedOrigin = [
    url_frontend,
    url_frontend_local
]

app.use(
    cors({
        origin(origin, callback) {
            if(!origin) return callback(null, true)
            if(AllowedOrigin.includes(origin)) {
                return callback(null, true)
            }

            return callback(new Error("Cors Di Tolak Cek Domain Required nya"))
        },
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    })
)



const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})




