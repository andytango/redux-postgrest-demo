import React from "react";
import logo from "../images/logo.svg";

export default function TodoHeader() {
  return (
    <header className="App-header">
      <h1>Todos</h1>
      <img src={logo} className="App-logo" alt="logo" />
    </header>
  );
}
