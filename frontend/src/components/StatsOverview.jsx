import React, { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { CheckCircle2, Clock, AlertTriangle, Layers, TrendingUp } from 'lucide-react';

export const StatsOverview = () => {
  const { stats } = useContext(TaskContext);

  const cards = [
    {
      title: 'Total Tasks',
      value: stats.total || 0,
      icon: Layers,
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.12)'
    },
    {
      title: 'Completed',
      value: stats.completed || 0,
      icon: CheckCircle2,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.12)'
    },
    {
      title: 'In Progress',
      value: stats.inProgress || 0,
      icon: Clock,
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.12)'
    },
    {
      title: 'High Priority',
      value: stats.highPriority || 0,
      icon: AlertTriangle,
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.12)'
    }
  ];

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* 4 Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '16px'
      }}>
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {card.title}
                </span>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '4px', color: 'var(--text-primary)' }}>
                  {card.value}
                </div>
              </div>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: card.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={24} color={card.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar Widget */}
      <div className="glass-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--accent-secondary)" />
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>Overall Productivity Progress</span>
          </div>
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
            {stats.completionRate || 0}% Completed
          </span>
        </div>

        <div style={{
          width: '100%',
          height: '8px',
          borderRadius: '4px',
          background: 'rgba(255, 255, 255, 0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${stats.completionRate || 0}%`,
            height: '100%',
            borderRadius: '4px',
            background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)',
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>
    </div>
  );
};
