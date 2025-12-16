import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@Pages/Dashboard";

function App() {
  return (
    <div className="h-full w-full">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
