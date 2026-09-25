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

/**
 * Keyword yang mengindikasikan pertanyaan berkaitan
 * dengan portfolio Jhon Doe.
 */
const allowedKeywords = [
    "porto",
    "portfolio",
    "portofolio",
    "jhon doe",
    "dia",
    "beliau",
    "orang ini",
    "owner",
    "developer",
    "pemilik",
    "project",
    "projek",
    "skill",
    "stack",
    "teknologi",
    "tech stack",
    "pengalaman",
    "experience",
    "kerja",
    "bekerja",
    "role",
    "studi",
    "studied",
    "kuliah",
    "belajar",
    "journey",
    "perjalanan",
    "ai engineer",
    "security engineer",
    "game",
    "game development",
    "machine learning",
    "artificial intelligence",
    "ai",
    "python",
    "pytorch",
    "tensorflow",
    "unity",
    "unreal",
    "c++",
    "c#",
    "docker",
    "fastapi",
    "blender",
    "llm",
    "computer vision",
    "npc",
    "neural npc",
    "ai companion",
    "vision bot",
    "pixel runner",
    "dungeon escape",
];

/**
 * Sapaan dasar.
 */
const greetingPatterns = [
    "halo",
    "hai",
    "hi",
    "hey",
    "hello",
    "helo",
    "pagi",
    "siang",
    "sore",
    "malam",
    "apa kabar",
];

/**
 * Deteksi apakah pesan adalah sapaan.
 */
const isGreeting = (message: string): boolean => {
    const lower = message.trim().toLowerCase();

    return greetingPatterns.some((greeting) => {
        return (
            lower === greeting ||
            lower.startsWith(`${greeting} `) ||
            lower.startsWith(`${greeting},`) ||
            lower.startsWith(`${greeting}!`)
        );
    });
};

/**
 * Deteksi apakah pertanyaan masih berkaitan
 * dengan portfolio.
 */
const isRelevant = (message: string): boolean => {
    const lower = message.toLowerCase();

    return allowedKeywords.some((keyword) =>
        lower.includes(keyword)
    );
};

export const generateAiResponse = async (
    userMessage: string
) => {
    const message = userMessage.trim();

    if (!message) {
        return {
            output_text:
                "Silakan tanyakan sesuatu tentang portfolio Jhon Doe."
        };
    }

    /**
     * Sapaan selalu diteruskan ke AI agar respons terasa natural.
     */
    const relevant =
        isGreeting(message) ||
        isRelevant(message);

    if (!relevant) {
        return {
            output_text:
                "Maaf, aku fokus sebagai Portfolio AI, jadi aku hanya bisa membantu menjelaskan tentang portfolio Jhon Doe. Kamu bisa tanya soal journey, skill, tech stack, experience, atau project."
        };
    }

    const systemPrompt = buildContextMessage();

    const completion = await getClient().chat.completions.create({
        model: "openai/gpt-oss-120b",

        messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: message,
            },
        ],

        temperature: 0.7,
        max_completion_tokens: 2048,
        top_p: 1,

        /**
         * GPT-OSS reasoning.
         */
        reasoning_effort: "low" as any,

        /**
         * Tidak memakai stream di backend karena frontend
         * akan memberikan efek typing sendiri.
         */
        stream: false,
    });

    return {
        output_text:
            completion.choices[0]?.message?.content?.trim() ?? "",
    };
};
