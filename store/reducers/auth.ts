import { createAction, createReducer } from "@reduxjs/toolkit";

interface AuthState {
    email: string
    otp: string
    attempted: boolean
    token: string
}

export interface UserDTO {
    username: string
    firstName: string
    lastName: string
    email: string
}

const initialState: AuthState = {
    email: '',
    otp: '',
    attempted: false,
    token: ''
}

export const changeEmail = createAction<string>('auth/changeEmail')
export const changeOTP = createAction<string>('auth/changeOTP')
export const changeAttempted = createAction<boolean>('auth/changeAttempted')
export const changeToken = createAction<string>('auth/changeToken')

export const authReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(changeEmail, (state, action) => {
            state.email = action.payload
        })
        .addCase(changeOTP, (state, action) => {
            state.otp = action.payload
        })
        .addCase(changeAttempted, (state, action) => {
            state.attempted = action.payload
        })
        .addCase(changeToken, (state, action) => {
            state.token = action.payload
        })
})