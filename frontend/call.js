// let username = prompt("Please enter your name:");
// console.log("You entered username as: ", username);
const username=sessionStorage.getItem('username');

const signalingServerUrl = `ws://localhost:8000/ws/call/${username}`;
let localStream, peerConnection;

const signalingServer = new WebSocket(signalingServerUrl);
const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]  // STUN server for NAT traversal
};

// Initialize Peer Connection
async function initializePeerConnection() {
    peerConnection = new RTCPeerConnection(configuration);

    // Get local media stream (video/audio)
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    
    // Create and append local video element if it does not exist
    if (!document.getElementById('localVideo')) {
        const localVideo = document.createElement('video');
        localVideo.srcObject = localStream;
        localVideo.autoplay = true;
        localVideo.muted = false; // Mute local video to avoid feedback
        localVideo.id = 'localVideo';
        document.getElementById('videos').appendChild(localVideo);
    }

    // Add tracks from local stream to peer connection
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    // Handle ICE candidate events
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            signalingServer.send(JSON.stringify({ type: "ice", ice: event.candidate }));
        }
    };

    // Handle receiving the remote stream
    peerConnection.ontrack = event => {
        let remoteVideo = document.getElementById('remoteVideo');
        
        // Create the remote video element if it does not exist
        if (!remoteVideo) {
            remoteVideo = document.createElement('video');
            remoteVideo.id = 'remoteVideo';
            remoteVideo.autoplay = true;
            // remoteVideo.muted=false
            document.getElementById('videos').appendChild(remoteVideo);
        }

        // Set the remote stream
        if (!remoteVideo.srcObject) {
            remoteVideo.srcObject = event.streams[0];
        }
    };
}

// WebSocket event listeners
signalingServer.onopen = () => {
    console.log('WebSocket connection opened');
    // Start video call once the WebSocket connection is open
    startCall();
};

signalingServer.onerror = error => {
    console.error('WebSocket error:', error);
};

// WebSocket message handler
signalingServer.onmessage = async (message) => {
    const data = JSON.parse(message.data);

    if (data.type === "sdp") {
        // Ensure peer connection is initialized if it's not yet created
        if (!peerConnection) {
            console.log("Initializing PeerConnection for incoming SDP message.");
            await initializePeerConnection();  // Create the peer connection if it's not already
        }

        // Handle SDP (Session Description Protocol)
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
        if (data.sdp.type === "offer") {
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            signalingServer.send(JSON.stringify({ type: "sdp", sdp: peerConnection.localDescription }));
        }
    } 
    else if (data.type === "ice") {
        if (!peerConnection) {
            console.warn("PeerConnection is not initialized yet. Ignoring ICE candidate.");
            return;
        }
        // Handle ICE candidates
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.ice));
    }
    else if(data.type==='disconnect'){
        endCall();
    }
};

// Start video call
async function startCall() {
    // Ensure WebSocket connection is open before starting the call
    if (signalingServer.readyState === WebSocket.OPEN) {
        if (!peerConnection) {
            await initializePeerConnection();  // Ensure peer connection is initialized
        }

        // Create and send SDP offer
        if (!peerConnection.remoteDescription) {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            signalingServer.send(JSON.stringify({ type: "sdp", sdp: peerConnection.localDescription }));
        }
    } else {
        console.error('WebSocket is not open. Cannot start the call.');
    }
}

// End video call
function endCall() {
    alert("Call Ended");
    if (peerConnection) {
        peerConnection.close();  // Close the peer connection
        peerConnection = null;

        // Stop the local media stream
        localStream.getTracks().forEach(track => track.stop());

        // Remove video elements
        const localVideo = document.getElementById("localVideo");
        const remoteVideo = document.getElementById("remoteVideo");
        if (localVideo) {
            localVideo.srcObject = null;
            localVideo.remove();
        }
        if (remoteVideo) {
            remoteVideo.srcObject = null;
            remoteVideo.remove();
        }
        

        
        window.location.href="/static/index.html";
    }
}
