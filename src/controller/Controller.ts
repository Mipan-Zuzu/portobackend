import type{Request, Response} from "express"

import {generateAiResponse} from "../openai/OpenAi.js"


export const handleResponse = async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).json({
            data: "use POST /api/data untuk kirim message ke AI",
            status: 200
        })
    }catch (error) {
        if(error instanceof Error) {
            res.status(500).json({
                data: error.message,
                status: 500
            })
        }
    }
}

export const handleRequest = async (req: Request, res: Response): Promise<void> => {
    const { message } = req.body as { message?: string }
    try {
        if (!message || typeof message !== "string") {
            res.status(400).json({
                data: "message wajib diisi dan harus berupa string",
                status: 400
            })
            return
        }

        const dat = `Jhon Doe ${message}`
        console.log(dat)

        const aiResponse = await generateAiResponse(message)
        const cleanText = aiResponse.output_text?.trim()

        res.status(200).json({
            data: cleanText || "AI tidak mengembalikan teks jawaban.",
            status: 200
        })
    }catch (err) {
        if(err instanceof Error) {
            res.status(500).json({
                data : err.message,
                status: 500
            })
            return
        }

        res.status(500).json({
            data: "Terjadi kesalahan saat memproses request AI",
            status: 500
        })
    }
}
