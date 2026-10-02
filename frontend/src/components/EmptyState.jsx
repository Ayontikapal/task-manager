import React, { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { CheckSquare, Plus, Sparkles, FilterX } from 'lucide-react';

export const EmptyState = ({ onOpenNewTask }) => {
  const { filters, setFilters, seedDemoTasks } = useContext(TaskContext);

  const hasActiveFilters = filters.search || filters.status !== 'All' || filters.priority !== 'All' || filters.category !== 'All';

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'All',
      priority: 'All',
      category: 'All',
      sortBy: 'newest'
    });
  };

  return (
    <div className="glass-panel animate-fade-in" style={{
      padding: '48px 24px',
      textAlign: 'center',
      maxWidth: '520px',
      margin: '40px auto'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '20px',
        background: 'rgba(99, 102, 241, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px auto',
        border: '1px solid rgba(99, 102, 241, 0.2)'
      }}>
        {hasActiveFilters ? (
          <FilterX size={32} color="var(--accent-primary)" />
        ) : (
          <CheckSquare size={32} color="var(--accent-primary)" />
        )}
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
        {hasActiveFilters ? 'No tasks match your filters' : 'No tasks found'}
      </h3>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5' }}>
        {hasActiveFilters
          ? 'Try clearing active search queries or filters to see more tasks.'
          : 'Get started by creating your first task or seeding sample demo tasks.'}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {hasActiveFilters ? (
          <button onClick={clearFilters} className="btn-secondary">
            <FilterX size={16} />
            <span>Reset All Filters</span>
          </button>
        ) : (
          <>
            <button onClick={onOpenNewTask} className="btn-primary">
              <Plus size={16} />
              <span>Create Task</span>
            </button>
            <button onClick={seedDemoTasks} className="btn-secondary">
              <Sparkles size={16} color="#a855f7" />
              <span>Load Demo Tasks</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
