// hooks/useAudioCall.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import Peer from 'simple-peer';

interface UseAudioCallProps {
  userId: string;
  onIncomingCall?: (data: any) => void;
  onCallEnded?: () => void;
}

export const useAudioCall = ({ userId, onIncomingCall, onCallEnded }: UseAudioCallProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [peers, setPeers] = useState<Map<string, Peer.Instance>>(new Map());
  const [currentCall, setCurrentCall] = useState<{ type: 'single' | 'meeting' | null; target: string | null }>({
    type: null,
    target: null,
  });

  const socketRef = useRef<Socket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001');
    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
      socketInstance.emit('register-user', { userId });
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  // Initialize local audio stream
  const initializeLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });
      setLocalStream(stream);
      localStreamRef.current = stream;
      return stream;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    peers.forEach(peer => peer.destroy());
    setPeers(new Map());
    setRemoteStreams(new Map());
    setCurrentCall({ type: null, target: null });
  }, [peers]);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = (data: any) => {
      onIncomingCall?.(data);
      setCurrentCall({ type: data.callType, target: data.from });
    };

    const handleCallAnswered = async (data: any) => {
      const peer = peers.get(currentCall.target!);
      if (peer && data.answer) {
        peer.signal(data.answer);
      }
    };

    const handleIceCandidate = (data: any) => {
      const peer = peers.get(data.from);
      if (peer && data.candidate) {
        peer.signal(data.candidate);
      }
    };

    const handleCallEnded = () => {
      cleanup();
      onCallEnded?.();
    };

    const handleUserJoined = async (data: any) => {
      if (!localStreamRef.current) return;

      const peer = new Peer({
        initiator: true,
        trickle: true,
        stream: localStreamRef.current,
      });

      peer.on('signal', (signalData: RTCSessionDescriptionInit) => {
        socket.emit('ice-candidate', {
          candidate: signalData,
          to: data.userId,
          from: userId,
        });
      });

      peer.on('stream', (remoteStream: MediaStream) => {
        setRemoteStreams(prev => new Map(prev.set(data.userId, remoteStream)));
      });

      peer.on('close', () => {
        setRemoteStreams(prev => {
          const newStreams = new Map(prev);
          newStreams.delete(data.userId);
          return newStreams;
        });
        setPeers(prev => {
          const newPeers = new Map(prev);
          newPeers.delete(data.userId);
          return newPeers;
        });
      });

      setPeers(prev => new Map(prev.set(data.userId, peer)));
    };

    const handleExistingUsers = (data: any) => {
      data.users.forEach(async (existingUserId: string) => {
        if (!localStreamRef.current) return;

        const peer = new Peer({
          initiator: false,
          trickle: true,
          stream: localStreamRef.current,
        });

        peer.on('signal', (signalData: RTCSessionDescriptionInit) => {
          socket.emit('ice-candidate', {
            candidate: signalData,
            to: existingUserId,
            from: userId,
          });
        });

        peer.on('stream', (remoteStream: MediaStream) => {
          setRemoteStreams(prev => new Map(prev.set(existingUserId, remoteStream)));
        });

        setPeers(prev => new Map(prev.set(existingUserId, peer)));
      });
    };

    const handleUserLeft = (data: any) => {
      setRemoteStreams(prev => {
        const newStreams = new Map(prev);
        newStreams.delete(data.userId);
        return newStreams;
      });
      setPeers(prev => {
        const newPeers = new Map(prev);
        newPeers.delete(data.userId);
        return newPeers;
      });
    };

    socket.on('incoming-call', handleIncomingCall);
    socket.on('call-answered', handleCallAnswered);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('call-ended', handleCallEnded);
    socket.on('user-joined', handleUserJoined);
    socket.on('existing-users', handleExistingUsers);
    socket.on('user-left', handleUserLeft);

    return () => {
      socket.off('incoming-call', handleIncomingCall);
      socket.off('call-answered', handleCallAnswered);
      socket.off('ice-candidate', handleIceCandidate);
      socket.off('call-ended', handleCallEnded);
      socket.off('user-joined', handleUserJoined);
      socket.off('existing-users', handleExistingUsers);
      socket.off('user-left', handleUserLeft);
    };
  }, [socket, peers, currentCall, userId, cleanup, onIncomingCall, onCallEnded]);

  // Single call functions
  const makeSingleCall = useCallback(async (targetUserId: string) => {
    if (!socket || !localStreamRef.current) {
      await initializeLocalStream();
    }

    const peer = new Peer({
      initiator: true,
      trickle: true,
      stream: localStreamRef.current!,
    });

    peer.on('signal', (offer: RTCSessionDescriptionInit) => {
      socket?.emit('call-user', {
        offer,
        from: userId,
        to: targetUserId,
        callType: 'single',
      });
    });

    peer.on('stream', (remoteStream: MediaStream) => {
      setRemoteStreams(prev => new Map(prev.set(targetUserId, remoteStream)));
    });

    peer.on('close', () => {
      cleanup();
    });

    setPeers(prev => new Map(prev.set(targetUserId, peer)));
    setCurrentCall({ type: 'single', target: targetUserId });
  }, [socket, userId, initializeLocalStream, cleanup]);

  const answerCall = useCallback(async (offer: RTCSessionDescriptionInit) => {
    if (!socket || !currentCall.target) return;

    await initializeLocalStream();

    const peer = new Peer({
      initiator: false,
      trickle: true,
      stream: localStreamRef.current!,
    });

    peer.on('signal', (answer: RTCSessionDescriptionInit) => {
      socket.emit('answer-call', {
        answer,
        to: currentCall.target!,
      });
    });

    peer.on('stream', (remoteStream: MediaStream) => {
      setRemoteStreams(prev => new Map(prev.set(currentCall.target!, remoteStream)));
    });

    peer.signal(offer);
    setPeers(prev => new Map(prev.set(currentCall.target!, peer)));
  }, [socket, currentCall, initializeLocalStream]);

  // Meeting call functions
  const joinMeeting = useCallback(async (roomId: string) => {
    if (!socket) return;

    await initializeLocalStream();
    socket.emit('join-meeting', { roomId, userId });
    setCurrentCall({ type: 'meeting', target: roomId });
  }, [socket, userId, initializeLocalStream]);

  const leaveMeeting = useCallback(() => {
    if (!socket || !currentCall.target) return;

    socket.emit('leave-meeting', { roomId: currentCall.target, userId });
    cleanup();
  }, [socket, currentCall, userId, cleanup]);

  const endCall = useCallback(() => {
    if (!socket) return;

    if (currentCall.type === 'single' && currentCall.target) {
      socket.emit('end-call', { to: currentCall.target });
    } else if (currentCall.type === 'meeting') {
      leaveMeeting();
    }
    cleanup();
  }, [socket, currentCall, leaveMeeting, cleanup]);

  return {
    isConnected,
    localStream,
    remoteStreams,
    currentCall,
    makeSingleCall,
    answerCall,
    joinMeeting,
    leaveMeeting,
    endCall,
    initializeLocalStream,
  };
};