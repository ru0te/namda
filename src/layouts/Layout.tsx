import { Outlet } from "react-router";
import NavBar from "./NavBar";

export default function Layout() {
  return (
    <div className="container">
      <NavBar />
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </footer>
    </div>
  );
}
