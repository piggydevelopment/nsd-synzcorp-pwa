
import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import {
    BrowserRouter as Router,
    Link,
    useParams
} from "react-router-dom";
import dayjs from 'dayjs';
import axios from 'axios';
import { apiUrl } from '../../configs/app';
import { ReactSession } from 'react-client-session';
import { useNavigate } from 'react-router-dom';
import Loading from '../parts/loading';
export function AppointmentPage() {
    const [specialistId] = useState(useParams().expertID);
    const navigate = useNavigate();
    const [user, setUser] = useState(ReactSession.get('user'));
    const [bookingTime, setBookingTime] = React.useState();
    const [bookingDate, setBookingDate] = React.useState(dayjs());
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [isBookable, setIsBookable] = useState(1);
    const [loading, setLoading] = React.useState(true);
    const [specialist, setSpecialist] = useState({
        "id": 0,
        "prefix": "",
        "firstname": "",
        "lastname": "",
        "nick_name": "",
        "profile_pic_file_name": "",
        "education_record": "",
        "work_history": "",
        "schedule_appointments": "",
        "topics_json": []
    });

    useEffect(() => {

        if(!user.birthday || user.birthday === '') {
            navigate('/form', { state: { sid: specialistId } });
        }
        
        getSpecialist();

    }, [specialistId]);
    // get api of specialist by id
    const getSpecialist = async () => {
        if (!specialistId) return
        try{
            let res = await axios.get(apiUrl + '/api/specialist/' + specialistId);
            let newdata = {
                "id": res.data.data.id,
                "prefix": res.data.data.prefix === null ? "" : res.data.data.prefix,
                "firstname": res.data.data.firstname === null ? "" : res.data.data.firstname,
                "lastname": res.data.data.lastname === null ? "" : res.data.data.lastname,
                "nick_name": res.data.data.nick_name === null ? "" : res.data.data.nick_name,
                "profile_pic_file_name": res.data.data.profile_pic_file_name === null ? "" : res.data.data.profile_pic_file_name,
                "education_record": res.data.data.education_record === null ? "" : res.data.data.education_record,
                "work_history": res.data.data.work_history === null ? "" : res.data.data.work_history,
                "schedule_appointments": res.data.data.schedule_appointments === null ? "" : res.data.data.schedule_appointments,
                "topics_json": res.data.data.topics_json,
                "is_active": (!Number(res.data.data.is_active)) ? 1 : 0
            }
            
            setIsBookable(newdata.is_active);
            setSpecialist(newdata);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!specialistId) return;
        const submit_data = {
            organization_id: 1,
            user_id: user.id,
            specialist_id: specialistId,
            appointment_date: bookingDate.format('YYYY-MM-DD'),
            appointment_time: bookingTime.format('HH:mm')
        }
        let res = await axios.post( apiUrl + '/api/appointment', submit_data );
        navigate('/confirm', { booking: { specialistId, bookingDate, bookingTime } });
    };

    return (
        <Box sx={{ backgroundColor: '#F6F6F6' }}>
            {loading ? <Loading /> : null}
            <AppBar position="relative" sx={{ backgroundColor: '#FFF', color: '#000', boxShadow: 'unset', paddingTop: '10px' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2, position: "absolute" }}
                        component={Link} to="/home"
                    >
                        <ArrowBackIosNewOutlinedIcon />
                    </IconButton>
                    <Typography className='NotoSansThai' component="div" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 600, fontSize: 18 }}>
                        รายละเอียดการจอง
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{ p: 4, backgroundColor: '#FFF' }} mb={2} >
                <Typography className='NotoSansThai' mb={2} component="div" sx={{ fontWeight: 600, fontSize: 18 }}>
                    ผู้เชี่ยวชาญ
                </Typography>


                <Stack spacing={2} mb={3} direction="row" alignItems="center">
                    <Avatar
                        alt=""
                        src={specialist.profile_pic_file_name}
                        sx={{ width: 64, height: 64 }}
                    />
                    <div>
                        <Typography className='NotoSansThai' mb={1} component="div" sx={{ fontWeight: 600, fontSize: 16, color: '#2C2C2C' }}>
                            {specialist.prefix + specialist.firstname} {specialist.lastname}
                        </Typography>
                        {/* <Typography  className='NotoSansThai'  component="div"  sx={{ fontSize:13,color:"#656565" }}>
                         จิตแพทย์
                        </Typography> */}
                    </div>
                </Stack>
                <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    className='NotoSansThai'
                    sx={{
                        borderRadius: 50,
                        backgroundColor: '#461E99',
                        padding: '16px 32px',
                        fontSize: '16px',
                    }}
                    disabled={isBookable}
                    onClick={() => setDrawerOpen(true)}
                >ปรึกษา </Button>
            </Box>

            <Box sx={{ p: 4, backgroundColor: '#FFF' }} mb={2} >
                <Typography className='NotoSansThai' mb={2} component="div" sx={{ fontWeight: 600, fontSize: 18 }}>
                    ประวัติการศึกษา
                </Typography>
                <Typography>
                    <ul>
                    {
                        specialist.education_record.split('\n').map((item, i) => (
                            <li key={i}>{item.replace('-', '')}</li>
                        ))
                    }
                    </ul>
                </Typography>
            </Box>

            <Box sx={{ p: 4, backgroundColor: '#FFF' }} mb={2} >
                <Typography className='NotoSansThai' mb={2} component="div" sx={{ fontWeight: 600, fontSize: 18 }}>
                    ประวัติการทำงาน
                </Typography>
                <Typography>
                    <ul>
                    {
                        specialist.work_history.split('\n').map((item, i) => (
                            <li key={i}>{item.replace('-', '')}</li>
                        ))
                    }
                    </ul>
                </Typography>
            </Box>

            <Box sx={{ px: 4, backgroundColor: '#FFF' }} pb={6} pt={4} >
                <Typography className='NotoSansThai' mb={2} component="div" sx={{ fontWeight: 600, fontSize: 18 }}>
                    ตารางเวลาสำหรับนัดหมายล่วงหน้า
                </Typography>

                <Typography sx={{ mb: 3 }} className='NotoSansThai'>
                    <ul>
                        {
                            specialist.schedule_appointments.split('\n').map((item, i) => (
                                <li key={i}>{item.replace('-', '')}</li>
                            ))
                        }
                    </ul>
                </Typography>
                
                <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    className='NotoSansThai'
                    disabled={isBookable}
                    sx={{
                        borderRadius: 50,
                        backgroundColor: '#461E99',
                        padding: '16px 32px',
                        fontSize: '16px',
                    }}
                    onClick={() => setDrawerOpen(true)}
                >ปรึกษา </Button>
            </Box>
            <Drawer
                anchor="bottom"
                open={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <Box className="bxbot" >
                    <Box p={4} >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar sx={{
                                width: '100%',
                                mb: 1
                            }}
                                value={bookingDate}
                                disablePast
                                onChange={(bookingDate) => setBookingDate(bookingDate)}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box components={['TimePicker']}>
                                <TimePicker label="เวลา" sx={{ width: '100%' }}
                                    value={bookingTime}
                                    minutesStep={30}
                                    ampm={false}
                                    onChange={(bookingTime) => setBookingTime(bookingTime)} />
                            </Box>
                        </LocalizationProvider>
                        <Box pt={4}>
                            <Button
                                variant="contained"
                                type="submit"
                                onClick={handleSubmit}
                                fullWidth
                                className='NotoSansThai'
                                sx={{
                                    borderRadius: 50,
                                    backgroundColor: '#461E99',
                                    padding: '14px 32px',
                                    fontSize: '16px',
                                }}
                            >ยืนยันการนัดหมาย</Button>
                        </Box>
                    </Box>
                </Box>
            </Drawer>


        </Box>
    );
}