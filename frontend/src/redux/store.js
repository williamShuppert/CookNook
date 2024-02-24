import { configureStore } from '@reduxjs/toolkit'
import recipeReducer from './slices/searchPageSlice'
import authReducer from './slices/authSlice'
import { apiSlice } from './slices/apiSlice'

export default configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        recipes: recipeReducer,
    },
    middleware: getDefault => getDefault()
        .concat(apiSlice.middleware),
    devTools: true
})