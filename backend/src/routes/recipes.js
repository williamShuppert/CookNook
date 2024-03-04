import { Router } from "express"
import { useDB } from "../middleware/pg.js"
import { validate } from "../middleware/validate.js"
import { requireAuth } from "../middleware/auth.js"
import { createRecipeValidation, deleteRecipeValidation, updateRecipeValidation } from "../validation/recipes.js"
import { createRecipe, deleteRecipe, updateRecipe } from "../controllers/recipes.js"

const router = Router()

router.route('/')
    .post(validate(createRecipeValidation), requireAuth(), useDB(), createRecipe())

router.route('/:id')
    .patch(validate(updateRecipeValidation), requireAuth(), useDB(), deleteRecipe())
    .delete(validate(deleteRecipeValidation), requireAuth(), useDB(), updateRecipe())

export default router