import { BrowserRouter, Routes, Route } from "react-router-dom";
import ApplicationListPage from "./pages/ApplicationListPage";
import AddApplicationPage from "./pages/AddApplicationPage";
import EditApplicationPage from "./pages/EditApplicationPage";
import ViewApplicationPage from "./pages/ViewApplicationPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ApplicationListPage />} />
        <Route path="/add" element={<AddApplicationPage />} />
        <Route path="/edit/:id" element={<EditApplicationPage />} />
        <Route path="/view/:id" element={<ViewApplicationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;