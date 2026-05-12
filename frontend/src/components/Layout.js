import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Book, Users, BookOpenCheck, LayoutDashboard } from 'lucide-react';
import '../index.css';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/books', label: 'Books', icon: <Book size={20} /> },
    { path: '/members', label: 'Members', icon: <Users size={20} /> },
    { path: '/issues', label: 'Issues', icon: <BookOpenCheck size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '260px', padding: '2rem 1rem', margin: '1rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '3rem', padding: '0 1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            LibraryManager
          </h1>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: '8px',
                  color: isActive ? 'white' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  transition: 'all 0.2s',
                  fontWeight: isActive ? '600' : '500'
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
