import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegexBuilder from './widgets/regex-builder';
import Dashboard from './components/pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/regex-builder" element={<RegexBuilder />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App