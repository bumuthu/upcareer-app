import { BaseInterviewModel, UserInterviewModel } from "../../models/entities";
import { AzureAIAssistantService } from "./azure-ai-assistant-service";
import { DialogueService } from "./entity-services/dialogue-service";

export class InterviewEngine {
    private aiService: AzureAIAssistantService;
    private assistantId: string;
    private dialogueService: DialogueService = new DialogueService();

    constructor(assistantId: string) {
        this.assistantId = assistantId;
        this.aiService = new AzureAIAssistantService(assistantId);
    }

    async handleAnswerPrompt(questionDialogueId: string, answerDialogueId: string, threadId?: string): Promise<string> {
        if (!threadId) {
            const assistantThread = await this.aiService.createAssistantTread();
            threadId = assistantThread.id
        }
        const questionDialogue = await this.dialogueService.get(questionDialogueId);
        const answerDialogue = await this.dialogueService.get(answerDialogueId);

        const generatedPrompt = this.generateQuestionPromt(questionDialogue.text, answerDialogue.text)
        const generatedResponse = await this.aiService.queryInAssistantTread(threadId, generatedPrompt, this.assistantId);

        console.log("Generated Response(handleAnswerPrompt): ", generatedResponse)
        return generatedResponse
    }

    async handleOrganizePrompt(userInterview: UserInterviewModel): Promise<string> {
        const assistantThread = await this.aiService.createAssistantTread();

        // TODO handle JD overwrite, and attach CV to the query
        const generatedPrompt = this.generateOrganizePromt((userInterview.baseInterview as BaseInterviewModel).jobDescription, userInterview.jobDescription ?? "");
        const generatedResponse = await this.aiService.queryInAssistantTread(assistantThread.id, generatedPrompt, this.assistantId);

        console.log("Generated Response(handleOrganizePrompt): ", generatedResponse)
        return generatedResponse
    }

    generateQuestionPromt(question: string, answer: string): string {
        return `
            Question: ${question}
            Answer: ${answer}

            Generate the next question base on the previous question and answer.
        `
    }

    generateOrganizePromt(defaultJobDescription: string, customJobDescription: string): string {
        return `
            Generate 10 interview questions base on the job description.
        `
    }
}