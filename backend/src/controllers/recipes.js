import { RecipesService } from "../services/recipes.js"
import { catchAsync } from "../utils/catchAsync.js"
import httpStatus from 'http-status'

export const createRecipe = () => catchAsync(async (req, res) => {
    const {name, description, ingredients, instructions} = req.body

    await RecipesService(req.db).create(req.user.id, name, description, ingredients, instructions)
    
    res.sendStatus(httpStatus.OK)
})

export const deleteRecipe = () => catchAsync(async (req, res) => {
    res.sendStatus(httpStatus.NOT_IMPLEMENTED)
})

export const updateRecipe = () => catchAsync(async (req, res) => {
    res.sendStatus(httpStatus.NOT_IMPLEMENTED)
})