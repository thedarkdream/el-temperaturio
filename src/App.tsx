import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import TemperaturePage from './pages/TemperaturePage';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<TemperaturePage />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
