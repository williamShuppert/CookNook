import { Route, Routes } from 'react-router-dom'
import RecipeView from './components/pages/recipe-view'
import RecipeSearch from './components/pages/recipe-search'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<RecipeSearch />} />
        <Route path="/recipes/:id" element={<RecipeView/>} />
        <Route path="*" element="404" />
      </Routes>
    </>
  )
}

export default App
