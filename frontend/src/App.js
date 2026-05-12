import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import BooksPage from './pages/BooksPage';
import MembersPage from './pages/MembersPage';
import IssuesPage from './pages/IssuesPage';
import AuthPage from './pages/AuthPage';
import { isAuthenticated, isAdmin } from './auth';

const ProtectedLayout = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }
  return <Layout />;
};

const AuthRoute = () => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <AuthPage />;
};

const AdminRoute = ({ children }) => {
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthRoute />} />
        <Route path="/" element={<ProtectedLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="books" element={<BooksPage />} />
          <Route path="members" element={<AdminRoute><MembersPage /></AdminRoute>} />
          <Route path="issues" element={<AdminRoute><IssuesPage /></AdminRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
