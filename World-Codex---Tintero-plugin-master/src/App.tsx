import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { TinteroProvider } from './sdk/sdk-context';
import Dashboard from './pages/Dashboard.tsx';
import EntityPage from './pages/EntityPage';
import ChapterPage from './pages/ChapterPage';
import Sidebar from './components/Sidebar';
import './styles/main.css';

function App() {
  return (
    <TinteroProvider>
      <Router>
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/character/:id" element={<EntityPage type="character" />} />
              <Route path="/worldbuilding/:id" element={<EntityPage type="worldbuilding" />} />
              <Route path="/chapter/:id" element={<ChapterPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </TinteroProvider>
  );
}

export default App;
