import {Router, type Router as ExpressRouter} from "express"
import type {Request, Response} from "express"

import {
    handleRequest,
    handleResponse
} from "../controller/Controller.js"

const router:ExpressRouter  = Router()

router.get("/api/data", async (req: Request, res: Response): Promise<void> => handleResponse(req, res))
router.post("/api/data", async (req: Request, res: Response): Promise<void> => handleRequest(req, res))
router.get("/ping", (req: Request, res:Response) => {
    try {
        res.status(200).json({
        data : "Pong",
        status: 200
        })
    }catch (errors) {
        if(errors instanceof Error) {
            res.status(500).json({
                data: "Invalid connected",
                status : 500
            })
        }
    }
})

export default router