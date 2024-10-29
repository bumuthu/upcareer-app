'use client'

import React, { useEffect, useRef, useState } from 'react'
import { VisualizerStatus } from './OngoingInterview'
import { Card } from 'antd'
import { useInterviewContext } from "../../context/InterviewContext";
import { calculateAverage } from '../../utils/utils';
import { debounce } from 'lodash';

const MIC_SENSITIVITY = 70;
const SPEAKER_SENSITIVITY = 20;

interface OngoingSpeechVisualizerProps {
	status: VisualizerStatus
}

const OngoingSpeechVisualizer = (props: OngoingSpeechVisualizerProps) => {

	const [isSpeaking, setIsSpeaking] = useState(false);

	const animationFrameRef = useRef<number | null>(null);
	const micAnalyserRef = useRef<AnalyserNode | null>(null);
	const speakerAudioContextRef = useRef<AudioContext | null>(null);
	const speakerAnalyserRef = useRef<AnalyserNode | null>(null);

	const interviewContext = useInterviewContext();
	const [listeningWaves, setListeningWaves] = useState<string[]>([])
	const [speakingWaves, setSpeakingWaves] = useState<string[]>([])

	useEffect(() => {
		console.log("Status", props.status)
		switch (props.status) {
			case VisualizerStatus.SPEAKING:
				setIsSpeaking(true)
				break;
			default:
				break;
		}
	}, [props.status])

	const debouncedSetSpeakingFalse = debounce(() => {
		setIsSpeaking(false)
	}, 2000, { maxWait: 2000 })

	const debouncedListeningWave = debounce((status: VisualizerStatus) => {
		if (status == VisualizerStatus.LISTENING) {
			setListeningWaves((prev) => [...prev, Date.now().toString()]);
		}
	}, 100, { maxWait: 500 })

	const debouncedSpeakingWave = debounce(() => {
		setSpeakingWaves((prev) => [...prev, Date.now().toString()]);
	}, 100)

	useEffect(() => {
		const captureMicrophoneInput = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
				const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
				micAnalyserRef.current = audioContext.createAnalyser();
				const microphone = audioContext.createMediaStreamSource(stream);
				microphone.connect(micAnalyserRef.current);
				micAnalyserRef.current.fftSize = 256;

				const bufferLength = micAnalyserRef.current.frequencyBinCount;
				const dataArray = new Uint8Array(bufferLength);

				const analyseAudio = () => {
					if (micAnalyserRef.current) {
						animationFrameRef.current = requestAnimationFrame(analyseAudio);
						micAnalyserRef.current.getByteFrequencyData(dataArray);
						const average = calculateAverage(dataArray);
						if (average > MIC_SENSITIVITY) {
							debouncedListeningWave(props.status)
						}
					}
				};

				analyseAudio();
			} catch (err) {
				console.error("Error accessing microphone: ", err);
			}
		};

		captureMicrophoneInput();

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [props.status]);

	useEffect(() => {
		const captureSpeakerOutput = async () => {
			try {
				speakerAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
				speakerAnalyserRef.current = speakerAudioContextRef.current.createAnalyser();
				speakerAnalyserRef.current.fftSize = 2048;

				const mediaStreamDestinationRef = speakerAudioContextRef.current.createMediaStreamDestination();
				speakerAnalyserRef.current.connect(mediaStreamDestinationRef);

				const dataArray: Uint8Array = new Uint8Array(speakerAnalyserRef.current.frequencyBinCount);

				const analyzeAudio = () => {
					if (speakerAnalyserRef.current) {
						requestAnimationFrame(analyzeAudio);
						speakerAnalyserRef.current.getByteFrequencyData(dataArray);
						const average = calculateAverage(dataArray) * 1000;
						if (average > SPEAKER_SENSITIVITY) {
							setIsSpeaking(true)
							debouncedSpeakingWave()
						} else {
							debouncedSetSpeakingFalse()
						}
					}
				};
				analyzeAudio();
			} catch (err) {
				console.error("Error accessing audio: ", err);
			}
		}

		captureSpeakerOutput();

		return () => {
			speakerAudioContextRef.current?.close();
		};
	}, [props.status]);

	useEffect(() => {
		const readAudioStream = async () => {
			const arrayBuffer = new ArrayBuffer(320000);
			if (speakerAudioContextRef.current && interviewContext.audioSynthesisData) {
				try {
					const bytesRead = await interviewContext.audioSynthesisData!.read(arrayBuffer);
					if (bytesRead > 0) {
						const audioBuffer = await speakerAudioContextRef.current.decodeAudioData(arrayBuffer);

						const gainNode = speakerAudioContextRef.current.createGain();
						gainNode.gain.value = 0.001; // Set the gain value (0 to 1 for reducing volume)
						const source = speakerAudioContextRef.current.createBufferSource();
						source.buffer = audioBuffer;

						source.connect(gainNode);
						gainNode.connect(speakerAnalyserRef.current!);
						gainNode.connect(speakerAudioContextRef.current.destination);

						source.start();
					}
				} catch (error) {
					console.error("Error reading audio stream:", error);
				}
			};
		}
		setInterval(readAudioStream, 1000);

	}, [interviewContext.audioSynthesisData, speakerAudioContextRef.current])

	return <div style={{
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		gap: "20px"
	}}>
		<Card bordered style={{
			width: "45%",
			height: "55vh",
			alignItems: "center",
			display: "flex",
			justifyContent: "center",
			border: `${isSpeaking ? "2px solid #007bff" : ''}`
		}}>
			<div
				className={'visualizer-circle is-playing'}
				key={'playing-' + speakingWaves[speakingWaves.length - 1]}
				style={{
					width: '150px',
					height: '150px',
					borderRadius: '50%',
					backgroundColor: '#ddd',
					position: 'relative',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					border: isSpeaking ? "2px solid #007bff" : '',
					overflow: 'hidden',
					transition: 'transform 0.3s ease',
				}}
			>
				<img src='/exptertable-blck-loog.png' width={100} height={100} alt='iamge'></img>
			</div>
		</Card>

		<Card style={{
			width: "45%",
			height: "55vh",
			alignItems: "center",
			display: "flex",
			justifyContent: "center",
			border: `${props.status == VisualizerStatus.LISTENING ? "2px solid #007bff" : ''} `
		}}>
			<div
				className={'visualizer-circle is-playing'}
				key={'playing-' + listeningWaves[listeningWaves.length - 1]}
				style={{
					width: '150px',
					height: '150px',
					borderRadius: '50%',
					backgroundColor: '#ddd',
					position: 'relative',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					border: `${props.status == VisualizerStatus.LISTENING ? "2px solid #007bff" : ''} `,
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
		</Card>
	</div>

}

export default OngoingSpeechVisualizer;