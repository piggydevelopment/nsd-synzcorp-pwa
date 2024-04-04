
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Loading from '../parts/loading';
import {
    BrowserRouter as Router,
    useNavigate,
    Link,
} from "react-router-dom";
import axios from 'axios';
import Banner from '../parts/banners';
import { apiUrl } from '../../configs/app';
import { ReactSession } from 'react-client-session';
import { Specialist } from '../parts/specialist';
import CachedIcon from '@mui/icons-material/Cached';
import IconButton from '@mui/material/IconButton';
import Chat from './chat';
export function HomePage() {
    const [banners, setBanners] = useState(localStorage.getItem('banners') ? JSON.parse(localStorage.getItem('banners')) : []);
    const [user, setUser] = useState(ReactSession.get('user'));
    const [isLoading, setIsLoading] = useState(true);
    const [specialist_psych, setSpecialistPsych] = useState(localStorage.getItem('specialist_psych') ? JSON.parse(localStorage.getItem('specialist_psych')) : []);
    const [specialist_consult, setSpecialistConsult] = useState(localStorage.getItem('specialist_consult') ? JSON.parse(localStorage.getItem('specialist_consult')) : []);
    const navigate = useNavigate();

    useEffect(() => {
        !user && navigate('/login');
        isLoading && initialize();
    }, [0]);

    const initialize = async () => {
        let last_update = localStorage.getItem('last_update') || null;
        // check if now is 16.00
        let now = new Date();
        let hour = now.getHours();
        if (hour >= 16) {
            updateHandle();
        }
        
        if (Date.now() - last_update > 3600000 || last_update === null) {
            await updateHandle()
            // check if last_update is older than 1 hour
        } else {
            await getBanners();
            await getSpecialist(1);
            await getSpecialist(2);
        }
        setIsLoading(false);
        forceUpdateInfo();

        return
    };

    const updateHandle = async () => {
        setIsLoading(true);
        await localStorage.removeItem('banners');
        await localStorage.removeItem('specialist_type_1');
        await localStorage.removeItem('specialist_type_2');
        await localStorage.setItem('last_update', Date.now());

        await getBanners();
        await getSpecialist(1);
        await getSpecialist(2);
        setIsLoading(false);
        return ;
    }

    const forceUpdateInfo = async () => {
        if(Number(user.is_active) === 0 || user.is_active === 0) {
            alert('บัญชีของคุณถูกระงับ กรุณาติดต่อผู้ดูแลระบบ');
            await ReactSession.remove('user');
            await localStorage.removeItem('user');
            await localStorage.removeItem('specialist_type_1')
            await localStorage.removeItem('banners')
            await localStorage.removeItem('email')
            await localStorage.removeItem('ref')
            await localStorage.removeItem('last_update')
            
            navigate('/login');
        }

        if(user) {
            if(
                user.attribute_1 === null ||
                user.firstname === null ||
                user.lastname === null ||
                user.phone_number === null
            ) {
                navigate('/update')
            }
        }
    }

    const getBanners = async () => {
        try {
            let local_banners = await localStorage.getItem('banners') || []
            if (local_banners.length !== 0) {
                await setBanners(JSON.parse(local_banners));
                return
            } else {
                let getBannersData = await axios.get(apiUrl + "/api/banners");
                getBannersData = getBannersData.data.data;
                await setBanners(getBannersData);
                await localStorage.setItem('banners', JSON.stringify(getBannersData));
                return
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getSpecialist = async (type) => {
        try {
            let localSpecialist = await localStorage.getItem('specialist_type_' + type)
            if (localSpecialist !== null) {
                if (type === 1) {
                    setSpecialistPsych(JSON.parse(localSpecialist));
                    return
                }
                if (type === 2) {
                    setSpecialistConsult(JSON.parse(localSpecialist));
                    return
                }
            } else {
                let getSpecialistData = await axios.get(apiUrl + "/api/specialist/type/" + type);
                getSpecialistData = getSpecialistData.data.data;
                if (type === 1) await setSpecialistPsych(getSpecialistData);
                if (type === 2) await setSpecialistConsult(getSpecialistData);
                await localStorage.setItem('specialist_type_' + type, JSON.stringify(getSpecialistData));

                return
            }
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <Box sx={{ backgroundColor: '#F6F6F6' }}>
            <Chat/>
            {isLoading ? <Loading /> : null}
            <div style={{ marginBottom: '10px', flex: '1', justifyContent: 'flex-start', flexDirection: 'row', display: 'flex', justifyItems: 'center', alignItems: 'center' }}>
                <img src='images/logo.png' style={{ height: '64px' }} />
                <div style={{ marginLeft: '10px' }}>
                    สุขภาพใจของเธอ ให้  <span style={{ color: '#461E99', fontWeight: 800 }}>SynZ</span> ดูแลนะ
                </div>
                <IconButton
                onClick={updateHandle}
                sx={{
                    position: 'absolute',
                    right: 10
                }}>
                    <CachedIcon />
                </IconButton>
            </div>
            <div style={{ paddingLeft: '20px', justifyContent: 'flex-start', flexDirection: 'row', display: 'flex', fontSize: '18px', fontWeight: 600 }}>
                {(!user.firstname) ? <Link to="/update" style={{ color: 'red', textDecoration: 'none' }}>กรุณาอัปเดทข้อมูล ⚠️</Link> : 'สวัสดี, ' + user.firstname + ' ' + user.lastname}

            </div>
            
            {
                (banners.length > 0) ? <Banner data={banners} /> : null
            }
            {
                (specialist_consult.length > 0) ? <Specialist type={'นักจิตวิทยา'} data={specialist_consult} /> : null
            }
            {
                (specialist_psych.length > 0) ? <Specialist type={'จิตแพทย์'} data={specialist_psych} /> : null
            }
            
        </Box>
    );
}