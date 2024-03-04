import { v4 as UUID } from 'uuid'

export const RecipesService = (db) => ({
    create: async (authorId, name, description, ingredients, instructions) => {
        const id = UUID()
        await db.query('INSERT INTO recipes (recipe_id, author_id, name, description, ingredients, instructions) VALUES ($1,$2,$3,$4,$5,$6)', [
            id,
            authorId,
            name,
            description,
            ingredients,
            instructions
        ])
    }
})