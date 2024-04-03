
import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { areas, departments } from '../../configs/app';
import Snackbar from '@mui/material/Snackbar';
import {
    BrowserRouter as Router,
    useNavigate
} from "react-router-dom";
import { ReactSession } from 'react-client-session';
import axios from 'axios';
import { apiUrl } from '../../configs/app';
import Chat from './chat';
export function AccountPage() {
    const [user, setUser] = useState(ReactSession.get('user'));
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [snackbar, setSnackBar] = React.useState(false);


    const handleSubmit = async e => {
        // validate all input is not empty
        e.preventDefault();
        try {
            // update user to server
            await axios.put(apiUrl + '/api/user/' + user.id, user);
            await ReactSession.set('user', user);
            await localStorage.setItem('user', JSON.stringify(user));
            await setSnackBar(true);
            setTimeout(() => {
                navigate('/home')
            }, 3000);
        } catch (error) {
            alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง')
        }
    };

    const handleChangeArea = (event) => {
        setUser({ ...user, attribute_2: event.target.value });
    };
    const handleChangeDepartment = (event) => {
        setUser({ ...user, attribute_1: event.target.value });
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };


    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to exit?')) {
            await ReactSession.remove('user');
            await localStorage.removeItem('user');
            await localStorage.removeItem('specialist_type_1')
            await localStorage.removeItem('specialist_type_2')
            await localStorage.removeItem('banners')
            await localStorage.removeItem('email')
            await localStorage.removeItem('ref')
            await localStorage.removeItem('last_update')
            // await window.$chatwoot.reset();
            await window.$chatwoot.toggleBubbleVisibility("hide");
            navigate('/login');
        }
    };
    return (
        <Box sx={{ backgroundColor: '#FFF', paddingBottom: '80px' }}>
            <Chat/>
            <Box
                component="form"
                autoComplete="off"
                onSubmit={handleSubmit}
                pt={5}
            >

                <Stack sx={{ mx: 3 }} spacing={4}>
                    <TextField
                        label="ชื่อ"
                        required={true}
                        variant="standard"
                        value={user.firstname}
                        defaultValue={user.firstname}
                        onChange={(e) => setUser({ ...user, firstname: e.target.value })}
                    />
                    <TextField
                        label="นามสกุล"
                        required={true}
                        variant="standard"
                        value={user.lastname}
                        defaultValue={user.lastname}
                        onChange={(e) => setUser({ ...user, lastname: e.target.value })}
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
                        inputProps={{ maxLength: 10, pattern: "[0-9]{10}" }}
                        type="tel"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    
                    <FormControl fullWidth>
                        <InputLabel id="synz-select-area">สังกัด</InputLabel>
                        <Select
                            labelId="synz-select-area"
                            id="synz-select-area"
                            value={user.attribute_2}
                            label="สังกัด *"
                            variant='standard'
                            required={true}
                            onChange={handleChangeArea}
                        >
                            {areas.map((area, index) => (
                                <MenuItem key={index} value={area}>{area}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel id="synz-select-department">สถานปที่ฏิบัติงาน</InputLabel>
                        <Select
                            labelId="synz-select-department"
                            id="synz-select-department"
                            value={user.attribute_1}
                            label="สถานปที่ฏิบัติงาน *"
                            required={true}
                            variant='standard'
                            onChange={handleChangeDepartment}
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
                            borderRadius: 50,
                            backgroundColor: '#461E99',
                            padding: '16px 32px',
                            fontSize: '16px',
                        }}
                    >บันทึกข้อมูล</Button>
                    <Button
                        variant="contained"
                        type="button"
                        onClick={() => {
                            navigate('/form');
                        }}
                        fullWidth
                        className='NotoSansThai secondaryButton'
                        sx={{
                            borderRadius: 50,
                            backgroundColor: '#F6F6F6',
                            padding: '16px 32px',
                            fontSize: '16px',
                            color: '#656565',
                            boxShadow: 'unset'
                        }}
                    >แก้ไขข้อมูลอื่นๆ</Button>
                    <Stack sx={{ mx: 3 }} spacing={3} direction={'row'}>
                        <Button
                            variant="contained"
                            type="button"
                            fullWidth
                            className='NotoSansThai secondaryButton'
                            onClick={handleClickOpen}
                            sx={{
                                borderRadius: 50,
                                backgroundColor: '#F6F6F6',
                                padding: '16px 32px',
                                fontSize: '16px',
                                color: '#656565',
                                boxShadow: 'unset'
                            }}
                        >ยกเลิกสมาชิก</Button>
                        <Button
                            variant="contained"
                            type="button"
                            fullWidth
                            className='NotoSansThai secondaryButton'
                            sx={{
                                borderRadius: 50,
                                backgroundColor: '#F6F6F6',
                                padding: '16px 32px',
                                fontSize: '16px',
                                color: '#656565',
                                boxShadow: 'unset'
                            }}
                            onClick={handleLogout}
                        >ออกจากระบบ   </Button>
                    </Stack>
                    <Button
                        variant="text"
                        type="link"
                        fullWidth
                        color="info"
                        size="large"
                        className='NotoSansThai'
                        href="tel:0949244997"
                    >Call center 094-924-4997</Button>

                </Stack>

                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">
                        {"ต้องการลบบัญชีผู้ใช้หรือไม่?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            คุณยืนยันที่จะลบบัญชีของคุณ หรือไม่ หากลบแล้วจะไม่สามารถกู้คืนได้อีกต่อไป และอีเมล์ หรือเบอร์โทรศัพท์นี้จะไม่สามารถใช้งานได้อีกต่อไป
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleClose} color="secondary">
                            ไม่ต้องการลบ
                        </Button>
                        <Button onClick={handleClose} autoFocus color="error">
                            ตกลง
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Snackbar
                    open={snackbar}
                    autoHideDuration={3000}
                    onClose={() => {
                        setSnackBar(false);
                    }}
                    message="บันทึกเสร็จเรียบร้อย"
                />
        </Box>
    );
}