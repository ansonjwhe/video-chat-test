import { createRef, useState } from 'react';
import './App.css';

const servers = {
	iceServers: [
		{
			urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
		},
	],
	iceCandidatePoolSize: 10,
};

let pc = new RTCPeerConnection(servers);


function App() {
	const localVideoRef = createRef();
	const remoteVideoRef = createRef();
	const [webcamButtonDisabled, setWebcamButtonDisabled] = useState(false);
	const [callButtonDisabled, setCallButtonDisabled] = useState(true);
	const [answerButtonDisabled, setAnswerButonDisabled] = useState(true);

	// Setup meddia sources
	const webcamSetup = async () => {
		let newLocalStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
		let newRemoteStream = new MediaStream();

		// Push tracks from local stream to peer connection
		newLocalStream.getTracks().forEach((track) => {
			pc.addTrack(track, newLocalStream);
		});

		// Pull tracks from remote stream, add to video stream
		pc.ontrack = (event) => {
			event.streams[0].getTracks().forEach((track) => {
				newRemoteStream.addTrack(track);
			});
		};

		console.log(newLocalStream);
		console.log(newRemoteStream);
		localVideoRef.current.srcObject = newLocalStream;
		remoteVideoRef.current.srcObject = newRemoteStream;
		localVideoRef.current.muted = true;

		setWebcamButtonDisabled(true);
		setCallButtonDisabled(false);
		setAnswerButonDisabled(false);
	}

	return (
		<div className="App">
			<header className="App-header">
				<h1>Video Chat App</h1>
			</header>
			<div className="videos">
				<span>
					<h3>Local Stream</h3>
					<video id="webcamVideo" ref={localVideoRef} autoPlay playsInline></video>
				</span>
				<span>
					<h3>Remote Stream</h3>
					<video id="remoteVideo" ref={remoteVideoRef} autoPlay playsInline></video>
				</span>
			</div>
			<button id="webcamButton" disabled={webcamButtonDisabled} onClick={webcamSetup}>Start webcam</button>
			<div className="buttons">
				<span>
					<h2>Create a new Call</h2>
					<button id="callButton" disabled={callButtonDisabled}>Create Call</button>
				</span>
				<span>
					<h2>Join from another browser</h2>
					<input id="callInput" />
					<button id="answerButton" disabled={answerButtonDisabled}>Answer</button>
				</span>
				<span>
					<h2>End the call</h2>
					<button id="hangupButton" disabled>Hangup</button>
				</span>
			</div>
		</div>
	);
}

export default App;
