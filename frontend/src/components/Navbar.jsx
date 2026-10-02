import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TaskContext } from '../context/TaskContext';
import { CheckSquare, Sparkles, LogOut, Sun, Moon, User, Plus } from 'lucide-react';

export const Navbar = ({ theme, toggleTheme, onOpenAuth, onOpenNewTask }) => {
  const { user, logout } = useContext(AuthContext);
  const { seedDemoTasks } = useContext(TaskContext);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-color)',
      padding: '14px 24px'
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}>
            <CheckSquare size={24} color="#ffffff" />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--accent-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              TaskFlow <span style={{
                fontSize: '0.65rem',
                padding: '2px 8px',
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.2)',
                color: 'var(--accent-primary)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                WebkitTextFillColor: 'var(--accent-primary)',
                fontWeight: 600
              }}>PRO</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Smart Full-Stack Task Manager</p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              padding: '9px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#6366f1" />}
          </button>

          {user ? (
            <>
              {/* Seed Demo Tasks */}
              <button
                onClick={seedDemoTasks}
                className="btn-secondary"
                style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                title="Load sample tasks to test filtering and features"
              >
                <Sparkles size={16} color="#a855f7" />
                <span>Seed Demo Tasks</span>
              </button>

              {/* Add New Task */}
              <button
                onClick={onOpenNewTask}
                className="btn-primary"
                style={{ fontSize: '0.85rem', padding: '8px 14px' }}
              >
                <Plus size={16} />
                <span>New Task</span>
              </button>

              {/* User Profile Pill & Logout */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                paddingLeft: '8px',
                borderLeft: '1px solid var(--border-color)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    color: '#fff'
                  }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={logout}
                  style={{
                    padding: '8px',
                    borderRadius: '10px',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#f87171',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-primary"
              style={{ fontSize: '0.88rem' }}
            >
              <User size={16} />
              <span>Login / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
