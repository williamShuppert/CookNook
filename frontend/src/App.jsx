import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import RecipeViewPage from './components/pages/RecipeViewPage'
import { AnimatePresence } from 'framer-motion'
import SearchPage from './components/pages/SearchPage';
import AuthPage from './components/pages/AuthPage';
import RequireAuth from './components/common/RequireAuth';

function App() {
  const location = useLocation();

  return (
    <div className="pages">
      <AnimatePresence initial={false} mode='sync'>
          <Routes location={location} key={location.key}>

            <Route path="/auth" element={<AuthPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/search/:id" element={<RecipeViewPage />} />

            <Route element={<RequireAuth />}>
              <Route path="/protected" element={<span>protected</span>} />
            </Route>

            <Route path="/*" element={<Navigate to="/search" replace />} />

          </Routes>
      </AnimatePresence>
    </div>

  )
}

export default App
