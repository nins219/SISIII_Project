import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <Link className="nav-link active" to="/home">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/profile/${id}">
            Profile
          </Link>
        </li>
        {/* <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            href="#"
          >
            Notifications
          </a>
          <ul className="dropdown-menu">
            <li>
              <a className="dropdown-item" href="#">
                Link 1
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Link 2
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Link 3
              </a>
            </li>
          </ul>
        </li>

        <li className="nav-item">
          <a className="nav-link disabled" href="#">
            Disabled
          </a>
        </li> */}
      </ul>
    </div>
  );
};
export default Navbar;
