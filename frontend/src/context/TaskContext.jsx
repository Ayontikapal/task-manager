import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const TaskContext = createContext();

const API_BASE_URL = (import.meta.env.VITE_API_URL || '') + '/api/tasks';

export const TaskProvider = ({ children }) => {
  const { token, user } = useContext(AuthContext);
  
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    highPriority: 0,
    completionRate: 0,
    categoryCounts: {}
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list' | 'kanban'
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    priority: 'All',
    category: 'All',
    sortBy: 'newest'
  });

  // Fetch tasks with filters
  const fetchTasks = useCallback(async () => {
    if (!token || !user) return;
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'All') params.append('status', filters.status);
      if (filters.priority && filters.priority !== 'All') params.append('priority', filters.priority);
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);

      const res = await axios.get(`${API_BASE_URL}?${params.toString()}`);
      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (err) {
      console.error('Fetch tasks error:', err);
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [token, user, filters]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    if (!token || !user) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/stats`);
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Fetch stats error:', err);
    }
  }, [token, user]);

  useEffect(() => {
    if (token && user) {
      fetchTasks();
      fetchStats();
    } else {
      setTasks([]);
    }
  }, [token, user, fetchTasks, fetchStats]);

  // Create task
  const createTask = async (taskData) => {
    try {
      const res = await axios.post(API_BASE_URL, taskData);
      if (res.data.success) {
        fetchTasks();
        fetchStats();
        return { success: true, data: res.data.data };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to create task' };
    }
  };

  // Update task
  const updateTask = async (id, updatedData) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/${id}`, updatedData);
      if (res.data.success) {
        fetchTasks();
        fetchStats();
        return { success: true, data: res.data.data };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update task' };
    }
  };

  // Toggle quick status
  const toggleTaskStatus = async (id) => {
    try {
      const res = await axios.patch(`${API_BASE_URL}/${id}/toggle`);
      if (res.data.success) {
        fetchTasks();
        fetchStats();
      }
    } catch (err) {
      console.error('Toggle task status error:', err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/${id}`);
      if (res.data.success) {
        fetchTasks();
        fetchStats();
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete task' };
    }
  };

  // Seed demo data
  const seedDemoTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/seed`);
      if (res.data.success) {
        fetchTasks();
        fetchStats();
      }
    } catch (err) {
      console.error('Seed demo error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        loading,
        error,
        filters,
        setFilters,
        viewMode,
        setViewMode,
        fetchTasks,
        createTask,
        updateTask,
        toggleTaskStatus,
        deleteTask,
        seedDemoTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
