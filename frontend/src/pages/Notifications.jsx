import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import { mockNotifications } from '../data/mockData';
import { Bell, Calendar, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const getIcon = (type) => {
    switch(type) {
      case 'reminder': return <Calendar size={20} color="var(--primary)" />;
      case 'alert': return <AlertTriangle size={20} color="var(--error)" />;
      case 'success': return <CheckCircle size={20} color="var(--success)" />;
      default: return <Bell size={20} color="var(--text-secondary)" />;
    }
  };

  const getBgColor = (type) => {
    switch(type) {
      case 'reminder': return 'var(--secondary)';
      case 'alert': return 'var(--error-bg)';
      case 'success': return 'var(--success-bg)';
      default: return 'var(--bg-main)';
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Notifications</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Stay updated with your appointments and alerts.</p>
        </div>
        {notifications.length > 0 && (
          <button style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '0.875rem' }} onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}>
            Mark all as read
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <AnimatePresence>
          {notifications.map(notification => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              layout
            >
              <Card 
                style={{ 
                  display: 'flex', gap: '1rem', 
                  borderLeft: !notification.read ? '4px solid var(--primary)' : '1px solid var(--border)',
                  opacity: notification.read ? 0.7 : 1
                }}
              >
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                  backgroundColor: getBgColor(notification.type), display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {getIcon(notification.type)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontWeight: 600 }}>{notification.title}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{notification.time}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>{notification.message}</p>
                  
                  {!notification.read && (
                    <button 
                      onClick={() => markAsRead(notification.id)}
                      style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600, marginRight: '1rem' }}
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
                
                <button onClick={() => deleteNotification(notification.id)} style={{ color: 'var(--text-light)', height: 'fit-content' }}>
                  <Trash2 size={18} />
                </button>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <EmptyState 
            type="inbox" 
            title="All caught up!" 
            description="You don't have any new notifications at the moment. We'll alert you if anything comes up regarding your appointments."
          />
        )}
      </div>
    </div>
  );
};

export default Notifications;
