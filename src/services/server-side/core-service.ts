import { IAIService } from "./ai-service-interface";
import { OpenAIService } from "./openai-service";

export class CoreService {
    private aiService: IAIService;

    constructor() {
        this.aiService = new OpenAIService();
    }
    async handleSpeechPrompt(promptId: string): Promise<string> {
        // Pull audio from S3 here and call AI service
        const answerText = await this.aiService.convertSpeechToText(promptId)
        const replyText = await this.aiService.textCompletion(answerText)
        const replyAudio = await this.aiService.convertTextToSpeech(replyText)
        return replyAudio;
    }
}