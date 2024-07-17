import { configureStore } from '@reduxjs/toolkit'
import recipesReducer from './recipesSlice'

export const store = configureStore({
    reducer: {
        recipes: recipesReducer
    },
    middleware: getDefault => getDefault(),
    devTools: true
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch