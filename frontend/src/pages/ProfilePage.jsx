import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { patientApi, authApi } from '../services/api';
import Avatar, { pickProfilePhoto } from '../components/ui/Avatar';
import { User, Mail, Phone, Calendar, Activity, FileText, Download, Upload, Shield, Camera } from 'lucide-react';

const EMPTY_PROFILE = {
  id: '',
  name: '',
  age: 0,
  dob: '—',
  gender: '—',
  bloodGroup: '—',
  contact: '—',
  documents: [],
};

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => {
    if (!user) return;
    patientApi
      .getById(user.id)
      .then(setProfile)
      .catch(() => setProfile({ ...EMPTY_PROFILE, name: user.name }));
  }, [user]);

  const handleChangePhoto = async () => {
    try {
      const image = await pickProfilePhoto();
      if (!image) return;
      setIsUploadingPhoto(true);
      const res = await authApi.updateProfile({ image });
      updateUser({ image: res.user.image });
    } catch (err) {
      alert(err.message || 'Failed to update profile photo.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Patient Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your personal information and medical documents.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Left Column: Personal Info Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '80px', backgroundColor: 'var(--primary)', opacity: 0.1, zIndex: 0 }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Avatar
                name={profile.name || user?.name}
                src={user?.image}
                size={96}
                style={{ border: '4px solid var(--bg-surface)', opacity: isUploadingPhoto ? 0.5 : 1 }}
              />
              <button
                onClick={handleChangePhoto}
                disabled={isUploadingPhoto}
                title="Change profile photo"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  border: '2px solid var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Camera size={16} />
              </button>
            </div>
            <div style={{ zIndex: 1 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{profile.name || user?.name}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Patient ID: #{(profile.id || 'new').slice(-6).toUpperCase()}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', zIndex: 1 }}>
              <span style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--success-bg)', color: 'var(--success)', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600 }}>Active Patient</span>
            </div>
          </Card>

          <Card style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Contact Details</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                <Phone size={18} />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Phone Number</p>
                <p style={{ fontWeight: 500 }}>{profile.contact || '—'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                <Mail size={18} />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Email Address</p>
                <p style={{ fontWeight: 500 }}>{user?.email}</p>
              </div>
            </div>
            
            <Button variant="outline" className="w-full mt-4">Edit Contact Info</Button>
          </Card>
        </div>

        {/* Right Column: Health Details & Documents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Health Overview</h3>
              <Button variant="ghost" size="sm">Update Details</Button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Calendar size={20} color="var(--primary)" />
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Age / DOB</p>
                <p style={{ fontWeight: 600, fontSize: '1.125rem' }}>{profile.age} yrs <span style={{ fontSize: '0.875rem', color: 'var(--text-light)', fontWeight: 400 }}>({profile.dob || '—'})</span></p>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <User size={20} color="var(--primary)" />
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Gender</p>
                <p style={{ fontWeight: 600, fontSize: '1.125rem' }}>{profile.gender || '—'}</p>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Activity size={20} color="var(--error)" />
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Blood Group</p>
                <p style={{ fontWeight: 600, fontSize: '1.125rem', color: 'var(--error)' }}>{profile.bloodGroup || '—'}</p>
              </div>
            </div>
          </Card>

          <Card style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Medical Documents</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>View and upload your reports and records.</p>
              </div>
              <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={16} /> Upload New
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {profile.documents.map(doc => (
                <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} className="hover-scale">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{doc.name.replace(/_/g, ' ')}</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', display: 'flex', gap: '1rem' }}>
                        <span>Added: {doc.date}</span>
                        <span>Size: {doc.size}</span>
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button variant="ghost" size="sm" style={{ padding: '0.5rem' }} title="Verify Document">
                      <Shield size={18} color="var(--success)" />
                    </Button>
                    <Button variant="outline" size="sm" style={{ padding: '0.5rem' }}>
                      <Download size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
