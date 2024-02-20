import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import recipeReducer from '../features/recipes/recipesSlice'

export default configureStore({
    reducer: {
        recipes: recipeReducer,
        counter: counterReducer,
    },
})