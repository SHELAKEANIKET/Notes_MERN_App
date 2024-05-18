import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContextProvider";

function Header() {
  const navigate = useNavigate();

  const { user, setUser } = useUser();

  const onLogout = () => {
    setUser(null);
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="py-4 lg:py-3 px-5 lg:px-24 flex justify-between items-center fixed top-0 w-full z-50 shadow-sm bg-secondary bg-opacity-40 backdrop-filter backdrop-blur-xl">
      <div className="flex justify-between items-center">
        <Link to="/">
          <h2 className="font-bold text-lg text-white">📒QuickNotes</h2>
        </Link>
      </div>
      <div className="flex justify-between items-center gap-4 lg:gap-8">
        {user ? (
          <button
            className="text-white py-2 px-4 rounded-md font-medium hover:underline"
            onClick={onLogout}
          >
            Logout
          </button>
        ) : (
          <Link
            className="bg-[#FFD700] py-2 px-4 rounded-md font-medium tracking-wide"
            to="/login"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;
