import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Scan from './pages/Scan';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<Scan />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;