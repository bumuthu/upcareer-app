import { IAIService } from "./ai-service-interface";
import OpenAI from "openai";

const OPENAI_KEY = process.env.OPENAI_API_KEY;

export class OpenAIService implements IAIService {
    private openai: OpenAI = new OpenAI({ apiKey: OPENAI_KEY });

    async convertTextToSpeech(text: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async convertSpeechToText(speach: any): Promise<string> {
        throw new Error("Method not implemented.");
    }
    async textCompletion(text: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
}