
import React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import {
    useLocation
} from "react-router-dom";
import axios from 'axios';
import { apiUrl } from '../../configs/app';
import { useNavigate } from 'react-router-dom';



export function QuestionPage() {
    const location = useLocation();
    const [rating_star, setRatingStar] = React.useState(0);
    const [rating1, setRating1] = React.useState(0);
    const [rating2, setRating2] = React.useState(0);
    const [buttonStatus, setButtonStatus] = React.useState(0);
    const [ratingtext, setRatingtext] = React.useState("");
    const navigate = useNavigate();
    const labels = {
        0.5: 'ควรปรับปรุง',
        1: 'ควรปรับปรุง',
        1.5: 'พอใช้',
        2: 'พอใช้',
        2.5: 'ปานกลาง',
        3: 'ปานกลาง',
        3.5: 'ดี',
        4: 'ดี',
        4.5: 'ยอดเยี่ยม',
        5: 'ยอดเยี่ยม',
    };
    
    const [value, setValue] = React.useState(0);
    
    const [hover, setHover] = React.useState(-1);

    const handleSubmit = async () => {
        console.log(rating_star, rating1, rating2, ratingtext);
        
        if(rating_star == 0||rating1 == 0||rating2 == 0){
            alert("กรุณาใส่คะแนนประเมิน")
        }
        else{
            try{
                setButtonStatus(1);
                let data = {
                    overall_score: rating_star,
                    q1: rating1,
                    q2: rating2,
                    additional_comments: ratingtext,
                    appointment_id: location.state.bookingId
                }
                await axios.post(apiUrl + '/api/evaluation', data);
                localStorage.setItem('current_meet', '');
                alert("ส่งคะแนนเรียบร้อย")
                navigate('/home')
            } catch (error) {
                console.error(error);
                setButtonStatus(0);
            }
        }
    }
    
    return (
        <Box sx={{backgroundColor:'#FFF',paddingBottom:'80px'}}>
            <AppBar position="relative" sx={{backgroundColor:'#FFF',color:'#000',boxShadow:'unset',paddingTop:'10px'}}>
                <Toolbar>
                    <Typography  className='NotoSansThai' component="div" sx={{ flexGrow: 1,textAlign:'center',fontWeight:600,fontSize:18 }}>
                    เสร็จสิ้นการใช้บริการ
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box p={2} >
                <Box sx={{px:2,pt:1,pb:1,backgroundColor:'#F6F6F6',borderRadius:'20px'}} mb={3} >

                    <Stack spacing={2}  direction="row" alignItems="center">
                        <Avatar
                            src={location.state.consultProfile}
                            sx={{ width: 64, height: 64 }}
                        />
                        <div>
                            <Typography  className='NotoSansThai' mb={1}  component="div"  sx={{ fontWeight:600,fontSize:16,color:'#2C2C2C' }}>
                                {location.state.consult}
                            </Typography>
                        </div>
                    </Stack>
                    
                </Box>

                <Typography  className='NotoSansThai' mb={2} component="div" sx={{textAlign:'center',color:'#2C2C2C' }}>
                    ให้คะแนนความพึงพอใจโดยรวม
                </Typography>
                <Stack spacing={2}  justifyContent={'center'} direction={'row'}>
                    <Rating
                        name="simple-controlled"
                        value={rating_star}
                        onChange={(event, newValue) => {
                            setRatingStar(newValue);
                          }}
                        onChangeActive={(event, newHover) => {
                            setHover(newHover);
                        }}
                        size="large"
                        
                    />
                </Stack>
                {value !== null && (
                    <Box mt={1} sx={{ textAlign:'center',color:'#F3B85D' }}>{labels[hover !== -1 ? hover : value]}</Box>
                )}
                <Box my={3} px={2}>
                    <FormControl>
                        <FormLabel  className='NotoSansThai' >ความพึงพอใจต่อ SynZ Application *</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="0"
                            required={1}
                            name="satisfactionApp"
                            onChange={(e) => setRating1(e.target.value)}
                            
                        >
                            <FormControlLabel  value="1" control={<Radio />} label="ควรปรับปรุง" />
                            <FormControlLabel value="2" control={<Radio />} label="พอใช้" />
                            <FormControlLabel value="3" control={<Radio />} label="ปานกลาง" />
                            <FormControlLabel value="4" control={<Radio />} label="ดี" />
                            <FormControlLabel value="5" control={<Radio />} label="ดีเยี่ยม" />
                        </RadioGroup>
                    </FormControl>
                
                </Box>

                <Box my={3} px={2}>
                    <FormControl>
                        <FormLabel className='NotoSansThai'>ท่านมีความพึงพอใจที่องค์กร จัดให้มีบริการให้คำปรึกษาสุขภาพใจออนไลน์สำหรับผู้ปฏิบัติงานที่ระดับใด*</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="0"
                            required={1}
                            name="satisfactionService"
                            onChange={e => setRating2(e.target.value)}
                        >
                            <FormControlLabel value="1" control={<Radio />} label="ควรปรับปรุง" />
                            <FormControlLabel value="2" control={<Radio />} label="พอใช้" />
                            <FormControlLabel value="3" control={<Radio />} label="ปานกลาง" />
                            <FormControlLabel value="4" control={<Radio />} label="ดี" />
                            <FormControlLabel value="5" control={<Radio />} label="ดีเยี่ยม" />
                        </RadioGroup>
                    </FormControl>


                    <TextField
                    id=""
                    label="ความคิดเห็นเพิ่มเติม"
                    variant="standard"
                    value={ratingtext}
                    onChange={(e) => setRatingtext(e.target.value)}
                    fullWidth
                    />
                
                </Box>

                <Stack spacing={2} mt={4} textAlign={'center'} justifyContent={'center'}>
                    <Button 
                    variant="contained"  
                    className='NotoSansThai'
                    type="submit"
                    disabled={buttonStatus}
                    onClick={handleSubmit}
                    sx={{ 
                        borderRadius: 50 ,
                        backgroundColor:'#461E99',
                        padding:'10px 32px',
                        fontSize:'16px',
                    }}
                    >ส่งแบบประเมิน</Button>
                </Stack>



                
            </Box>

 
        </Box>
    );
}