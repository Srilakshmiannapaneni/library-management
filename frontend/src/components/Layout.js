import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Book, Users, BookOpenCheck, LayoutDashboard, LogOut } from 'lucide-react';
import '../index.css';
import { getStoredUser, isAdmin } from '../auth';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser();
  const admin = isAdmin();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/books', label: 'Books', icon: <Book size={20} /> },
    ...(admin ? [
      { path: '/members', label: 'Members', icon: <Users size={20} /> },
      { path: '/issues', label: 'Issues', icon: <BookOpenCheck size={20} /> }
    ] : []),
  ];

  const handleLogout = () => {
    localStorage.removeItem('libraryUser');
    navigate('/auth');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '260px', padding: '2rem 1rem', margin: '1rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '3rem', padding: '0 1rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
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
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  backgroundColor: isActive ? '#eff6ff' : 'transparent',
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

        <div style={{ marginTop: 'auto', padding: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            {user?.name ? `Signed in as ${user.name} (${user?.role || 'USER'})` : 'Signed in'}
          </p>
          <button type="button" className="btn" style={{ width: '100%', justifyContent: 'center', backgroundColor: '#f3f4f6', color: '#111827' }} onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
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
