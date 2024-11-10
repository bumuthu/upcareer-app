import { BaseInterviewModel, UserInterviewModel } from "../../models/entities";
import { ingress } from "../../models/ingress";
import { AzureAIAssistantService, PromptType } from "./azure-ai-assistant-service";
import { DialogueService } from "./entity-services/dialogue-service";
import { UserInterviewService } from "./entity-services/user-interview-service";

const mainNodeCount = process.env.NEXT_PUBLIC_MAIN_NODES_COUNT || 10;

export class InterviewEngine {
    private aiService: AzureAIAssistantService;
    private assistantId: string;
    private interview: UserInterviewModel;
    private dialogueService: DialogueService = new DialogueService();
    private interviewService: UserInterviewService = new UserInterviewService();

    constructor(assistantId: string, interview: UserInterviewModel) {
        this.assistantId = assistantId;
        this.interview = interview;
        this.aiService = new AzureAIAssistantService(assistantId);
    }

    async handleAnswerPrompt(dialogueId: string): Promise<ingress.InterviewPromptResponse> {
        const dialogue = await this.dialogueService.get(dialogueId);
        console.log("Dialogue [handleAnswerPrompt]:", dialogue)

        const generatedPrompt = this.generateQuestionPrompt(dialogue.systemQuestion!, dialogue.userAnswer!);
        const generatedResponse = await this.aiService.queryInAssistantTread(PromptType.ANSWER_PROMPT, this.interview.threadId!, generatedPrompt, this.assistantId) as ingress.InterviewPromptResponse;
        console.log("Generated Response [handleAnswerPrompt]:", generatedResponse);

        return generatedResponse
    }

    async handleOrganizePrompt(): Promise<ingress.InterviewPromptResponse[]> {
        const assistantThread = await this.aiService.createAssistantTread();
        await this.interviewService.update(this.interview._id, { threadId: assistantThread.id });

        const generatedPrompt = this.generateOrganizePromt();
        const generatedResponse = await this.aiService.queryInAssistantTread(PromptType.ORGANIZE_PROMPT, assistantThread.id, generatedPrompt, this.assistantId) as ingress.InterviewPromptResponse[];
        console.log("Generated Response (handleOrganizePrompt): ", generatedResponse);

        return generatedResponse
    }

    generateQuestionPrompt(question: string, answer: string): string {
        this.interview.difficulty;
        this.interview.mode;

        return `
            Previous Question: ${question ?? ""}
            Previous Answer: ${answer ?? ""}

            Give a short feedback of the previous answer given to the previous question in feedback field of the response. Ignore typo errors.
            If the previous answer is not accurate only, generate the next question based on the previous question and previous answer, and make followUp field true.
            if the previous answer is accurate enough, generate the feedback only, make followUp field false. Do not generate the next question and answer.

            Give scores for the previous answer in communicationScore, accuracyScore and confidenceScore fields. Range of scores is 0 to 10.
            
            Use Json format to give the response with object of question, feedback, answer and follow up or not fields as follows.
            { "response": { "question": "next question", "answer": "expected answer for next question", "feedback": "feedback for previous answer", followUp: true, communicationScore: 8, accuracyScore: 9, confidenceScore: 7 } }
        `
    }

    generateOrganizePromt(): string {
        this.interview.mode;

        let jobDescription = `${(this.interview.baseInterview as BaseInterviewModel).jobDescription}`;
        if (this.interview.jobDescription) {
            jobDescription = jobDescription + `

            ${this.interview.jobDescription}`;
        }

        return `
            Generate ${mainNodeCount} interview questions base on the job description. First question should be to explain the past experience of the candidate related to the job and there is no answer for that. From second onwards, start technical questions and answers.
            
            Difficulty level is ${this.interview.difficulty.toLowerCase()}
            Job Description: ${jobDescription}

            Use Json format to give the response with array of objects of question and answer fields as follows.
            { "response": [{ "question": "example question", "answer": "example answer" }] }
        `
    }
}