import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Recipe } from "../interfaces/recipe";
import { RootState } from "./store";
import recipeImage from '/../frontend/public/Cheesy-Spinach-Panini.jpeg'

export interface RecipesState {
    data: Recipe[]
}

const initialState: RecipesState = {
    data: [{
        id: '0',
        name: 'Cheesy Spinach Panini',
        rating: 4,
        bookmarks: 5,
        imageSrc: recipeImage,
        author: {
            id: '0',
            name: 'Hello Fresh'
        },
        servings: 2,
        ingredients: ["1 tsp dried oregano", "1 clove garlic", "1 lemon", "1 tomato", "4 tbsp mayonnaise", "2 tsp Dijon mustard", "2.5 ounce spinach", "2 tbsp cream cheese", "4 slice sourdough bread", "1/2 cup feta cheese", "1/2 cup mozzarella", "2 tsp cooking oil", "1/4 tsp sugar", "2 tbsp butter", "salt and pepper"],
        directions: ["Peel and mince or grate garlic. Quarter lemon. Thinly slice tomato into rounds and season with salt and pepper.", "In a small bowl, combine mayonnaise, mustard, 1/4 tsp sugar, juice from one lemon wedge, and a pinch of garlic. Season with salt and pepper to taste.", "Heat a drizzle of oil in a large pan over medium-high heat. Add spinach and remaining garlic; season with salt and pepper. Cook, stirring, until spinach is wilted, 2-3 minutes. Transfer spinach to a second small bowl; stir in cream cheese until combined. Turn off heat. Wipe out pan.", "Spread half the sourdough slices with creamy spinach; top with even layers of feta, mozzarella, and tomato. Spread remaining sourdough slices with Dijonnaise (save some for serving). Close sandwiches.", "Melt 1 tbsp butter in pan used for spinach over medium heat. Once hot, add sandwiches and push around in pan until melted butter has absorbed. Cook until bread is golden brown and cheese is slightly melted, 5-6 minutes. Add another 1 tbsp butter to pan, then flip sandwiches and push around again until melted butter has absorbed. Cook until bread is golden brown and cheese is fully melted, 4-6 minutes."]
    }]
}

const recipesSlice = createSlice({
    name: 'recipes',
    initialState,
    reducers: {
        putRecipe: (state, action: PayloadAction<Recipe>) => {
            const i = state.data.findIndex(r => r.id == action.payload.id)
            if (i != -1) state.data[i] = action.payload
            else state.data.push(action.payload)
        },
        deleteRecipe: (state, action: PayloadAction<string>) => {
            state.data.filter(r => r.id == action.payload)
        }
    }
})

export const { putRecipe, deleteRecipe } = recipesSlice.actions

export default recipesSlice.reducer

export const selectRecipe = (id: string) => (state: RootState) => state.recipes.data.find((r: Recipe) => r.id == id)
