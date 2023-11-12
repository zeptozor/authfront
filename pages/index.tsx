import { signInWithCustomToken, signOut } from "firebase/auth"
import { auth } from "./api/firebase"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { changeAttempted, changeEmail, changeOTP, changeToken } from "@/store/reducers/auth"

export default function Home() {
    const dispatch = useAppDispatch()
    const { email, otp, attempted, token } = useAppSelector(store => store.auth)
    async function authorize() {
        await fetch('/api/v1/auth/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        })
        dispatch(changeAttempted(true))
    }
    async function validate() {
        const res = await fetch('/api/v1/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp })
        })
        const data = await res.json()
        await signInWithCustomToken(auth, data.token)
            .then(async res => {
                dispatch(changeToken(await res.user.getIdToken()))
            })
            .catch(e => {
                dispatch(changeToken(''))
                console.log('validate', e)
            })
    }
    async function userInfo() {
        const res = await fetch('/api/v1/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        console.log('userInfo', await res.json())
    }
    async function logout() {
        await signOut(auth)
    }
    return (
        <div className="w-screen h-screen flex relative items-center justify-center">
            {
                token == ''
                    ?
                    !attempted
                        ?
                        (
                            <div className="w-1/3 flex flex-col gap-[20px] p-[20px] rounded-[10px] bg-[#F6F7F9]">
                                <p className="text-[28px] font-semibold leading-[120%]">Авторизация</p>
                                <input className="outline-none bg-inherit rounded-[10px] p-[10px] border-2 border-[#EEF0F4] focus:border-[#F90] hover:border-[#F90] placeholder:text-black" placeholder="Email" type="email" value={email} onChange={(e) => dispatch(changeEmail(e.target.value))} />
                                <div className="w-full rounded-[10px] bg-[#F90] flex justify-center p-[12px] text-white" onClick={authorize}>Авторизоваться</div>
                            </div>
                        )
                        :
                        (
                            <div className="w-1/3 flex flex-col gap-[20px] p-[20px] rounded-[10px] bg-[#F6F7F9]">
                                <p className="text-[28px] font-semibold leading-[120%]">Введите код, который мы отправили на {email}</p>
                                <input className="outline-none bg-inherit rounded-[10px] p-[10px] border-2 border-[#EEF0F4] focus:border-[#F90] hover:border-[#F90] placeholder:text-black" placeholder="Шестизначный код" type="text" value={otp} onChange={(e) => dispatch(changeOTP(e.target.value))} />
                                <div className="w-full rounded-[10px] bg-[#F90] flex justify-center p-[12px] text-white" onClick={validate}>Подтвердить</div>
                            </div>
                        )
                :
                (
                    <div className="w-1/3 flex flex-col gap-[20px] p-[20px] rounded-[10px] bg-[#F6F7F9]">
                        <p className="text-[28px] font-semibold leading-[120%]" onClick={userInfo}>fetch user data</p>
                        <div className="w-full rounded-[10px] bg-[#F90] flex justify-center p-[12px] text-white" onClick={logout}>Выйти</div>
                    </div>
                )
            }
        </div>
    )
}