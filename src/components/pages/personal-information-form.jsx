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
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import { psychiatricTreatmentOption, addicOption } from '../../configs/app';
import CancelIcon from "@mui/icons-material/Cancel";
import axios from 'axios';
import { apiUrl, app_name } from '../../configs/app';
import Snackbar from '@mui/material/Snackbar';
import {
    BrowserRouter as Router,
    useNavigate,
    useLocation
} from "react-router-dom";

export const PersonalInformationForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(ReactSession.get('user'));
    const [selectedAddictions, setSelectedAddictions] = useState([]);
    const [formData, setFormData] = useState({
        firstname: user.firstname,
        lastname: user.lastname,
        occupation: user.occupation,
        birthday: user.birthday,
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
        addicted_coffee: user.addicted_coffe,
        addicted_alcohol: user.addicted_alcohol
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // TODO: บันทึกข้อมูลและทำการนัดหมายแพทย์
        
        // assign 'Y' to each member of selectedAddictions
        const addictions = selectedAddictions.map(addiction => ({ [addiction]: true }));
        // merge value of addictions with formData
        await setFormData( { ...formData, ...Object.assign({}, ...addictions) } )

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
                        label="วัน/เดือน/ปีเกิด"
                        name="birthday"
                        variant="standard"
                        value={formData.birthday}
                        className='NotoSansThai'
                        onChange={handleChange}
                        type="date"
                        required
                    />
                    <TextField
                        label="เลขประจำตัวประชาชน"
                        name="idcard_number"
                        variant="standard"
                        className='NotoSansThai'
                        inputProps={{ maxLength: 13, pattern: "[0-9]{13}" }}
                        value={formData.idcard_number}
                        onChange={handleChange}
                        type="tel"
                        required
                    />

                    {/* Section Title */}
                    <h2 className='NotoSansThai'>ประวัติการรักษา</h2>
                    <FormControl fullWidth>
                        <InputLabel id="psychiatricTreatment-label">เคยรักษาทางจิตเวชมาก่อนหรือไม่?</InputLabel>
                        <Select
                            labelId="psychiatricTreatment-label"
                            id="psychiatricTreatment"
                            value={formData.received_treatment}
                            label="เคยรักษาทางจิตเวชมาก่อนหรือไม่?"
                            required={true}
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
                        value={formData.current_medicine}
                        onChange={handleChange}
                        className='NotoSansThai'
                        multiline
                        minRows={2}
                    />
                    <TextField
                        label="ประวัติการรักษาทางสุขภาพจิต ของคนในครอบครัว"
                        name="history_treatment_household"
                        variant="standard"
                        value={formData.history_treatment_household}
                        onChange={handleChange}
                        className='NotoSansThai'
                        multiline
                        minRows={2}
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
                    />
                    <TextField
                        label="ประวัติการแพ้อาหาร"
                        name="history_food_allergy"
                        variant="standard"
                        value={formData.history_food_allergy}
                        onChange={handleChange}
                        className='NotoSansThai'
                        multiline
                        minRows={2}
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
                    />

                    {/* Section Title */}
                    
                    <FormControl fullWidth margintop={20}>
                        <InputLabel>ประวัติการเสพติด</InputLabel>
                        <Select
                            value={selectedAddictions}
                            label="ประวัติการเสพติด *"
                            multiple
                            required={true}
                            variant='standard'
                            className='NotoSansThai'
                            style={{
                                borderBottom: "1px solid rgba(0, 0, 0, 0.43)",
                                padding: "10px",
                                outline: 0,
                                borderWidth: "0 0 1px 0",
                                borderRadius: 0
                            }}
                            defaultValue={selectedAddictions}
                            onChange={(e) => setSelectedAddictions(e.target.value)}
                            input={<OutlinedInput label="ประวัติการเสพติด *" variant='standard' className='NotoSansThai' />}
                            renderValue={(selected) => (
                                <Stack gap={1} direction="row" flexWrap="wrap">
                                    {selected.map((value) => (
                                        <Chip
                                            key={value}
                                            label={value}
                                            onDelete={() =>
                                                setSelectedAddictions(
                                                    selectedAddictions.filter((item) => item !== value)
                                                )
                                            }
                                            deleteIcon={
                                                <CancelIcon
                                                    onMouseDown={(event) => event.stopPropagation()}
                                                />
                                            }
                                        />
                                    ))}
                                </Stack>
                            )}
                        >
                                <MenuItem key="addicted_cigarettes" value="addicted_cigarettes"
                                style={{fontFamily: "Noto Sans Thai",
                                display: 'block', padding: 10}}>บุหรี่</MenuItem>
                                <MenuItem key="addicted_coffee" value="addicted_coffee"
                                style={{fontFamily: "Noto Sans Thai",
                                display: 'block', padding: 10}}>กาแฟ</MenuItem>
                                <MenuItem key="addicted_alcohol" value="addicted_alcohol"
                                style={{fontFamily: "Noto Sans Thai",
                                display: 'block', padding: 10}}>แอลกอฮอล์</MenuItem>

                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        type="button"
                        fullWidth
                        className='NotoSansThai'
                        onClick={handleSubmit}
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
