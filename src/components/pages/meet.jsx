import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material';
import { useNavigate, useLocation } from "react-router-dom";
import { JitsiMeeting } from '@jitsi/react-sdk';
import axios from 'axios';
import { apiUrl } from '../../configs/app';
import Chat from './chat';
import { ReactSession } from 'react-client-session';
import dayjs from 'dayjs';

export function MeetPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [room, setRoom] = useState(location.state.room) || "synzroom";
    const [user, setUser] = useState(ReactSession.get('user'));
    const [domain, setDomain] = useState('meetsynz.nsd.services');
    const [toolbar, setToolbar] = useState({
        toolbarButtons: [
            'microphone',
            'camera',
            'fullscreen',
            'synz-tool',
            'profile',
            'raisehand'
        ],
        startWithAudioMuted: true,
        disableModeratorIndicator: true,
        startScreenSharing: false,
        enableEmailInStats: false
    });
    const [meet_info, setMeetInfo] = useState({
        user_id: user.id,
        appointment_number: location.state.room,
        start_datetime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        end_datetime: ''
    });

    useEffect(() => {
        axios.post(apiUrl + '/api/appointment/meetingroom/start', meet_info);
        console.log('meeting', meet_info)
        localStorage.setItem('meet_' + location.state.room, JSON.stringify(meet_info));
        setRoom(location.state.room)
    }, []);
    
    const exitHandler = async () => {
        let data = {
            user_id: user.id,
            appointment_number: location.state.room,
            start_datetime: meet_info.start_datetime,
            end_datetime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };

        await setMeetInfo(data);
        await localStorage.setItem('meet_' + location.state.room, '' );
        await axios.post(apiUrl + '/api/appointment/meetingroom/end', data);

        navigate('/question', {state: location.state})
    };

    return (
        <Box component="form">
            <Chat disabled={true}/>
            <JitsiMeeting
                domain={domain}
                roomName={room}
                configOverwrite={{
                    toolbar, 
                    prejoinConfig: {
                        enabled: false
                    },
                    toolbarConfig: {
                        alwaysVisible: true
                    },
                    deeplinking: {
                        disabled : true
                    },
                    p2p: {
                        enabled: false
                    },
                    setVideoQuality: 720,
                    disablePolls: true,
                    liveStreaming: {
                        enabled: false
                    },
                    localRecording: {
                        enabled: false
                    },
                    recordingService: {
                        enabled: false
                    },
                    hideAddRoomButton: true,
                    enableClosePage: false,
                    customToolbarButtons: [
                        {
                            icon: '/images/stethoscope.svg',
                            id: 'synz-tool',
                            text: 'Synz Tools'
                        }
                    ],
                    customParticipantMenuButtons: [
                        {
                            icon: '/images/stethoscope.svg',
                            id: 'synz-tool',
                            text: 'Synz Tools'
                        }
                    ],
                }}
                interfaceConfigOverwrite={{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
                }}
                userInfo={{
                    displayName: user
                }}
                onApiReady={(externalApi) => {
                    // here you can attach custom event listeners to the Jitsi Meet External API
                    // you can also store it locally to execute commands
                }}
                onReadyToClose = {exitHandler}
                getIFrameRef={(iframeRef) => { 
                    iframeRef.style.height = '100vh'; 
                    iframeRef.style.margin = 0; 
                    iframeRef.style.padding = 0;
                    iframeRef.style.padding = 0;
                    
                }}
            />
        </Box>
    )
}