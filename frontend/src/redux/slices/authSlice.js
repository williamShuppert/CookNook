import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null
    },
    reducers: {
        setUser: (state, action) => { state.user = action.payload },
        removeUser: state => { state.user = false }
    },
})

export const { setUser, removeUser } = authSlice.actions

export default authSlice.reducer

export const selectUser = () => state => state.auth.user