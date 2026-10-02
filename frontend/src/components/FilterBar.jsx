import React, { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { Search, X, Filter, LayoutGrid, List, Layers, ArrowUpDown } from 'lucide-react';

export const FilterBar = () => {
  const { filters, setFilters, viewMode, setViewMode } = useContext(TaskContext);

  const statuses = ['All', 'Pending', 'In Progress', 'Completed'];
  const priorities = ['All', 'Low', 'Medium', 'High'];
  const categories = ['All', 'Work', 'Personal', 'Shopping', 'Health', 'Finance', 'Other'];

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const clearSearch = () => {
    setFilters({ ...filters, search: '' });
  };

  return (
    <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '220px' }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={handleSearchChange}
            className="form-input"
            style={{ paddingLeft: '38px', paddingRight: filters.search ? '36px' : '14px' }}
          />
          {filters.search && (
            <button
              onClick={clearSearch}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Status Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'var(--bg-input)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          overflowX: 'auto'
        }}>
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setFilters({ ...filters, status: st })}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: filters.status === st ? 'var(--accent-primary)' : 'transparent',
                color: filters.status === st ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: filters.status === st ? 600 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Dropdowns & View Mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Priority Select */}
          <div style={{ position: 'relative' }}>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="form-select"
              style={{ fontSize: '0.82rem', paddingRight: '28px' }}
            >
              <option value="All">Priority: All</option>
              {priorities.filter(p => p !== 'All').map(p => (
                <option key={p} value={p}>Priority: {p}</option>
              ))}
            </select>
          </div>

          {/* Category Select */}
          <div style={{ position: 'relative' }}>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="form-select"
              style={{ fontSize: '0.82rem', paddingRight: '28px' }}
            >
              <option value="All">Category: All</option>
              {categories.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>Category: {c}</option>
              ))}
            </select>
          </div>

          {/* Sort By Select */}
          <div style={{ position: 'relative' }}>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="form-select"
              style={{ fontSize: '0.82rem', paddingRight: '28px' }}
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="dueDate">Sort: Due Date</option>
              <option value="title">Sort: Title (A-Z)</option>
            </select>
          </div>

          {/* View Mode Buttons (Grid / List / Kanban) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            background: 'var(--bg-input)',
            padding: '3px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: viewMode === 'grid' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--accent-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: viewMode === 'list' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: viewMode === 'list' ? 'var(--accent-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="List View"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: viewMode === 'kanban' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: viewMode === 'kanban' ? 'var(--accent-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Kanban Board View"
            >
              <Layers size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
