import { Routes, Route } from "react-router";
import Layout from "./layouts/Layout";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
