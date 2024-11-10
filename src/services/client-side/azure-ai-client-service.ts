import { AudioConfig, AudioOutputStream, Recognizer, ResultReason, SpeechConfig, SpeechRecognitionEventArgs, SpeechRecognizer, SpeechSynthesizer } from "microsoft-cognitiveservices-speech-sdk";
import { ingress } from "../../models/ingress";
import { PrivateRestService } from "./api-services/private-rest-service";
import { useInterviewContext } from "../../context/InterviewContext";

export class AzureAIClientService {
    private static session: ingress.SpeechTokenResponse | undefined;
    private static recognizer: SpeechRecognizer | undefined;
    private static synthesizer: SpeechSynthesizer | undefined;
    private interviewContext = useInterviewContext();

    async init() {
        const sessionRes = await this.getSpeechSession();
        const speechConfig = SpeechConfig.fromAuthorizationToken(sessionRes.token, sessionRes.region);
        speechConfig.speechRecognitionLanguage = 'en-US';
        
        // STT
        const recognizerAudioConfig = AudioConfig.fromDefaultMicrophoneInput(); // TODO: try with device id 
        AzureAIClientService.recognizer = new SpeechRecognizer(speechConfig, recognizerAudioConfig);
        AzureAIClientService.recognizer.recognizing = (sender: Recognizer, event: SpeechRecognitionEventArgs) => {
            console.log('Recgonizing:', event.result.text);
            if (event.result.text) {
                this.interviewContext.setOngoingText!(event.result.text);
            }
        }

        AzureAIClientService.recognizer.recognized = (sender: Recognizer, event: SpeechRecognitionEventArgs) => {
            console.log(`Recognized:`, event.result.text);
            if (event.result.text) {
                this.interviewContext.setOngoingDialogue!((d => {
                    if (d) return { ...d, userAnswer: (d.userAnswer ?? "") + " " + event.result.text }
                    return { ...d!, userAnswer: event.result.text }
                }))
                this.interviewContext.setOngoingText!("");
            }
        }

        // TTS
        const synthesizerAudioConfig = AudioConfig.fromDefaultSpeakerOutput(); // TODO: try with device id 
        AzureAIClientService.synthesizer = new SpeechSynthesizer(speechConfig, synthesizerAudioConfig);
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

    async startTextToSpeech(text: string, onCompleted: (url: string) => void) {
        if (!AzureAIClientService.synthesizer) {
            await this.init();
        }

        const audioChunks: any[] = [];
        console.log("Speaking text:", text)
        const audioStream = AudioOutputStream.createPullStream();
        this.interviewContext.setAudioSynthensisData!(audioStream);
        AzureAIClientService.synthesizer!.speakTextAsync(text,
            (result) => {
                console.log("Syntheised audio");
                if (result.reason === ResultReason.SynthesizingAudioCompleted) {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const url = URL.createObjectURL(audioBlob);
                    onCompleted(url);
                    console.log("synthesis finished.");
                } else {
                    console.error("Speech synthesis canceled, " + result.errorDetails);
                }
            },
            (error) => {
                console.error("Error while TTS", error);
            },
            audioStream
        );
    }

    async playAudioThroughSpeakers(uint8Array: Uint8Array) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
        // Decode audio data to an AudioBuffer
        const audioBuffer = await audioContext.decodeAudioData(uint8Array.buffer);
    
        // Create a buffer source and connect it to the speakers
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
    
        // Play the audio
        source.start();
    }

    stopSpeechService () {
         if (AzureAIClientService.synthesizer) {
            console.log("Closing synthesizer")
            AzureAIClientService.synthesizer.close();
        }
        if (AzureAIClientService.recognizer) {
            console.log("Closing recognizer")
            AzureAIClientService.recognizer.close();
        }
    }
}