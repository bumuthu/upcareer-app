import { AudioConfig, Recognizer, SpeechConfig, SpeechRecognitionEventArgs, SpeechRecognizer } from "microsoft-cognitiveservices-speech-sdk";
import { ingress } from "../../models/ingress";
import { PrivateRestService } from "./api-services/private-rest-service";
import { useInterviewContext } from "../../context/InterviewContext";

export class AzureAIClientService {
    private static session: ingress.SpeechTokenResponse | undefined;
    private static recognizer: SpeechRecognizer | undefined;
    private interviewContext = useInterviewContext();

    async init() {
        const sessionRes = await this.getSpeechSession();

        const speechConfig = SpeechConfig.fromAuthorizationToken(sessionRes.token, sessionRes.region);
        speechConfig.speechRecognitionLanguage = 'en-US';
        const audioConfig = AudioConfig.fromDefaultMicrophoneInput(); // TODO: try with device id 

        AzureAIClientService.recognizer = new SpeechRecognizer(speechConfig, audioConfig);
        AzureAIClientService.recognizer.recognizing = (sender: Recognizer, event: SpeechRecognitionEventArgs) => {
            console.log('Recgonizing:', event.result.text);
            if (event.result.text) {
                this.interviewContext.setOngoingText!(event.result.text);
            }
        }

        AzureAIClientService.recognizer.recognized = (sender: Recognizer, event: SpeechRecognitionEventArgs) => {
            console.log(`Recognized:`, event.result.text);
            if (event.result.text) {
                this.interviewContext.setOngoingDialog!((d => {
                    if (d) return { ...d!, text: d!.text + " " + event.result.text }
                    return { ...d!, text: event.result.text }
                }))
            }
            this.interviewContext.setOngoingText!("");
        }
    }

    async getSpeechSession(): Promise<ingress.SpeechTokenResponse> {
        if (AzureAIClientService.session) {
            return AzureAIClientService.session;
        } else {
            try {
                const privateService = new PrivateRestService();
                const speechToken: ingress.SpeechTokenResponse = await privateService.getSpeechToken();
                AzureAIClientService.session = speechToken;
                return speechToken;
            } catch (err) {
                console.error("Error while retrieving speech token", err);
                throw new Error("Error while retrieving speech token")
            }
        }
    }

    async startSpeechToText() {
        if (!AzureAIClientService.recognizer) {
            await this.init();
        }
        AzureAIClientService.recognizer!.startContinuousRecognitionAsync();
    }

    async stopSpeechToText() {
        if (AzureAIClientService.recognizer) {
            AzureAIClientService.recognizer!.stopContinuousRecognitionAsync();
        }
    }
}