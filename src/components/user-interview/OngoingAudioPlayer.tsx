'use client'

import React, { useEffect, useState } from 'react'
import { AzureAIClientService } from '../../services/client-side/azure-ai-client-service';


interface OngoingAudioPlayerProps {
    text: string;
    start: boolean;
    onComplete: () => void;
}

const OngoingAudioPlayer = (props: OngoingAudioPlayerProps) => {
    const [audioUrl, setAudioUrl] = useState(null);
    const speechService = new AzureAIClientService();

    useEffect(() => {
        const onComplete = (url: any) => {
            setAudioUrl(url);
            props.onComplete()
            console.log("Speaking completed")
        }
        if (props.start) {
            speechService.startTextToSpeech(props.text, onComplete)
        }
    }, [props.start])

    return (
        <>
            {/* {audioUrl && <audio controls src={audioUrl} />} */}
        </>
    )
}

export default OngoingAudioPlayer;