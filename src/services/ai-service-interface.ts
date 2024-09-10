
export interface IAIService {
    convertTextToSpeech(text: string): Promise<any>;
    convertSpeechToText(speach: any): Promise<string>;
    textCompletion(text: string): Promise<string>;
}
