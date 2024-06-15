import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useStateContext } from "../../Contexts/ContextProvider";
import './GuessLayout.css'
const GuessLayout = () => {
  const { token } = useStateContext();
  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="guestLayout">
      <Outlet />
    </div>
  );
};

export default GuessLayout;
