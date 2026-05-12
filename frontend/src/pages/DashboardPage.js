import React, { useEffect, useState } from 'react';
import { Book, Users, BookOpenCheck } from 'lucide-react';
import api from '../api';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    totalMembers: 0,
    activeIssues: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, availableBooksRes, membersRes, issuesRes] = await Promise.all([
          api.get('/books'),
          api.get('/books/available'),
          api.get('/members'),
          api.get('/issues/active')
        ]);
        
        setStats({
          totalBooks: booksRes.data.length,
          availableBooks: availableBooksRes.data.length,
          totalMembers: membersRes.data.length,
          activeIssues: issuesRes.data.length
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Books', value: stats.totalBooks, icon: <Book size={24} className="text-primary" />, color: '#3b82f6' },
    { title: 'Available Books', value: stats.availableBooks, icon: <Book size={24} style={{ color: '#10b981' }} />, color: '#10b981' },
    { title: 'Total Members', value: stats.totalMembers, icon: <Users size={24} style={{ color: '#8b5cf6' }} />, color: '#8b5cf6' },
    { title: 'Active Issues', value: stats.activeIssues, icon: <BookOpenCheck size={24} style={{ color: '#ef4444' }} />, color: '#ef4444' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {statCards.map((stat, index) => (
          <div key={index} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: `${stat.color}20` }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>{stat.title}</p>
              <h3 style={{ fontSize: '1.875rem', fontWeight: '700' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
      
      <div className="glass-panel" style={{ marginTop: '2rem', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Welcome to LibraryManager</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
          This is a premium, high-performance library management system built with Spring Boot and React. 
          Use the navigation menu on the left to add books, register members, and manage book issues.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
