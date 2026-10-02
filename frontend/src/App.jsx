import React, { useState, useEffect, useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { TaskProvider, TaskContext } from './context/TaskContext';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { FilterBar } from './components/FilterBar';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { TaskKanban } from './components/TaskKanban';
import { AuthModal } from './components/AuthModal';
import { EmptyState } from './components/EmptyState';
import { Sparkles, CheckSquare, ShieldCheck, ArrowRight, Zap, Filter, Layout } from 'lucide-react';

const DashboardContent = ({ onOpenAuth, onOpenNewTask, onEditTask }) => {
  const { user } = useContext(AuthContext);
  const { tasks, loading, viewMode } = useContext(TaskContext);

  if (!user) {
    return (
      <div style={{ maxWidth: '900px', margin: '60px auto', textAlign: 'center', padding: '0 20px' }}>
        {/* Unauthenticated Landing Hero */}
        <div className="glass-panel animate-fade-in" style={{ padding: '48px 32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '20px',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: 'var(--accent-primary)',
            fontWeight: 600,
            fontSize: '0.85rem',
            marginBottom: '20px'
          }}>
            <Sparkles size={16} /> Full-Stack React + Express + MongoDB Task Tracking
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '16px',
            letterSpacing: '-0.02em'
          }}>
            Organize Your Workflow with{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Precision & Speed
            </span>
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            maxWidth: '640px',
            margin: '0 auto 32px auto',
            lineHeight: '1.6'
          }}>
            A modern, production-ready task management platform featuring real-time statistics, subtask checklists, multi-criteria filtering, and JWT token authentication.
          </p>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={onOpenAuth} className="btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Feature Highlights Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginTop: '48px',
            textAlign: 'left'
          }}>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)' }}>
              <Zap size={22} color="#6366f1" style={{ marginBottom: '8px' }} />
              <h3 style={{ fontSize: '0.98rem', fontWeight: 600, marginBottom: '4px' }}>Express & MongoDB</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Mongoose models with indexing and REST endpoints.</p>
            </div>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)' }}>
              <Filter size={22} color="#06b6d4" style={{ marginBottom: '8px' }} />
              <h3 style={{ fontSize: '0.98rem', fontWeight: 600, marginBottom: '4px' }}>Smart Filtering</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Filter by status, priority, category, and keyword search.</p>
            </div>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)' }}>
              <Layout size={22} color="#a855f7" style={{ marginBottom: '8px' }} />
              <h3 style={{ fontSize: '0.98rem', fontWeight: 600, marginBottom: '4px' }}>Grid, List & Kanban</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Switch views seamlessly according to your preference.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1300px', margin: '32px auto', padding: '0 24px 60px 24px' }}>
      {/* Metrics overview */}
      <StatsOverview />

      {/* Filter and Controls bar */}
      <FilterBar />

      {/* Main Task List / Views */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '1rem' }}>Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState onOpenNewTask={onOpenNewTask} />
      ) : viewMode === 'kanban' ? (
        <TaskKanban onEdit={onEditTask} />
      ) : viewMode === 'list' ? (
        <div>
          {tasks.map(task => (
            <TaskCard key={task._id} task={task} onEdit={onEditTask} isListView={true} />
          ))}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {tasks.map(task => (
            <TaskCard key={task._id} task={task} onEdit={onEditTask} />
          ))}
        </div>
      )}
    </div>
  );
};

export function App() {
  const [theme, setTheme] = useState('dark');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleOpenNewTask = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  return (
    <AuthProvider>
      <TaskProvider>
        <div style={{ minHeight: '100vh', position: 'relative' }}>
          {/* Background glowing gradients */}
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />

          {/* Navigation Bar */}
          <Navbar
            theme={theme}
            toggleTheme={toggleTheme}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenNewTask={handleOpenNewTask}
          />

          {/* Main Content */}
          <main style={{ position: 'relative', zIndex: 10 }}>
            <DashboardContent
              onOpenAuth={() => setIsAuthOpen(true)}
              onOpenNewTask={handleOpenNewTask}
              onEditTask={handleEditTask}
            />
          </main>

          {/* Modals */}
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
          />

          <TaskModal
            isOpen={isTaskModalOpen}
            onClose={() => {
              setIsTaskModalOpen(false);
              setTaskToEdit(null);
            }}
            taskToEdit={taskToEdit}
          />
        </div>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
