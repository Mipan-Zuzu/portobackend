import { OpenAI } from "openai";
import dotenv from "dotenv";
import { buildContextMessage } from "./context/Context.js";

dotenv.config();

let client: OpenAI | null = null;

const getClient = (): OpenAI => {
    if (client) return client;

    const apiKey = process.env.AI_APIKEY;
    if (!apiKey) {
        throw new Error("AI_APIKEY belum diset di environment.");
    }

    client = new OpenAI({
        apiKey,
        baseURL: "https://api.groq.com/openai/v1",
    });

    return client;
};

const allowedKeywords = [
    "porto",
    "portofolio",
    "jhon doe",
    "dia",
    "project",
    "projek",
    "skill",
    "stack",
    "pengalaman",
    "experience",
    "studi",
    "studied",
    "kuliah",
    "indonesia",
    "ai engineer",
    "security engineer"
];

const isRelevant = (message: string): boolean => {
    const lower = message.toLowerCase();
    return allowedKeywords.some((keyword) => lower.includes(keyword));
};

export const generateAiResponse = async (userMessage: string) => {
    if (!isRelevant(userMessage)) {
        return {
            output_text:
                "Maaf, saya hanya dapat menjelaskan tentang portofolio Jhon Doe."
        };
    }

    const systemPrompt = buildContextMessage();

    const completion = await getClient().chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: "user",
                content: userMessage
            }
        ]
    });

    return {
        output_text: completion.choices[0]?.message?.content ?? ""
    };
};
