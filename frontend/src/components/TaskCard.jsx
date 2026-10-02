import React, { useContext, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import {
  CheckCircle2,
  Circle,
  Calendar,
  Tag,
  Edit3,
  Trash2,
  CheckSquare,
  Square,
  Clock,
  Briefcase,
  User,
  ShoppingBag,
  HeartPulse,
  DollarSign,
  Layers
} from 'lucide-react';

export const TaskCard = ({ task, onEdit, isListView = false }) => {
  const { toggleTaskStatus, updateTask, deleteTask } = useContext(TaskContext);
  const [isDeleting, setIsDeleting] = useState(false);

  // Category Icon helper
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Work': return <Briefcase size={14} />;
      case 'Personal': return <User size={14} />;
      case 'Shopping': return <ShoppingBag size={14} />;
      case 'Health': return <HeartPulse size={14} />;
      case 'Finance': return <DollarSign size={14} />;
      default: return <Tag size={14} />;
    }
  };

  // Due Date formatter
  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Check subtasks completion count
  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
  const completedSubtasks = task.subtasks ? task.subtasks.filter(st => st.completed).length : 0;

  // Toggle single subtask
  const handleSubtaskToggle = (subtaskId) => {
    const updatedSubtasks = task.subtasks.map(st =>
      st._id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    updateTask(task._id, { subtasks: updatedSubtasks });
  };

  // Change status dropdown
  const handleStatusSelect = (e) => {
    updateTask(task._id, { status: e.target.value });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteTask(task._id);
  };

  const isCompleted = task.status === 'Completed';

  if (isListView) {
    return (
      <div
        className="glass-panel animate-fade-in"
        style={{
          padding: '16px 20px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          opacity: isCompleted ? 0.75 : 1,
          borderLeft: `4px solid ${
            task.priority === 'High' ? '#ef4444' : task.priority === 'Medium' ? '#f59e0b' : '#10b981'
          }`
        }}
      >
        {/* Left: Quick checkbox & title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
          <button
            onClick={() => toggleTaskStatus(task._id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}
            title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
          >
            {isCompleted ? (
              <CheckCircle2 size={22} color="#10b981" />
            ) : (
              <Circle size={22} color="var(--text-muted)" />
            )}
          </button>

          <div style={{ minWidth: 0 }}>
            <h3 style={{
              fontSize: '0.98rem',
              fontWeight: 600,
              textDecoration: isCompleted ? 'line-through' : 'none',
              color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {task.title}
            </h3>
            {task.description && (
              <p style={{
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginTop: '2px'
              }}>
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Center: Metadata */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Category */}
          <span style={{
            fontSize: '0.75rem',
            padding: '4px 10px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.06)',
            color: 'var(--text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {getCategoryIcon(task.category)}
            {task.category}
          </span>

          {/* Priority */}
          <span className={`badge badge-${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>

          {/* Status select */}
          <select
            value={task.status}
            onChange={handleStatusSelect}
            className="form-select"
            style={{ fontSize: '0.78rem', padding: '4px 10px', width: 'auto' }}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Due date */}
          {task.dueDate && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} />
              {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onEdit(task)}
            style={{
              padding: '6px',
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(99, 102, 241, 0.12)',
              color: '#818cf8',
              cursor: 'pointer'
            }}
            title="Edit Task"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            style={{
              padding: '6px',
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#f87171',
              cursor: 'pointer'
            }}
            title="Delete Task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Default Grid View Layout
  return (
    <div
      className="glass-panel animate-fade-in"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        opacity: isCompleted ? 0.8 : 1,
        borderTop: `3px solid ${
          task.priority === 'High' ? '#ef4444' : task.priority === 'Medium' ? '#f59e0b' : '#10b981'
        }`
      }}
    >
      <div>
        {/* Top bar: Category Pill & Priority Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{
            fontSize: '0.75rem',
            padding: '3px 10px',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.08)',
            color: 'var(--text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontWeight: 500
          }}>
            {getCategoryIcon(task.category)}
            {task.category}
          </span>

          <span className={`badge badge-${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
        </div>

        {/* Task Title & Checkbox */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
          <button
            onClick={() => toggleTaskStatus(task._id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              marginTop: '2px',
              padding: 0
            }}
            title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
          >
            {isCompleted ? (
              <CheckCircle2 size={20} color="#10b981" />
            ) : (
              <Circle size={20} color="var(--text-muted)" />
            )}
          </button>

          <h3 style={{
            fontSize: '1.05rem',
            fontWeight: 600,
            lineHeight: '1.4',
            color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
            textDecoration: isCompleted ? 'line-through' : 'none'
          }}>
            {task.title}
          </h3>
        </div>

        {/* Task Description */}
        {task.description && (
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.5',
            marginBottom: '14px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {task.description}
          </p>
        )}

        {/* Subtasks Checklist */}
        {totalSubtasks > 0 && (
          <div style={{
            marginTop: '12px',
            marginBottom: '14px',
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Checklist</span>
              <span style={{ color: 'var(--accent-secondary)' }}>{completedSubtasks}/{totalSubtasks}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {task.subtasks.map(st => (
                <div key={st._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                  <button
                    onClick={() => handleSubtaskToggle(st._id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}
                  >
                    {st.completed ? (
                      <CheckSquare size={14} color="#10b981" />
                    ) : (
                      <Square size={14} color="var(--text-muted)" />
                    )}
                  </button>
                  <span style={{
                    color: st.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                    textDecoration: st.completed ? 'line-through' : 'none'
                  }}>
                    {st.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Due Date & Status Selector & Actions */}
      <div style={{
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px'
      }}>
        {/* Due date or Status dropdown */}
        <select
          value={task.status}
          onChange={handleStatusSelect}
          className="form-select"
          style={{ fontSize: '0.78rem', padding: '4px 8px', width: 'auto' }}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {task.dueDate && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={13} />
            {formatDueDate(task.dueDate)}
          </span>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => onEdit(task)}
            style={{
              padding: '6px',
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(99, 102, 241, 0.12)',
              color: '#818cf8',
              cursor: 'pointer'
            }}
            title="Edit Task"
          >
            <Edit3 size={15} />
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            style={{
              padding: '6px',
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#f87171',
              cursor: 'pointer'
            }}
            title="Delete Task"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
