
export interface IAIService {
    convertTextToSpeech(text: string): Promise<any>;
    convertSpeechToText(promptId: string): Promise<string>;
    textCompletion(text: string): Promise<string>;
}
