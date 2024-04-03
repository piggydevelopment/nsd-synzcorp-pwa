
import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import { areas, departments } from '../../configs/app';
import Snackbar from '@mui/material/Snackbar';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import {
    BrowserRouter as Router,
    Link,
    useNavigate
} from "react-router-dom";
import { ReactSession } from 'react-client-session';
import axios from 'axios';
import { apiUrl } from '../../configs/app';
export function UpdatePage() {
    const [area, setArea] = useState('');
    const [department, setDepartment] = useState('');
    const [user, setUser] = useState(ReactSession.get('user'));
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    const handleSubmit = async e => {
        // validate all input is not empty
        e.preventDefault();
        try {
            // update user to server
            await axios.put(apiUrl + '/api/user/' + user.id, user);
            await ReactSession.set('user', user);
            await localStorage.setItem('user', JSON.stringify(user));
            await setOpen(true);
            setTimeout(() => {
                navigate('/home')
            }, 3000);
        } catch (error) {
            alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง')
        }
    };

    const handleChangeArea = (event) => {
        setUser({...user, attribute_2: event.target.value});
    };
    const handleChangeDepartment = (event) => {
        setUser({...user, attribute_1: event.target.value});
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
      };
    return (
        <Box sx={{backgroundColor:'#FFF',paddingBottom:'80px'}}>
            <AppBar position="relative" sx={{backgroundColor:'#FFF',color:'#000',boxShadow:'unset',paddingTop:'10px'}}>
                <Toolbar>
                    <Typography  className='NotoSansThai' component="div" sx={{ flexGrow: 1,textAlign:'center',fontWeight:600,fontSize:18 }}>
                        อัพเดทข้อมูลบัญชีผู้ใช้
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box
                component="form"
                autoComplete="off"
                onSubmit={handleSubmit}
                pt={5}
            >

                <Stack sx={{mx:3}} spacing={4}>
                    <TextField
                        label="ชื่อ"
                        required={true}
                        variant="standard"
                        value={user.firstname}
                        defaultValue={user.firstname}
                        onChange={(e) => setUser({...user, firstname: e.target.value})}
                    />
                    <TextField
                        label="นามสกุล"
                        required={true}
                        variant="standard"
                        value={user.lastname}
                        defaultValue={user.lastname}
                        onChange={(e) => setUser({...user, lastname: e.target.value})}
                    />
                    <TextField
                        label="อีเมล"
                        required={true}
                        variant="standard"
                        value={user.email}
                        defaultValue={user.email}
                        disabled
                    />
                    <TextField
                        label="เบอร์โทร"
                        required={true}
                        variant="standard"
                        value={user.phone_number}
                        defaultValue={user.phone_number}
                        onChange={(e) => setUser({...user, phone_number: e.target.value})}
                        inputProps={{ maxLength: 10, pattern: "[0-9]{10}"  }}
                        type="tel"
                        InputLabelProps={{
                            shrink: true,
                          }}
                    />

                    <FormControl fullWidth>
                        <InputLabel id="synz-select-label">สังกัด</InputLabel>
                        <Select
                            labelId="synz-select-label"
                            id="synz-select-department"
                            value={user.attribute_2}
                            label="สังกัด *"
                            required={true}
                            variant='standard'
                            onChange={handleChangeDepartment}
                        >
                            {areas.map((area, index) => (
                                <MenuItem key={index} value={area}>{area}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel id="synz-select-label">สถานปที่ฏิบัติงาน</InputLabel>
                        <Select
                            labelId="synz-select-label"
                            id="synz-select-area"
                            value={user.attribute_1}
                            label="สถานปที่ฏิบัติงาน *"
                            variant='standard'
                            required={true}
                            onChange={handleChangeArea}
                        >
                            {departments.map((department, index) => (
                                <MenuItem
                                key={index} 
                                value={department}>{department}</MenuItem>
                            ))}
                            
                        </Select>
                    </FormControl>

    
                    <Button 
                    variant="contained"  
                    type="submit"
                    fullWidth
                    className='NotoSansThai'
                    sx={{ 
                        borderRadius: 50 ,
                        backgroundColor:'#461E99',
                        padding:'16px 32px',
                        fontSize:'16px',
                    }}
                    >บันทึกข้อมูล</Button>
                
                </Stack>
                <Snackbar
                    open={open}
                    autoHideDuration={3000}
                    onClose={handleClose}
                    message="บันทึกเสร็จเรียบร้อย"
                />
            </Box>

           
        </Box>
    );
}