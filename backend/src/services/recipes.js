import { v4 as UUID } from 'uuid'
import pg from 'pg'
import PostgresInterval from 'postgres-interval'

/**
 * @param {pg.PoolClient} db
 */
export const RecipesService = (db) => ({
    /**
     * @param {string} authorId 
     * @param {string} name 
     * @param {string} description 
     * @param {string[]} ingredients 
     * @param {string[]} instructions 
     */
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
    },

    /**
     * @param {string} name 
     * @param {string} author 
     * @param {string[]} tags 
     * @param {'all' | 'any'} tagMatch
     * @param {('new' | 'bookmarks' | 'rating' | 'time')[]} order
     * @param {number} page
     * @param {number} limit
     * @returns {{
     *  id: string
     *  name: string
     *  description: string
     *  bookmarks: number
     *  ratings_count: number
     *  ratings_sum: number
     *  prep_time: PostgresInterval.IPostgresInterval
     *  cook_time: PostgresInterval.IPostgresInterval
     *  tags: string[]
     *  ingredients: string[]
     *  instructions: string[]
     *  createdAt: Date
     *  authorName: string
     *  authorId: string
     * }[]}
     */
    search: async (name, author, tags, tagMatch, order, page, limit) => {

        const tagOperators = {
            any: '&&',
            all: '@>'
        }

        const sortClauses = {
            new: 'recipes.created_at DESC',
            rating: 'CASE WHEN ratings_count > 0 THEN ratings_sum / ratings_count ELSE 0 END DESC',
            bookmarks: 'bookmarks DESC',
            time: 'prep_time+cook_time ASC'
        }

        return (await db.dynamicQuery(`
            SELECT
                recipes.recipe_id,
                ARRAY_AGG(tag_name) AS tags,
                recipes.name,
                description,
                prep_time,
                cook_time,
                ratings_count,
                ratings_sum,
                bookmarks,
                ingredients,
                instructions,
                recipes.created_at,
                author_id,
                username AS author_name
            FROM recipes
            JOIN users ON user_id = author_id
            LEFT JOIN recipe_tags AS rt ON rt.recipe_id = recipes.recipe_id
            LEFT JOIN tags ON tags.tag_id = rt.tag_id
            WHERE
                name ILIKE ?
                AND username ILIKE ?
            GROUP BY recipes.recipe_id, username
            ${
                tags.length == 0 ? '' :
                    `HAVING ARRAY_AGG(tags.tag_id) ${tagOperators[tagMatch]} ARRAY[${tags.map(_=>'?').join(',')}]::integer[]`
            }
            ORDER BY
            ${
                order.map(order=>sortClauses[order]).join(',')
            }
            LIMIT ?
            OFFSET ?
        `, [
            `%${name}%`,
            `%${author}%`,
            ...tags,
            limit,
            page * limit
        ])).rows
    }
})