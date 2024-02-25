import { configureStore } from '@reduxjs/toolkit'
import recipeReducer from './slices/searchPageSlice'
import authReducer, { authMiddleware } from './slices/authSlice'
import { apiSlice } from './slices/apiSlice'

export default configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        recipes: recipeReducer,
    },
    middleware: getDefault => getDefault()
        .concat(apiSlice.middleware)
        .concat(authMiddleware),
    devTools: true
})