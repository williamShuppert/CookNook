export interface Recipe {
    id: string
    name: string
    servings: number
    author: {
        id: string
        name: string
    }
    likes: number
    bookmarks: number
    ingredients: string[]
    directions: string[]
}