
import React, { useState, useEffect, Component } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import TimerSharpIcon from '@mui/icons-material/TimerSharp';
import ClearIcon from '@mui/icons-material/Clear';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import Button from '@mui/material/Button';
// import Link
import { Link, useNavigate } from 'react-router-dom';
import { ReactSession } from 'react-client-session';
import Loading from '../parts/loading';
import axios from 'axios';
import { apiUrl } from '../../configs/app';
import Chat from './chat';
export function HistoryPage() {
    const [user, setUser] = useState(ReactSession.get('user'));
    const [booking, setBooking] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();
    // call api to get booking history from /api/booking/user_id with method GET
    useEffect(() => {
        getBookingHistory();
    }, []);

    const getBookingHistory = async () => {
        let getBookingHistoryData = await axios.get(apiUrl + "/api/appointment/" + user.id);
        getBookingHistoryData = getBookingHistoryData.data.data !== undefined ? getBookingHistoryData.data.data : [];
        await setBooking(getBookingHistoryData);
        setLoading(false);
    }

    return (
        <Box sx={{ backgroundColor: '#F6F6F6' }}>
            {loading ? <Loading /> : null}
            <Chat/>
            <AppBar position="relative" sx={{ backgroundColor: '#FFF', color: '#000', boxShadow: 'unset', paddingTop: '10px' }}>
                <Toolbar>
                    <Typography className='NotoSansThai' component="div" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 600, fontSize: 18 }}>
                        ประวัติ
                    </Typography>
                </Toolbar>
            </AppBar>
            {
                (booking.length === 0) ?
                <Box sx={{ backgroundColor: '#FFF', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography className='NotoSansThai' component="div" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 600, fontSize: 18 }}>
                        <img src='images/nohistory.png' width={{width: '80%', marginTop: '20%'}} />
                        <p>ยังไม่มีประวัติการนัด</p>
                    </Typography>
                </Box>
                : 
                booking.map((booking) => (
                    <Box sx={{ px: 3, pt: 2, pb: 2, backgroundColor: '#FFF' }} mb={1} key={booking.id} >
                        <Stack spacing={2} mb={2} direction="row" alignItems="center" justifyContent="space-between">
                            <Stack spacing={2} mb={3} direction="row" alignItems="center" sx={{ color: '#461E99' }}>
                                <CalendarMonthIcon />
                                <Typography className='NotoSansThai' component="div" sx={{ fontWeight: 600, fontSize: 16, paddingTop: '4px' }}>
                                    {new Date(booking.appointment_date).toLocaleDateString()} {booking.appointment_time}
                                </Typography>
                            </Stack>
                            <Stack spacing={2} mb={2} direction="column" alignItems="center" justifyContent="space-between">
                                <Typography className='NotoSansThai' mb={1} component="div" sx={{ fontSize: 14, color: '#656565', marginTop: '10px' }}>
                                    หมายเลขนัดหมาย: {booking.number}
                                </Typography>
                            </Stack>

                        </Stack>
                        <Stack spacing={2} mb={2} direction="row" alignItems="start">
                            <Avatar
                                src={booking.profile_pic_file_name}
                                sx={{ width: 64, height: 64 }}
                            />
                            <div>
                                <Typography className='NotoSansThai' mb={1} component="div" sx={{ fontWeight: 600, fontSize: 16, color: '#2C2C2C' }}>
                                    {booking.prefix}{booking.firstname} {booking.lastname}
                                </Typography>
                                <Typography className='NotoSansThai' mb={1} component="div" sx={{ fontSize: 13, color: "#656565" }}>
                                    {booking.type_name}
                                </Typography>
                                {
                                    booking.appointment_status_id == 1 ?
                                    <Stack spacing={2} direction="row" alignItems="center" sx={{ color: '#FF7D45' }}>
                                        <TimerSharpIcon />
                                        <Typography className='NotoSansThai' component="div" sx={{ fontWeight: 600, fontSize: 16, paddingTop: '4px' }}>
                                            จอง
                                        </Typography>
                                    </Stack>
                                    : booking.appointment_status_id == 2 ?
                                        <Stack spacing={2} direction="row" alignItems="center" sx={{ color: '#27AE60' }}>
                                        <EventAvailableIcon />
                                        <Typography className='NotoSansThai' component="div" sx={{ fontWeight: 600, fontSize: 16, paddingTop: '4px' }}>
                                            ยืนยัน
                                        </Typography>
                                    </Stack>
                                    : booking.appointment_status_id == 3 ?
                                    <Stack spacing={2} direction="row" alignItems="center" sx={{ color: '#656565' }}>
                                        <CheckSharpIcon />
                                        <Typography className='NotoSansThai' component="div" sx={{ fontWeight: 600, fontSize: 16, paddingTop: '4px' }}>
                                            ใช้บริการแล้ว
                                        </Typography>
                                    </Stack>
                                    :
                                    <Stack spacing={2} direction="row" alignItems="center" sx={{ color: '#FF0000' }}>
                                        <ClearIcon />
                                        <Typography className='NotoSansThai' component="div" sx={{ fontWeight: 600, fontSize: 16, paddingTop: '4px' }}>
                                            ยกเลิก
                                        </Typography>
                                    </Stack>
                                }
                            </div>

                            {
                                // add condition show this button only when appointment_date && appointment_time is before 1 hour

                                booking.appointment_status_id == 1 && new Date(booking.appointment_date + ' ' + booking.appointment_time) > new Date() + 60 * 60 * 1000 ?
                                console.log('yes', new Date(booking.appointment_date + ' ' + booking.appointment_time), new Date() + 60 * 60 * 1000)
                                :
                                console.log('no', new Date(booking.appointment_date + ' ' + booking.appointment_time), new Date() + 60 * 60 * 1000)
                            }

                            {
                                
                                booking.appointment_status_id == 2 ?
                                    <Stack spacing={2} direction="row" alignItems="center" sx={{ flex: 1, justifyContent: 'flex-end', }}>
                                        <Button
                                            variant="contained"
                                            component={Button}
                                            onClick={() => {
                                                let data = {
                                                    room: booking.number,
                                                    bookingId: booking.id,
                                                    consult: booking.prefix + booking.firstname + " " + booking.lastname,
                                                    consultProfile: booking.profile_pic_file_name,
                                                    user: user.firstname + " " + user.lastname
                                                }
                                                localStorage.setItem('current_meet', JSON.stringify(data));
                                                if(booking.second_meeting_room_url === null || booking.second_meeting_room_url === undefined) {
                                                    navigate('/meet', { state: data });
                                                } else {
                                                    window.location.href=booking.second_meeting_room_url
                                                }
                                            }}
                                            className='NotoSansThai'
                                            sx={{
                                                borderRadius: 30,
                                                backgroundColor: '#461E99',
                                                padding: '6px;',
                                                fontSize: '16px',
                                                marginTop: '10px',
                                                width: '50%',
                                            }}
                                        >เข้าห้อง</Button>
                                    </Stack>
                                    : null
                            }
                        </Stack>
                    </Box>
                ))
            }

        </Box>
    );
}