import axios from "axios";
import { AzureOpenAI } from "openai";
import { Assistant, Thread } from "openai/resources/beta/index.mjs";
import { ingress } from "../../models/ingress";

const azureSpeechKey = process.env.AZURE_SPEECH_SUBSCRIPTION_KEY;
const azureSpeechRegion = process.env.AZURE_SPEECH_REGION;
const azureOpenAIKey = process.env.AZURE_OPENAI_KEY;
const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureOpenAIVersion = process.env.AZURE_OPENAI_VERSION;

export enum PromptType {
    ANSWER_PROMPT,
    ORGANIZE_PROMPT
}

export class AzureAIAssistantService {
    private openai: AzureOpenAI;
    private assistant?: Assistant;

    constructor(assistantId: string) {
        this.openai = new AzureOpenAI({
            endpoint: azureOpenAIEndpoint,
            apiVersion: azureOpenAIVersion,
            apiKey: azureOpenAIKey,
        });
        this.openai.beta.assistants.retrieve(assistantId).then(assistant => {
            this.assistant = assistant;
        });
    }

    static async getAuthSession() {
        const headers = {
            headers: {
                'Ocp-Apim-Subscription-Key': azureSpeechKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        try {
            const tokenResponse = await axios.post(`https://${azureSpeechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, null, headers);
            return { token: tokenResponse.data, region: azureSpeechRegion };
        } catch (err) {
            console.error("Error while retrieving azure token", err)
            throw new Error("Error while retrieving azure token");
        }
    }

    async createAssistantTread(): Promise<Thread> {
        const thread = await this.openai.beta.threads.create();
        console.log("Assistant Tread:", thread)
        return thread;
    }

    async queryInAssistantTread(type: PromptType, threadId: string, query: string, assistantId: string): Promise<ingress.InterviewPromptResponse | ingress.InterviewPromptResponse[]> {
        await this.openai.beta.threads.messages.create(threadId,
            {
                role: "user",
                content: query.trim()
            }
        );
        const runResponse = await this.openai.beta.threads.runs.create(threadId,
            {
                assistant_id: assistantId,
                response_format: { type: "json_object" }
            }
        );

        let runStatus = runResponse.status;
        while (runStatus === 'queued' || runStatus === 'in_progress') {
            await new Promise(resolve => setTimeout(resolve, 200));
            const runStatusResponse = await this.openai.beta.threads.runs.retrieve(
                threadId,
                runResponse.id
            );
            runStatus = runStatusResponse.status;
            console.log(`Current run status: ${runStatus}`);
        }

        if (runStatus === 'completed') {
            const messagesResponse = await this.openai.beta.threads.messages.list(threadId);
            const content = messagesResponse.data[0].content[0];
            if (content.type === 'text') {
                return JSON.parse(content.text.value).response;
            }
            throw new Error("Error while fetching messages");
        } else {
            console.error(`Run status is ${runStatus}, unable to fetch messages.`);
            throw new Error("Error while fetching messages");
        }
    }
}