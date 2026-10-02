import React, { useState, useEffect, useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { X, Plus, Trash2, Calendar, Tag, AlertCircle } from 'lucide-react';

export const TaskModal = ({ isOpen, onClose, taskToEdit = null }) => {
  const { createTask, updateTask } = useContext(TaskContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Work',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
    subtasks: []
  });

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        category: taskToEdit.category || 'Work',
        priority: taskToEdit.priority || 'Medium',
        status: taskToEdit.status || 'Pending',
        dueDate: taskToEdit.dueDate ? taskToEdit.dueDate.split('T')[0] : '',
        subtasks: taskToEdit.subtasks || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'Work',
        priority: 'Medium',
        status: 'Pending',
        dueDate: '',
        subtasks: []
      });
    }
    setError(null);
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setFormData({
      ...formData,
      subtasks: [...formData.subtasks, { title: newSubtaskTitle.trim(), completed: false }]
    });
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (index) => {
    const updated = formData.subtasks.filter((_, idx) => idx !== index);
    setFormData({ ...formData, subtasks: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a task title.');
      return;
    }

    setLoading(true);
    let res;
    if (taskToEdit) {
      res = await updateTask(taskToEdit._id, formData);
    } else {
      res = await createTask(formData);
    }
    setLoading(false);

    if (res && res.success) {
      onClose();
    } else if (res && res.message) {
      setError(res.message);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)'
    }}>
      <div className="glass-panel animate-modal" style={{
        width: '100%',
        maxWidth: '540px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
            {taskToEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: '0.85rem',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Design Landing Page Wireframes"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Add task details, notes, or instructions..."
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Priority & Category Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Priority Level
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['Low', 'Medium', 'High'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: p })}
                    style={{
                      flex: 1,
                      padding: '8px 4px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      background: formData.priority === p ? (
                        p === 'High' ? 'rgba(239, 68, 68, 0.2)' : p === 'Medium' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'
                      ) : 'var(--bg-input)',
                      color: formData.priority === p ? (
                        p === 'High' ? '#f87171' : p === 'Medium' ? '#fbbf24' : '#34d399'
                      ) : 'var(--text-secondary)',
                      fontWeight: 600,
                      fontSize: '0.78rem',
                      cursor: 'pointer'
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
                <option value="Finance">Finance</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Status & Due Date Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Subtasks Builder */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Subtasks / Checklist
            </label>
            
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Add a subtask step..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="form-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="btn-secondary"
                style={{ padding: '8px 12px' }}
              >
                <Plus size={16} />
              </button>
            </div>

            {formData.subtasks.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {formData.subtasks.map((st, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-input)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <span>{st.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(index)}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Saving...' : taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
