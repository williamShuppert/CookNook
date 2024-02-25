import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem('user'))
    },
    reducers: {
        setUser: (state, action) => { state.user = action.payload },
        removeUser: state => { state.user = false }
    },
})

export const authMiddleware = (store) => (next) => (action) => {
    const result = next(action)

    if (authSlice.actions.setUser.match(action))
        localStorage.setItem('user', JSON.stringify(store.getState().auth))
    else if (authSlice.actions.removeUser.match(action))
        localStorage.removeItem('user')

    return result
}

export const { setUser, removeUser } = authSlice.actions

export default authSlice.reducer

export const selectUser = () => state => state.auth.user