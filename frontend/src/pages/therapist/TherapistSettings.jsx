import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { User, Bell, Lock, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TherapistSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
          Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your profile and preferences.</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <Card className="glass-panel" style={{ padding: '1rem', width: '250px', height: 'fit-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Button variant={activeTab === 'profile' ? 'primary' : 'ghost'} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('profile')}>
              <User size={18} style={{ marginRight: '0.75rem' }} /> Profile Information
            </Button>
            <Button variant={activeTab === 'notifications' ? 'primary' : 'ghost'} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('notifications')}>
              <Bell size={18} style={{ marginRight: '0.75rem' }} /> Notification Preferences
            </Button>
            <Button variant={activeTab === 'security' ? 'primary' : 'ghost'} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('security')}>
              <Lock size={18} style={{ marginRight: '0.75rem' }} /> Security & Password
            </Button>
            <Button variant={activeTab === 'appearance' ? 'primary' : 'ghost'} style={{ justifyContent: 'flex-start' }} onClick={() => setActiveTab('appearance')}>
              {darkMode ? <Moon size={18} style={{ marginRight: '0.75rem' }} /> : <Sun size={18} style={{ marginRight: '0.75rem' }} />} 
              Appearance
            </Button>
          </div>
        </Card>

        <Card className="glass-panel" style={{ padding: '2rem', flex: 1, minWidth: '300px' }}>
          {activeTab === 'profile' && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Profile Information</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                <img src="https://i.pravatar.cc/150?u=therapist_mock" alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} />
                <div>
                  <Button variant="outline" size="sm" style={{ marginBottom: '0.5rem' }}>Change Photo</Button>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Full Name</label>
                    <input type="text" className="input-field" defaultValue={user?.name} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Specialization</label>
                    <input type="text" className="input-field" defaultValue="Physical Therapy" />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Email Address</label>
                  <input type="email" className="input-field" defaultValue={user?.email} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Bio / Description</label>
                  <textarea className="input-field" style={{ minHeight: '100px', resize: 'vertical' }} defaultValue="Specialized in pediatric physical therapy and post-surgery rehabilitation."></textarea>
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button>Save Changes</Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Appearance Settings</h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Dark Mode</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Toggle premium dark mode UI.</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                  <input type="checkbox" checked={darkMode} onChange={toggleTheme} style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: darkMode ? 'var(--primary)' : '#ccc', borderRadius: '24px', transition: '.4s' }}>
                    <span style={{ position: 'absolute', content: '""', height: '16px', width: '16px', left: darkMode ? '30px' : '4px', bottom: '4px', backgroundColor: 'white', borderRadius: '50%', transition: '.4s' }}></span>
                  </span>
                </label>
              </div>
            </div>
          )}
          
          {(activeTab === 'notifications' || activeTab === 'security') && (
            <div className="animate-fade-in" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              This section is under construction.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TherapistSettings;
