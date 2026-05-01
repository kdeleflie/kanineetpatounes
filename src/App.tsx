import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Grooming from './pages/Grooming';
import Boarding from './pages/Boarding';
import Contact from './pages/Contact';
import Config from './pages/Config';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/grooming" element={<Grooming />} />
          <Route path="/boarding" element={<Boarding />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/config" element={<Config />} />
        </Routes>
      </Layout>
    </Router>
  );
}
