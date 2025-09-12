import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import HomePage from "../src/components/HomePage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
