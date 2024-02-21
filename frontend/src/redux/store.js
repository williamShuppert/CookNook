import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counter/counterSlice'
import recipeReducer from './slices/searchPageSlice'

export default configureStore({
    reducer: {
        recipes: recipeReducer,
        counter: counterReducer,
    },
})