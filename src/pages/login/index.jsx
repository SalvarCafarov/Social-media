import { login } from "@/lib/firebase"
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import styles from '@/pages/login/Login.module.scss'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { ArrowRightAltOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import Image from 'next/image';
import Link from "next/link";
import { toast } from "react-toastify";
import Background from "@/components/bacground/background";
export default function Login() {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    async function signIn() {
        let result = await login({ userName, password })
        if (result) {
            router.push('/home');
            window.localStorage.setItem("USER", result)

        }
        else {
            toast('nicname yadaki parol sehvdi!!!', { type: 'error' })

        }
    }
    try {
        // window.localStorage.setItem("USER",'-NUvDgvVZKn7_MX9OqZE')
        var USER = window.localStorage.getItem("USER") || "";
    } catch (error) {
        console.log("sa");
    }
    useEffect(() => {
        if (USER) {
            router.push('/home')
        }
    }, [])
    return (
        <div className={styles.contain}>
            <Background />
            <div className={styles.main}>
                <div className={styles.loginForm}>
                    <h1 className={styles.header}>
                        Logo Here
                    </h1>
                    <h2 className={styles.loginTitle}>
                        Log In
                    </h2>
                    <Box
                        component="form"
                        sx={{
                            marginBottom: '25px',
                            width: '100%',
                            maxWidth: '100%',
                            marginTop: '10px'
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField fullWidth id="outlined-basic fullWidth" label="NickName" variant="outlined" onChange={(e) => {
                            setUserName(e.target.value.toLowerCase())
                        }} />
                    </Box>
                    <FormControl sx={{ m: 0, width: '100%', marginBottom: '15px' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            onChange={(e) => {
                                setPassword(e.target.value)
                                console.log(password)
                            }}
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                    <div className={styles.footerLogin}>
                        <button className={styles.loginBtn} onClick={(e) => {
                            e.preventDefault()
                            signIn()

                        }}>LOGIN IN <ArrowRightAltOutlined /></button>

                        <p className={styles.signUpText}>Don’t have an account yet? <Link href='/signup'>Sign up for free</Link></p>
                    </div>

                </div>
                <div className={styles.right}>
                    <div className={styles.character}>
                        <Image
                            src='/character.png'
                            fill
                            sizes="(max-width: 768px) 100%, (max-width: 1200px) 100%, 100%"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}