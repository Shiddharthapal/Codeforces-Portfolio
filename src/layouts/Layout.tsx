import React from "react";
import Nav from "./Nav";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main className=" ">
        <Outlet />
      </main>
    </div>
  );
}
