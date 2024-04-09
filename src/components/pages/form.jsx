import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { ReactSession } from 'react-client-session';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import FormGroup from '@mui/material/FormGroup';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import { psychiatricTreatmentOption } from '../../configs/app';
import axios from 'axios';
import { apiUrl } from '../../configs/app';
import {
    BrowserRouter as Router,
    useNavigate,
    useLocation
} from "react-router-dom";
import dayjs from 'dayjs';

export const FormPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(ReactSession.get('user'));
    const [selectedAddictions, setSelectedAddictions] = useState([]);
    const [formData, setFormData] = useState({
        firstname: user.firstname,
        lastname: user.lastname,
        occupation: user.occupation,
        birthday: dayjs(user.birthday).format('YYYY-MM-DD'),
        gender: user.gender,
        idcard_number: user.idcard_number,
        current_medicine: user.current_medicine,
        history_treatment_household: user.history_treatment_household,
        history_drug_allergy: user.history_drug_allergy,
        history_food_allergy: user.history_food_allergy,
        emergency_contact: user.emergency_contact,
        contact_relation: user.contact_relation,
        congenital_disease: user.congenital_disease,
        important_symptoms: user.important_symptoms,
        received_treatment: user.received_treatment,
        hospital_treatment: user.hospital_treatment,
        addicted_cigarettes: user.addicted_cigarettes,
        addicted_coffee: user.addicted_coffee,
        addicted_alcohol: user.addicted_alcohol
    });

    useEffect(() => {
        getUserInfo();
    }, []);

    const getUserInfo = async () => {
        let userCurrent = await ReactSession.get('user');
        let userInfo = await axios.get(`${apiUrl}/api/user/${userCurrent.id}`);
        
        setUser(userInfo.data.data);
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // assign 'Y' to each member of selectedAddictions
        let addictions = {
            addicted_cigarettes: false,
            addicted_coffee: false,
            addicted_alcohol: false
        }

        await selectedAddictions.map(addiction => {
            if([addiction][0] == 'addicted_cigarettes'){ 
                addictions.addicted_cigarettes = true;
            }
            if([addiction][0] == 'addicted_coffee'){ 
                addictions.addicted_coffee = true;
            }
            if([addiction][0] == 'addicted_alcohol'){ 
                addictions.addicted_alcohol = true;
            }
        });
        // console.log(formData);
        // return false;
        try{
            let update_data = await axios.post(`${apiUrl}/api/user/treatment-information/${user.id}`, formData)
            await ReactSession.set('user', update_data.data.data);
            if(typeof(location.state) === 'undefined' || location.state === null)  {
                navigate(-1)
            } else {
                navigate('/appointment/' + location.state.sid)
            }
            
        } 
        catch(error){
            console.log(error)
        }
        
    };


    return (
        <Box sx={{ backgroundColor: '#FFF', paddingBottom: '80px' }}>
            <AppBar position="relative" sx={{ backgroundColor: '#FFF', color: '#000', boxShadow: 'unset', paddingTop: '10px' }}>
                <Toolbar>
                    <Typography className='NotoSansThai' component="div" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 600, fontSize: 18 }}>
                        ข้อมูลเพิ่มเติมเพื่อการให้บริการ
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="form"
                autoComplete="off"
                onSubmit={handleSubmit}
                pt={5}
            >
                <Stack sx={{ mx: 3 }} spacing={4}>
                    <TextField
                        label="ชื่อ"
                        name="firstname"
                        variant="standard"
                        value={formData.firstname}
                        className='NotoSansThai'
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="นามสกุล"
                        name="lastname"
                        variant="standard"
                        value={formData.lastname}
                        className='NotoSansThai'
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="อาชีพ"
                        name="occupation"
                        variant="standard"
                        value={formData.occupation}
                        className='NotoSansThai'
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        name="birthday"
                        variant="standard"
                        value={formData.birthday}
                        className='NotoSansThai'
                        onChange={handleChange}
                        type="date"
                        required
                        helperText="วันเดือนปีเกิด (dd/mm/yyyy)"
                    />
                    <TextField
                        label="เลขประจำตัวประชาชน"
                        name="idcard_number"
                        variant="standard"
                        className='NotoSansThai'
                        inputProps={{ minLength: 13, maxLength: 13, pattern: "[0-9]{13}" }}
                        value={formData.idcard_number}
                        onChange={handleChange}
                        type="tel"
                        required
                        helperText="เลขประจำตัวประชาชนต้องประกอบด้วย 13 หลัก"
                    />
                    <FormControl>
                        <FormLabel id="radio-buttons-group-label">เพศ</FormLabel>
                        <RadioGroup
                            row
                            required
                            variant="standard"
                            className='NotoSansThai'
                            aria-labelledby="radio-buttons-group-label"
                            sx={{ paddingBottom: 2}}
                            onChange={handleChange}
                        >
                            <FormControlLabel name="gender" value="female" control={<Radio checked={formData.gender==='female'}/>} 
                            label="หญิง" sx={{margin: '10px 4px 4px 0px'}}/>
                            <FormControlLabel name="gender" value="male" control={<Radio checked={formData.gender==='male'}/>} 
                            label="ชาย" sx={{margin: '10px 4px 4px 10px'}}/>
                        </RadioGroup>
                    </FormControl>

                    {/* Section Title */}
                    <h2 className='NotoSansThai'>ประวัติการรักษา</h2>
                    <FormControl fullWidth>
                        <InputLabel id="psychiatricTreatment-label">เคยรักษาทางจิตเวชมาก่อนหรือไม่?</InputLabel>
                        <Select
                            labelId="psychiatricTreatment-label"
                            id="psychiatricTreatment"
                            value={formData.received_treatment}
                            label="เคยรักษาทางจิตเวชมาก่อนหรือไม่?"
                            required
                            variant='standard'
                            className='NotoSansThai'
                            defaultValue={formData.received_treatment}
                            onChange={(e) => setFormData({...formData, received_treatment: e.target.value})}
                        >
                            {psychiatricTreatmentOption.map((item) => (
                                <MenuItem key={item} value={item}
                                style={{fontFamily: "Noto Sans Thai",
                                display: 'block', padding: 10}}
                                >{item}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {formData.received_treatment === 'ใช่' && (
                        <TextField
                            label="โรงพยาบาล/สถานที่รักษา"
                            name="hospital_treatment"
                            variant='standard'
                            className='NotoSansThai'
                            value={formData.hospital_treatment}
                            onChange={handleChange}
                            required
                        />
                    )}
                    <TextField
                        label="ยาที่ใช้อยู่ ณ ปัจจุบัน"
                        name="current_medicine"
                        variant="standard"
                        required
                        value={formData.current_medicine}
                        onChange={handleChange}
                        className='NotoSansThai'
                        multiline
                        minRows={2}
                        helperText="ถ้าไม่มีให้ใส่ว่า ไม่มี"
                    />
                    <TextField
                        label="ประวัติการรักษาทางสุขภาพจิต ของคนในครอบครัว"
                        name="history_treatment_household"
                        variant="standard"
                        value={formData.history_treatment_household}
                        onChange={handleChange}
                        className='NotoSansThai'
                        multiline
                        required
                        minRows={2}
                        helperText="ถ้าไม่มีให้ใส่ว่า ไม่มี"
                    />

                    {/* Section Title */}
                    <h2 className='NotoSansThai'>ประวัติการแพ้</h2>

                    <TextField
                        label="ประวัติการแพ้ยา"
                        name="history_drug_allergy"
                        variant="standard"
                        value={formData.history_drug_allergy}
                        onChange={handleChange}
                        className='NotoSansThai'
                        multiline
                        minRows={2}
                        required
                        helperText="ถ้าไม่มีให้ใส่ว่า ไม่มี"
                    />
                    <TextField
                        label="ประวัติการแพ้อาหาร"
                        name="history_food_allergy"
                        variant="standard"
                        value={formData.history_food_allergy}
                        onChange={handleChange}
                        className='NotoSansThai'
                        required
                        multiline
                        minRows={2}
                        helperText="ถ้าไม่มีให้ใส่ว่า ไม่มี"
                    />

                    {/* Section Title */}
                    <h2 className='NotoSansThai'>ข้อมูลฉุกเฉิน</h2>

                    <TextField
                        label="เบอร์โทร บุคคลติดต่อกรณีฉุกเฉิน"
                        name="emergency_contact"
                        variant="standard"
                        value={formData.emergency_contact}
                        type="tel"
                        inputProps={{ maxLength: 10, pattern: "[0-9]{10}" }}
                        className='NotoSansThai'
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="ความสัมพันธ์ บุคคลติดต่อกรณีฉุกเฉิน"
                        name="contact_relation"
                        variant="standard"
                        value={formData.contact_relation}
                        className='NotoSansThai'
                        onChange={handleChange}
                        required
                    />

                    {/* Section Title */}
                    <h2 className='NotoSansThai'>ข้อมูลสุขภาพ</h2>

                    <TextField
                        label="โรคประจำตัว"
                        name="congenital_disease"
                        variant="standard"
                        value={formData.congenital_disease}
                        onChange={handleChange}
                        className='NotoSansThai'
                        multiline
                        minRows={2}
                        required
                        helperText="ถ้าไม่มีให้ใส่ว่า ไม่มี"
                    />
                    <TextField
                        label="อาการสำคัญ ที่ต้องการปรึกษา"
                        name="important_symptoms"
                        variant="standard"
                        value={formData.important_symptoms}
                        className='NotoSansThai'
                        onChange={handleChange}
                        multiline
                        minRows={2}
                        required
                        helperText="บอกอาการคร่าวๆ ที่ต้องการปรึกษา"
                    />

                    {/* Section Title */}
                    
                    <FormControl fullWidth marginTop={20} style={{marginBottom: "30px"}}>
                        <InputLabel>ประวัติการเสพติด</InputLabel>
                    </FormControl>
                    <FormGroup
                    onChange={(e) => {
                    let isCheck = !formData[e.target.name] ? true : false;
                    setFormData({ ...formData, [e.target.name]: isCheck });
                    }} name="addictions">
                        <FormControlLabel control={<Checkbox checked={formData.addicted_coffee} style={{width: '45px', height: '45px'}}/>} name="addicted_coffee" value="addicted_coffee" label="กาแฟ" />
                        <FormControlLabel control={<Checkbox checked={formData.addicted_alcohol} style={{width: '45px', height: '45px'}}/>} name="addicted_alcohol" value="addicted_alcohol" label="บุหรี่" />
                        <FormControlLabel control={<Checkbox checked={formData.addicted_cigarettes} style={{width: '45px', height: '45px'}}/>} name="addicted_cigarettes" value="addicted_cigarettes" label="แอลกอฮอล์" />
                    </FormGroup>
                    
                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        className='NotoSansThai'
                        style={{
                            borderRadius: 50,
                            backgroundColor: '#461E99',
                            color: '#ffffff',
                            padding: '16px 32px',
                            fontSize: '16px',
                            marginTop: '40px',
                        }}>
                        บันทึก
                    </Button>
                    <Button
                        variant="contained"
                        type="button"
                        fullWidth
                        className='NotoSansThai secondaryButton'
                        onClick={() => navigate('/home')}
                        style={{
                            borderRadius: 50,
                            backgroundColor: '#F6F6F6',
                            padding: '16px 32px',
                            fontSize: '16px',
                            color: '#656565',
                            boxShadow: 'unset',
                            marginTop: '20px'
                        }}>ย้อนกลับ</Button>
                </Stack>
            </Box>
        </Box>

    )
}
