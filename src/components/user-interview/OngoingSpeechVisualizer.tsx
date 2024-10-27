'use client'

import React, { useEffect, useRef, useState } from 'react'
import { VisualizerStatus } from './OngoingInterview'
import { Avatar, Card, Typography } from 'antd'

interface OngoingSpeechVisualizerProps {
  status: VisualizerStatus
}
const OngoingSpeechVisualizer = (props: OngoingSpeechVisualizerProps) => {

  
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const [currentStatus, setCurrnetStauts] = useState<VisualizerStatus>()

  useEffect(() => {
    const getMicrophoneInput = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        audioRef.current = analyser;

        const detectSound = () => {
          if (audioRef.current) {
            audioRef.current.getByteFrequencyData(dataArray);

            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
              sum += dataArray[i];
            }
            const average = sum / bufferLength;

            if (average > 20) {
              setCurrnetStauts(VisualizerStatus.LISTENING);
              setIsPlaying(true)
            }else{
              setIsPlaying(false)
            } 
          }
          animationRef.current = requestAnimationFrame(detectSound);
        };

        detectSound();
      } catch (err) {
        console.error("Error accessing microphone: ", err);
      }
    };

    getMicrophoneInput();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);


  return <div style={{
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    gap: "20px"
  }}>
    {/* <Typography>
      {props.status}
    </Typography> */}

    {/* status = listning, when using mic */}
    <Card bordered style={{ width: "500px", height: "350px", alignItems: "center", display: "flex", justifyContent: "center", border: `${props.status == VisualizerStatus.SPEAKING ?"3px solid #007bff": ''} `}}>
      <div
        className={`visualizer-circle ${(isPlaying && props.status == VisualizerStatus.SPEAKING) ? "is-playing" : ""}`}
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          backgroundColor: '#ddd',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: `${props.status == VisualizerStatus.SPEAKING ?"3px solid #007bff": ''} `,
          overflow: 'hidden',
          transition: 'transform 0.3s ease',

        }}
      >
        {/* <img src='exptertable-blck-loog.png' width={100} height={100} alt='iamge'></img> */}
        BOT

      </div>
      <style jsx>{`
      @keyframes waveEffect {
        0% {
          box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.5);
        }
        50% {
          box-shadow: 0 0 0 30px rgba(0, 123, 255, 0);
        }
        100% {
          box-shadow: 0 0 0 60px rgba(0, 123, 255, 0);
        }
      }
      // .is-playing {
      //   animation: waveEffect 2s infinite;
      // }
    `}</style>
    </Card>
    {/* status = speaking ,when using browser speaker */}
    <Card style={{ width: "500px", height: "350px", alignItems: "center", display: "flex", justifyContent: "center", border: `${props.status == VisualizerStatus.LISTENING ?"3px solid #007bff": ''} `}}>
      <div
        className={`visualizer-circle ${(isPlaying && props.status == VisualizerStatus.LISTENING) ? "is-playing" : ""} `}
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          backgroundColor: '#ddd',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: `${props.status == VisualizerStatus.LISTENING ?"3px solid #007bff": ''} `,
          overflow: 'hidden',
          transition: 'transform 0.3s ease',
        }}
      >
        <span
          className="letter"
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'black',
            position: 'relative',
            zIndex: 2,
          }}
        >
          B
        </span>


      </div>
      <style jsx>{`
      @keyframes waveEffect {
        0% {
          box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.5);
        }
        50% {
          box-shadow: 0 0 0 30px rgba(0, 123, 255, 0);
        }
        100% {
          box-shadow: 0 0 0 60px rgba(0, 123, 255, 0);
        }
      }
      .is-playing {
        animation: waveEffect 2s infinite;
      }
    `}</style>
    </Card>
  </div>

}

export default OngoingSpeechVisualizer;