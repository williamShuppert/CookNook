import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counter/counterSlice'
import recipeReducer from './slices/searchPageSlice'
import authReducer from './slices/authSlice'
import { apiSlice } from './slices/apiSlice'

export default configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        recipes: recipeReducer,
        counter: counterReducer,
    },
    middleware: getDefault => getDefault()
        .concat(apiSlice.middleware),
    devTools: true
})