import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../../Contexts/ContextProvider";
import DrawerBasic from "../Drawer/Drawer";
import "./Layout.css";
import "./DefaultLayout.css";
import { Avatar } from "@mui/joy";
import DigitalClock from "../DigitalClock/DigitalClock";

const DefaultLayout = () => {
  const { user, token } = useStateContext();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="wrapperApp">
      <DrawerBasic>
        <Outlet />
      </DrawerBasic>
    </div>
  );
};

export default DefaultLayout;
