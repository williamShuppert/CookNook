import { RecipesService } from "../services/recipes.js"
import { catchAsync } from "../utils/catchAsync.js"
import httpStatus from 'http-status'

export const createRecipe = () => catchAsync(async (req, res) => {
    const recipe_id = await RecipesService(req.db).create({
        author_id: req.user.id,
        ...req.body
    })
    
    res.status(httpStatus.OK).json({recipe_id})
})

export const deleteRecipe = () => catchAsync(async (req, res) => {
    res.sendStatus(httpStatus.NOT_IMPLEMENTED)
})

export const updateRecipe = () => catchAsync(async (req, res) => {
    res.sendStatus(httpStatus.NOT_IMPLEMENTED)
})

export const recipeSearch = () => catchAsync(async (req, res) => {
    let {name, author, tag: tags, tagMatch, order, page, limit} = req.query

    const recipes = await RecipesService(req.db).search(name, author, tags, tagMatch, order, page, limit)

    res.status(httpStatus.OK).json(recipes)
})