import Logo from ".././assets/main-logo.svg";
import { NavLink } from "react-router";

function NavBar() {
  return (
    <>
      <header>
        <nav className="flex justify-between items-center my-4">
          <a href="/">
            <img src={Logo} alt="" className="logo" />
          </a>
          <ul className="flex items-center gap-4">
            <NavLink to="https://github.com/ru0te" className="font-extrabold">
              built by ruote.
            </NavLink>
          </ul>
        </nav>
      </header>
    </>
  );
}

export default NavBar;
