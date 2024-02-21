import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import RecipeViewPage from './components/pages/RecipeViewPage'
import { AnimatePresence, motion } from 'framer-motion'
import SearchPage from './components/pages/SearchPage';
import Counter from './redux/slices/counter/counter';

function App() {
  const location = useLocation();

  return (
    <div className="pages">
      <AnimatePresence initial={false} mode='sync'>
          <Routes location={location} key={location.key}>

            <Route path="/search" element={<SearchPage />} />

            <Route path="/search/:id" element={<RecipeViewPage />} />
            <Route path="/*" element={<Navigate to="/search" replace />} />

            <Route path="/somewhere" element={<motion.div
              style={{height: '200vh'}}
              transition={{ ease: 'easeInOut'}}
              initial={{x: '100%'}}
              animate={{x: 0}}
              exit={{x: '100%', position: 'absolute'}}
            >
              <Link to="/" state={{from: 'somewhere'}}>view recipe</Link><br />
              <Link to="/elsewhere">go elsewhere</Link>
            </motion.div>}/>

            <Route path="/elsewhere" element={<motion.div
              transition={{ ease: 'easeInOut'}}
              initial={{x: '100%'}}
              animate={{x: 0}}
              exit={{x: '100%', position: 'absolute'}}
            >
              <Link to="/" state={{from: 'elsewhere'}}>view recipe</Link><br />
              <Link to="/somewhere">go somewhere</Link>
            </motion.div>}/>

              <Route path='counter' element={<Counter/>} />
          </Routes>
      </AnimatePresence>
    </div>

  )
}

export default App
