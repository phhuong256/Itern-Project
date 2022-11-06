import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import About from "./page/About";
import Page1 from "./page/Page1";
import Page2 from "./page/Page2";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="1" element={<Page1 />} />
      <Route path="2" element={<Page2 />} />
    </Routes>
  );
}

export default App;
