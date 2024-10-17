import { BaseInterviewModel, UserInterviewModel } from "../../models/entities";
import { ingress } from "../../models/ingress";
import { AzureAIAssistantService, PromptType } from "./azure-ai-assistant-service";
import { DialogueService } from "./entity-services/dialogue-service";

export class InterviewEngine {
    private aiService: AzureAIAssistantService;
    private assistantId: string;
    private dialogueService: DialogueService = new DialogueService();

    constructor(assistantId: string) {
        this.assistantId = assistantId;
        this.aiService = new AzureAIAssistantService(assistantId);
    }

    async handleAnswerPrompt(questionDialogueId: string, answerDialogueId: string, threadId?: string): Promise<ingress.InterviewPromptResponse> {
        if (!threadId) {
            const assistantThread = await this.aiService.createAssistantTread();
            threadId = assistantThread.id
        }
        const questionDialogue = await this.dialogueService.get(questionDialogueId);
        const answerDialogue = await this.dialogueService.get(answerDialogueId);

        const generatedPrompt = this.generateQuestionPromt(questionDialogue.text, answerDialogue.text)
        const generatedResponse = await this.aiService.queryInAssistantTread(PromptType.ANSWER_PROMPT, threadId, generatedPrompt, this.assistantId) as ingress.InterviewPromptResponse;

        console.log("Generated Response (handleAnswerPrompt): ", generatedResponse)
        return generatedResponse
    }

    async handleOrganizePrompt(userInterview: UserInterviewModel): Promise<ingress.InterviewPromptResponse[]> {
        const assistantThread = await this.aiService.createAssistantTread();

        // TODO handle JD overwrite, and attach CV to the query
        const generatedPrompt = this.generateOrganizePromt((userInterview.baseInterview as BaseInterviewModel).jobDescription, userInterview.jobDescription ?? "");
        const generatedResponse = await this.aiService.queryInAssistantTread(PromptType.ORGANIZE_PROMPT,assistantThread.id, generatedPrompt, this.assistantId) as ingress.InterviewPromptResponse[];

        console.log("Generated Response (handleOrganizePrompt): ", generatedResponse)
        return generatedResponse
    }

    generateQuestionPromt(question: string, answer: string): string {
        return `
            Question: ${question}
            Answer: ${answer}

            Generate the next question base on the previous question and answer. 
            
            Use Json format to give the response with object of question and answer fields as follows.
            { "response": { "question": "question 1", "answer": "answer 1" } }
        `
    }

    generateOrganizePromt(defaultJobDescription: string, customJobDescription: string): string {
        return `
            Generate 10 interview questions base on the job description. First question should be to explain the past experience of the candidate related to the job and there is no answer for that. From second onwards, start technical questions and answers.
            
            Use Json format to give the response with array of objects of question and answer fields as follows.
            { "response": [{ "question": "question 1", "answer": "answer 1" }] }
        `
    }
}