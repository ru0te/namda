import { Outlet } from "react-router";
import NavBar from "./NavBar";

export default function Layout() {
  return (
    <div className="container">
      <NavBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
