import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from './Auth'
import { useNavigate } from 'react-router-dom'
import { firestore, auth } from '../database/firebase'
import { useForm } from 'react-hook-form'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import background from '../images/background.jpg'
import './SignIn.css'

export default function SignIn() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [switchMode, setSwitchMode] = useState(false)
    const [loading, setLoading] = useState(false)

    const user = useContext(AuthContext)
    const navigate = useNavigate()
    const { handleSubmit, register, formState: { errors }, watch, reset } = useForm()

    useEffect(() => {
        if (user) navigate("/")
    }, [user, navigate])
    
    const emailSignUp = () => {
        setLoading(true)
        auth.createUserWithEmailAndPassword(email, password)
        .then(async (result) => {
            if (result) {
                const userRef = firestore.collection("users").doc(result.user.uid)
                const doc = await userRef.get()
                if (!doc.data()) {
                    await userRef.set({
                        uid: result.user.uid,
                        email: result.user.email,
                        displayName: result.user.email.substring(0, email.lastIndexOf("@")),
                        image: "",
                        role: "user"
                    })
                }
            }
        })
        .catch((error) => {
            setMessage(error.code)
            setLoading(false)
        })
    }

    const emailSignIn = () => {
        setLoading(true)
        auth.signInWithEmailAndPassword(email, password)
        .then(() => {

        })
        .catch((error) => {
            setMessage(error.code)
            setLoading(false)
        })
    }

    const switchModeForm = () => {
        setSwitchMode(!switchMode)
        setEmail("")
        setPassword("")
        reset()
    }

    return (
        <div className="SignIn" style={{ backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <Backdrop
                sx={{ color: '#3098d9', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {switchMode ?
            <form onSubmit={handleSubmit(emailSignUp)}>
                <h2>Sign up</h2>
                <label>Email</label>
                <input type="text" placeholder="Enter email" name="emailSignUp"
                    {...register("emailSignUp", {
                        required: "กรุณากรอกอีเมล",
                        pattern: { value: /^\S+@\S+\.\S+$/, message: "รูปแบบอีเมลไม่ถูกต้อง" },
                        minLength: { value: 6, message: "ความยาวระหว่าง 6 ถึง 30 ตัวอักษร" },
                        maxLength: { value: 30, message: "ความยาวระหว่าง 6 ถึง 30 ตัวอักษร" },
                        onChange: (e) => setEmail(e.target.value)
                    })}
                    value={email}
                />
                <p>{message === "auth/email-already-in-use" ? "อีเมลนี้ถูกใช้แล้ว" : ""}</p>
                <p>{errors.emailSignUp && errors.emailSignUp.message}</p>
                <label>Password</label>
                <input type="password" placeholder="Enter password" name="passwordSignUp"
                    {...register("passwordSignUp", {
                        required: "กรุณากรอกรหัสผ่าน",
                        minLength: { value: 8, message: "ความยาวระหว่าง 8 ถึง 16 ตัวอักษร" },
                        maxLength: { value: 16, message: "ความยาวระหว่าง 8 ถึง 16 ตัวอักษร" },
                        onChange: (e) => setPassword(e.target.value)
                    })}
                    value={password}
                />
                <p>{errors.passwordSignUp && errors.passwordSignUp.message}</p>
                <label>Confirm password</label>
                <input type="password" placeholder="Confirm password" name="confirmPasswordSignUp"
                    {...register("confirmPasswordSignUp", {
                        required: "กรุณายืนยันรหัสผ่าน",
                        validate: value => value === watch("passwordSignUp") || "รหัสผ่านไม่ตรงกัน"
                    })}
                />
                <p>{errors.confirmPasswordSignUp && errors.confirmPasswordSignUp.message}</p>
                <button className="button--blue" type="submit">Sign up</button>
                <label>OR</label>
                <h3 onClick={switchModeForm}>Sign in</h3>
            </form>
            :
            <form onSubmit={handleSubmit(emailSignIn)}>
                <h2>Sign in</h2>
                <label>Email</label>
                <input type="text" placeholder="Enter email" name="emailSignIn"
                    {...register("emailSignIn", {
                        required: "กรุณากรอกอีเมล",
                        pattern: { value: /^\S+@\S+\.\S+$/, message: "รูปแบบอีเมลไม่ถูกต้อง" },
                        minLength: { value: 6, message: "ความยาวระหว่าง 6 ถึง 30 ตัวอักษร" },
                        maxLength: { value: 30, message: "ความยาวระหว่าง 6 ถึง 30 ตัวอักษร" },
                        onChange: (e) => setEmail(e.target.value)
                    })}
                    value={email}
                />
                <p>{message === "auth/user-not-found" ? "ไม่พบผู้ใช้" : ""}</p>
                <p>{errors.emailSignIn && errors.emailSignIn.message}</p>
                <label>Password</label>
                <input type="password" placeholder="Enter password" name="passwordSignIn"
                    {...register("passwordSignIn", {
                        required: "กรุณากรอกรหัสผ่าน",
                        minLength: { value: 8, message: "ความยาวระหว่าง 8 ถึง 16 ตัวอักษร" },
                        maxLength: { value: 16, message: "ความยาวระหว่าง 8 ถึง 16 ตัวอักษร" },
                        onChange: (e) => setPassword(e.target.value)
                    })}
                    value={password}
                />
                <p>{message === "auth/wrong-password" ? "รหัสผ่านไม่ถูกต้อง" : ""}</p>
                <p>{errors.passwordSignIn && errors.passwordSignIn.message}</p>
                <button className="button--blue" type="submit">Sign in</button>
                <label>OR</label>
                <h3 onClick={switchModeForm}>Sign up</h3>
            </form>}
        </div>
    )
}
