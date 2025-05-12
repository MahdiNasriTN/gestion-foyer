import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Chambres from './pages/Chambres';
import Etudiants from './pages/Etudiants';
import Stagiaires from './pages/Stagiaires';
import Cuisine from './pages/Cuisine';
import Login from './pages/Login';

// Composant pour les routes protégées
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifier l'authentification au chargement de l'application
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setAuthenticated={setIsAuthenticated} />} />
        
        <Route path="/" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Layout onLogout={handleLogout}>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/chambres" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Layout onLogout={handleLogout}>
              <Chambres />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/etudiants" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Layout onLogout={handleLogout}>
              <Etudiants />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/stagiaires" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Layout onLogout={handleLogout}>
              <Stagiaires />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/cuisine" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Layout onLogout={handleLogout}>
              <Cuisine />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;