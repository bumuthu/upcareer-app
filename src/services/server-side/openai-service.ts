import { IAIService } from "./ai-service-interface";
import OpenAI from "openai";
import fs from 'fs'
import { S3StorageService } from "./aws-services/s3-storage-service";

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const DOWNLOAD_LOCATION = "public/prompts/sample02.mp3";

export class OpenAIService implements IAIService {
    private openai: OpenAI = new OpenAI({ apiKey: OPENAI_KEY });
    private s3Service: S3StorageService = new S3StorageService();

    async convertTextToSpeech(text: string): Promise<any> {
        const mp3 = await this.openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: text,
        });
        // const audioStream = Readable.from(mp3);
        // const buffer = Buffer.from(await mp3.arrayBuffer());
        // const readableStream = new ReadableStream();
        return mp3.blob();
    }


    async convertSpeechToText(promptId: string): Promise<string> {
        await this.s3Service.downloadPrompt(promptId, DOWNLOAD_LOCATION);
        const transcription = await this.openai.audio.transcriptions.create({
            file: fs.createReadStream(DOWNLOAD_LOCATION),
            model: "whisper-1",
            response_format: "json",
        });
        console.log(`Transcriptted text for prompt [${promptId}]`, transcription.text);
        return transcription.text;
    }


    async textCompletion(text: string): Promise<string> {
        return text;
    }
}