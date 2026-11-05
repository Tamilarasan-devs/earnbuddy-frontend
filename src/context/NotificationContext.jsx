import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastSeenId, setLastSeenId] = useState(() => localStorage.getItem('last_notif_id') || '');

  const fetchNotifications = useCallback(async (isBackground = false) => {
    if (!user) return;
    if (!isBackground) setLoading(true);

    try {
      const res = await api.get('/notifications');
      if (res.data?.success) {
        const list = res.data.data || [];
        const count = res.data.unreadCount || 0;
        setNotifications(list);
        setUnreadCount(count);

        // Check if there is a new unread notification that hasn't toasted yet
        if (list.length > 0) {
          const newest = list[0];
          const storedSeenId = localStorage.getItem('last_notif_id');

          if (!newest.isRead && newest._id !== storedSeenId) {
            localStorage.setItem('last_notif_id', newest._id);
            setLastSeenId(newest._id);

            // Pop toast alert
            if (newest.type === 'referral_approved') {
              toast.success(newest.message, {
                icon: '🎉',
                duration: 6500,
                style: {
                  borderRadius: '18px',
                  background: '#0F172A',
                  color: '#fff',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  padding: '14px 18px',
                  fontSize: '13px',
                  fontWeight: '700'
                }
              });
            } else if (newest.type === 'deposit_approved') {
              toast.success(newest.message, {
                icon: '💰',
                duration: 5000,
                style: {
                  borderRadius: '18px',
                  background: '#0F172A',
                  color: '#fff',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '14px 18px',
                  fontSize: '13px',
                  fontWeight: '700'
                }
              });
            }
          }
        }
      }
    } catch (err) {
      // Quiet fail in background
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [user]);

  // Initial fetch and polling every 12 seconds
  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(() => {
        fetchNotifications(true);
      }, 12000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, fetchNotifications]);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const markOneRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAllRead,
        markOneRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

