import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar    from "./components/Navbar";
import Home      from "./pages/Home";
import Predict   from "./pages/Predict";
import Analytics from "./pages/Analytics";
import Zones     from "./pages/Zones";

export default function App() {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"          element={<Home />}      />
          <Route path="/predict"   element={<Predict />}   />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/zones"     element={<Zones />}     />
        </Routes>
      </AnimatePresence>
    </>
  );
}
