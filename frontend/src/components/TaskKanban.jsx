import React, { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { TaskCard } from './TaskCard';
import { Circle, Clock, CheckCircle2 } from 'lucide-react';

export const TaskKanban = ({ onEdit }) => {
  const { tasks, updateTask } = useContext(TaskContext);

  const columns = [
    {
      id: 'Pending',
      title: 'Pending',
      icon: Circle,
      color: '#f59e0b',
      tasks: tasks.filter(t => t.status === 'Pending')
    },
    {
      id: 'In Progress',
      title: 'In Progress',
      icon: Clock,
      color: '#3b82f6',
      tasks: tasks.filter(t => t.status === 'In Progress')
    },
    {
      id: 'Completed',
      title: 'Completed',
      icon: CheckCircle2,
      color: '#10b981',
      tasks: tasks.filter(t => t.status === 'Completed')
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      alignItems: 'start'
    }}>
      {columns.map(col => {
        const Icon = col.icon;
        return (
          <div
            key={col.id}
            className="glass-panel"
            style={{
              padding: '18px',
              minHeight: '450px',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(15, 23, 42, 0.4)'
            }}
          >
            {/* Column Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon size={18} color={col.color} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {col.title}
                </h3>
              </div>
              <span style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--text-secondary)'
              }}>
                {col.tasks.length}
              </span>
            </div>

            {/* Column Task Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
              {col.tasks.length > 0 ? (
                col.tasks.map(task => (
                  <TaskCard key={task._id} task={task} onEdit={onEdit} />
                ))
              ) : (
                <div style={{
                  padding: '30px 16px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  border: '1px dashed var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  margin: 'auto 0'
                }}>
                  <p style={{ fontSize: '0.85rem' }}>No tasks in {col.title}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
