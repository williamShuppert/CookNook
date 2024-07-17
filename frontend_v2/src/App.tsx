import { Route, Routes } from 'react-router-dom'
import RecipeView from './components/pages/recipe-view'

function App() {
  return (
    <>
      <Routes>
        <Route path="/recipes/:id" element={<RecipeView/>} />
        <Route path="*" element="404" />
      </Routes>
    </>
  )
}

export default App
