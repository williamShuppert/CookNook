import { Link } from "react-router-dom"
import { useAppSelector } from "../../../redux/hooks"
import { selectRecipes } from "../../../redux/recipesSlice"

const RecipeSearch = () => {
    const recipes = useAppSelector(selectRecipes())
    return (
        <div>
            <h1>Search</h1>
            {recipes.map(r => <Link to={`/recipes/${r.id}`} key={r.id}>{r.name}</Link>)}
        </div>
    )
}

export default RecipeSearch