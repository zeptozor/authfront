import { onAuthStateChanged, signInWithCustomToken, signOut } from "firebase/auth"
import { useEffect, useState } from "react"
import { auth } from "./api/firebase"

export default function Home() {
    const [email, setEmail] = useState('')
    const [otp, setOTP] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [error, setError] = useState(false)
    const [authorized, setAuthorized] = useState(false)
    const [validated, setValidated] = useState(false)
    async function authorize() {
        console.log(email)
        await fetch('http://orca-app-r4hba.ondigitalocean.app/api/v1/auth/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ email })
        })
        setAuthorized(true)
    }
    async function validate() {
        const res = await fetch('https://orca-app-r4hba.ondigitalocean.app/api/v1/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://orca-app-r4hba.ondigitalocean.app'
            },
            body: JSON.stringify({ email, otp })
        })
        const data = await res.json()
        await signInWithCustomToken(auth, data.token)
            .then(res => {
                setEmail('')
                console.log(res.user)
                setUserEmail(res.user.email as string)
            })
            .catch(e => {
                setError(true)
                console.log('validate', e)
            })
        setValidated(true)
        setOTP('')
    }
    function logout() {
        signOut(auth)
    }
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setError(false)
            if (user) {
                setUserEmail(user.email as string)
                setAuthorized(true)
                setValidated(true)
                setEmail('')
                setOTP('')
            } else {
                setEmail('')
                setAuthorized(false)
                setValidated(false)
                setOTP('')
            }
        })
    }, [])
    return (
        <div className="w-screen h-screen flex relative items-center justify-center">
            <div className="absolute w-1/3 top-[20px] flex flex-col gap-[5px]">
                {
                    error && <div className="w-full rounded-[10px] bg-[#C43333] p-[12px] text-white">Что-то пошло не так</div>
                }
            </div>
            {
                !validated
                    ?
                    !authorized
                        ?
                        (
                            <div className="w-1/3 flex flex-col gap-[20px] p-[20px] rounded-[10px] bg-[#F6F7F9]">
                                <p className="text-[28px] font-semibold leading-[120%]">Авторизация</p>
                                <input className="outline-none bg-inherit rounded-[10px] p-[10px] border-2 border-[#EEF0F4] focus:border-[#F90] hover:border-[#F90] placeholder:text-black" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <div className="w-full rounded-[10px] bg-[#F90] flex justify-center p-[12px] text-white" onClick={authorize}>Авторизоваться</div>
                            </div>
                        )
                        :
                        (
                            <div className="w-1/3 flex flex-col gap-[20px] p-[20px] rounded-[10px] bg-[#F6F7F9]">
                                <p className="text-[28px] font-semibold leading-[120%]">Введите код, который мы отправили на {email}</p>
                                <input className="outline-none bg-inherit rounded-[10px] p-[10px] border-2 border-[#EEF0F4] focus:border-[#F90] hover:border-[#F90] placeholder:text-black" placeholder="Шестизначный код" type="text" value={otp} onChange={(e) => setOTP(e.target.value)} />
                                <div className="w-full rounded-[10px] bg-[#F90] flex justify-center p-[12px] text-white" onClick={validate}>Подтвердить</div>
                            </div>
                        )
                :
                (
                    <div className="w-1/3 flex flex-col gap-[20px] p-[20px] rounded-[10px] bg-[#F6F7F9]">
                        <p className="text-[28px] font-semibold leading-[120%]">{userEmail}</p>
                        <div className="w-full rounded-[10px] bg-[#F90] flex justify-center p-[12px] text-white" onClick={logout}>Выйти</div>
                    </div>
                )
            }
        </div>
    )
}
