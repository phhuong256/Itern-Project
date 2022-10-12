import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./page/Home";
import About from "./page/About";
import "antd/dist/antd.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="about" element={<About />} />
    </Routes>
  );
}

export default App;
