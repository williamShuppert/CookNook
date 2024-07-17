export interface Recipe {
    id: string
    name: string
    servings: number
    rating: number
    bookmarks: number
    imageSrc: string
    author: {
        id: string
        name: string
    }
    ingredients: string[]
    directions: string[]
}