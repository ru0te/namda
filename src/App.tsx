import { Routes, Route } from "react-router";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import BrowsePage from "./pages/BrowsePage";
import TitlePage from "./pages/TitlePage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/browse" element={<BrowsePage />}></Route>
        <Route path="/title/:id" element={<TitlePage />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
