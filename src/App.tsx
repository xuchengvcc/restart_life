import { Routes, Route } from 'react-router-dom'
import { Home } from '@pages/Home'
import { Game } from '@pages/Game'
import { About } from '@pages/About'
import { Layout } from '@components/Layout'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  )
}

export default App 