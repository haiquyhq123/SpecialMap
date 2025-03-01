import React, { useState } from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import RegisterFeature from './components/RegisterFeature';
import MainPage from './Pages/MainPage';
import './App.css';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<RegisterFeature></RegisterFeature>} />
        <Route path = "/main" element={<MainPage></MainPage>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App;