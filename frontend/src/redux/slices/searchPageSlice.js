import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import porkBowl from '/pork-bowl.jpg'
import parmesanChickenImage from '/Crispy-Parmesan-chicken.avif'
import pastaParmesanImage from '/Pasta-Parmesan.jpg'
import chickenOrzoImage from '/Winner-winner-chicken-orzo-dinner.avif'
import koreanBeefImage from '/Korean-beef-bibimbap.avif'

const recipesDB = [{
    id: 1,
    name: 'Moo Shu Pork Bowl',
    author: 'Hello Fresh',
    description: 'Lorem ipsum dolor sit amet consectetur. Ipsum sit dolor ac risus duis et ultrices commodo. Proin pharetra eget congue quis nunc eget. Id quis fermentum dolor commodo felis est amet aliquet tellus. Ultricies facilisi at sit at vitae morbi leo elementum. Est ipsum sagittis et vulputate ac vitae vitae etiam et. Sit pulvinar sit nulla netus a scelerisque integer. Enim euismod viverra fermentum tristique eget. Lectus sit at volutpat ut.',
    difficulty: 'easy',
    minutes: 20,
    calories: 750,
    rating: 4.8,
    ratings: 40,
    bookmarks: 28,
    userRating: -1,
    userBookmarked: false,
    image: porkBowl
}, {
    id: 2,
    name: 'Crispy Parmesan Chicken',
    author: 'Hello Fresh',
    description: 'Lorem ipsum dolor sit amet consectetur. Ipsum sit dolor ac risus duis et ultrices commodo. Proin pharetra eget congue quis nunc eget. Id quis fermentum dolor commodo felis est amet aliquet tellus. Ultricies facilisi at sit at vitae morbi leo elementum. Est ipsum sagittis et vulputate ac vitae vitae etiam et. Sit pulvinar sit nulla netus a scelerisque integer. Enim euismod viverra fermentum tristique eget. Lectus sit at volutpat ut.',
    difficulty: 'easy',
    minutes: 20,
    calories: 750,
    rating: 4.6,
    ratings: 40,
    bookmarks: 58,
    userRating: -1,
    userBookmarked: false,
    image: parmesanChickenImage
}, {
    id: 3,
    name: 'Pasta Parmesan',
    author: 'Hello Fresh',
    description: 'Lorem ipsum dolor sit amet consectetur. Ipsum sit dolor ac risus duis et ultrices commodo. Proin pharetra eget congue quis nunc eget. Id quis fermentum dolor commodo felis est amet aliquet tellus. Ultricies facilisi at sit at vitae morbi leo elementum. Est ipsum sagittis et vulputate ac vitae vitae etiam et. Sit pulvinar sit nulla netus a scelerisque integer. Enim euismod viverra fermentum tristique eget. Lectus sit at volutpat ut.',
    difficulty: 'easy',
    minutes: 20,
    calories: 750,
    rating: 4.9,
    ratings: 40,
    bookmarks: 41,
    userRating: -1,
    userBookmarked: false,
    image: pastaParmesanImage
}, {
    id: 4,
    name: 'Winner Winner Chicken Orzo Dinner',
    description: 'Lorem ipsum dolor sit amet consectetur. Ipsum sit dolor ac risus duis et ultrices commodo. Proin pharetra eget congue quis nunc eget. Id quis fermentum dolor commodo felis est amet aliquet tellus. Ultricies facilisi at sit at vitae morbi leo elementum. Est ipsum sagittis et vulputate ac vitae vitae etiam et. Sit pulvinar sit nulla netus a scelerisque integer. Enim euismod viverra fermentum tristique eget. Lectus sit at volutpat ut.',
    author: 'Hello Fresh',
    difficulty: 'medium',
    minutes: 20,
    calories: 750,
    rating: 4.2,
    ratings: 40,
    bookmarks: 36,
    userRating: -1,
    userBookmarked: false,
    image: chickenOrzoImage
}, {
    id: 5,
    name: 'Korean Beef Bibimbap',
    description: 'Lorem ipsum dolor sit amet consectetur. Ipsum sit dolor ac risus duis et ultrices commodo. Proin pharetra eget congue quis nunc eget. Id quis fermentum dolor commodo felis est amet aliquet tellus. Ultricies facilisi at sit at vitae morbi leo elementum. Est ipsum sagittis et vulputate ac vitae vitae etiam et. Sit pulvinar sit nulla netus a scelerisque integer. Enim euismod viverra fermentum tristique eget. Lectus sit at volutpat ut.',
    author: 'Hello Fresh',
    difficulty: 'medium',
    minutes: 20,
    calories: 750,
    rating: 4.2,
    ratings: 40,
    bookmarks: 36,
    userRating: -1,
    userBookmarked: false,
    image: koreanBeefImage
}]

const recipesSlice = createSlice({
    name: 'recipes',
    initialState: {
        data: [],
        status: 'idle',
        error: null
    },
    reducers: {
        recipeUpdated(state, action) {
            const updatedRecipe = action.payload
            const index = state.data.findIndex(recipe => recipe.id == updatedRecipe.id)
            if (index != -1)
                state.data[index] = updatedRecipe
        },
        putRecipe(state, action) {
            const updatedRecipe = action.payload
            const index = state.data.findIndex(recipe => recipe.id == updatedRecipe.id)
            if (index != -1)
                state.data[index] = updatedRecipe
            else
                state.data.push(updatedRecipe)
        }
    },
    extraReducers(builder) {
        builder
            .addCase(api.getRecipeSearch.pending, state => {
                state.status = 'pending'
            })
            .addCase(api.getRecipeSearch.fulfilled, (state, action) => {
                state.status = 'fulfilled'
                state.data = action.payload
            })
            .addCase(api.getRecipeSearch.rejected, state => {
                state.status = 'rejected'
            })
    }
})

export const api = {
    getRecipeSearch: createAsyncThunk('recipes/getRecipeSearch', async () => {
        return recipesDB
    }),
    getRecipe: createAsyncThunk('recipes/getRecipe', async (id) => { // TODO: move into own slice (recipesSlice)
        return recipesDB.find(recipe => recipe.id == id)
    }),
    putRecipe: createAsyncThunk('recipes/putRecipe', async (recipe) => {
        
    })
}

export const { recipeUpdated, putRecipe } = recipesSlice.actions
export default recipesSlice.reducer

export const selectRecipes = state => state.recipes.data
export const selectRecipeById = (id) => state => state.recipes.data.find(recipe => recipe.id == id)
export const selectRecipe = (search) => state => state.recipes.data.find(recipe => search(recipe))
export const selectRecipesStatus = state => state.recipes.status