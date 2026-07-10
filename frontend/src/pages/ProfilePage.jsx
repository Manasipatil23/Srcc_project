import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { patientApi, authApi } from '../services/api';
import Avatar, { pickProfilePhoto } from '../components/ui/Avatar';
import { User, Mail, Phone, Calendar, Activity, FileText, Download, Upload, Shield, Camera, Eye, X } from 'lucide-react';

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

  const [isEditDetailsOpen, setIsEditDetailsOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({ name: '', size: '', dataUrl: null });
  const [isUploading, setIsUploading] = useState(false);

  const [previewDoc, setPreviewDoc] = useState(null);

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

  const openEditDetails = () => {
    setEditFormData({
      age: profile.age,
      dob: profile.dob,
      gender: profile.gender,
      bloodGroup: profile.bloodGroup,
      contact: profile.contact
    });
    setIsEditDetailsOpen(true);
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    
    // Contact number validation (+91 followed by exactly 10 digits)
    const phoneRegex = /^\+91 \d{10}$/;
    if (editFormData.contact && !phoneRegex.test(editFormData.contact)) {
      return alert('Phone number must be in the format: +91 XXXXXXXXXX');
    }

    // DOB validation (cannot be in the future)
    if (editFormData.dob) {
      const selectedDate = new Date(editFormData.dob);
      const today = new Date();
      if (selectedDate > today) {
        return alert('Date of Birth cannot be in the future.');
      }
    }

    setIsUpdating(true);
    try {
      const updated = await patientApi.update(profile.id, editFormData);
      setProfile(updated);
      setIsEditDetailsOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to update details');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!uploadFormData.name || !uploadFormData.dataUrl) return alert("Please select a file to upload");
    setIsUploading(true);
    try {
      const newDoc = {
        name: uploadFormData.name,
        size: uploadFormData.size || 'Unknown',
        date: new Date().toISOString().split('T')[0],
        dataUrl: uploadFormData.dataUrl
      };
      const updated = await patientApi.addDocument(profile.id, newDoc);
      setProfile(updated);
      setIsUploadDocOpen(false);
      setUploadFormData({ name: '', size: '', dataUrl: null });
    } catch (err) {
      alert(err.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Calculate human-readable size
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      const sizeStr = sizeInMB > 0.1 ? `${sizeInMB} MB` : `${(file.size / 1024).toFixed(0)} KB`;
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadFormData({
          name: file.name,
          size: sizeStr,
          dataUrl: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          {user?.role === 'admin' ? 'Admin Profile' : user?.role === 'therapist' ? 'Therapist Profile' : 'Patient Profile'}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {user?.role === 'admin' ? 'Manage your administrative settings.' : user?.role === 'therapist' ? 'Manage your professional details and schedule.' : 'Manage your personal information and medical documents.'}
        </p>
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
              <p style={{ color: 'var(--text-secondary)' }}>
                {user?.role === 'admin' ? 'Admin ID' : user?.role === 'therapist' ? 'Therapist ID' : 'Patient ID'}: #{(profile.id || 'new').slice(-6).toUpperCase()}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', zIndex: 1 }}>
              <span style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--success-bg)', color: 'var(--success)', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600 }}>
                {user?.role === 'admin' ? 'System Admin' : user?.role === 'therapist' ? 'Active Therapist' : 'Active Patient'}
              </span>
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
            
            <Button variant="outline" className="w-full mt-4" onClick={openEditDetails}>Edit Contact Info</Button>
          </Card>
        </div>

        {/* Right Column: Health Details & Documents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Health Overview</h3>
              <Button variant="ghost" size="sm" onClick={openEditDetails}>Update Details</Button>
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
              <Button variant="primary" onClick={() => setIsUploadDocOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                    <Button variant="ghost" size="sm" style={{ padding: '0.5rem' }} title="Preview Document" onClick={() => setPreviewDoc(doc)}>
                      <Eye size={18} color="var(--primary)" />
                    </Button>
                    <Button variant="ghost" size="sm" style={{ padding: '0.5rem' }} title="Verify Document">
                      <Shield size={18} color="var(--success)" />
                    </Button>
                    {doc.dataUrl ? (
                      <a href={doc.dataUrl} download={doc.name} style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <Button variant="outline" size="sm" style={{ padding: '0.5rem' }} title="Download" type="button">
                          <Download size={18} />
                        </Button>
                      </a>
                    ) : (
                      <Button variant="outline" size="sm" style={{ padding: '0.5rem' }} title="Download (Unavailable)">
                        <Download size={18} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>

      {/* Modals */}
      {isEditDetailsOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Update Details</h3>
            <form onSubmit={handleUpdateDetails} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Age</label>
                <input type="number" className="input-field" value={editFormData.age} onChange={e => setEditFormData({...editFormData, age: Number(e.target.value)})} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Date of Birth</label>
                <input type="date" className="input-field" value={editFormData.dob} onChange={e => setEditFormData({...editFormData, dob: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Gender</label>
                <select className="input-field" value={editFormData.gender} onChange={e => setEditFormData({...editFormData, gender: e.target.value})}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Blood Group</label>
                <select className="input-field" value={editFormData.bloodGroup} onChange={e => setEditFormData({...editFormData, bloodGroup: e.target.value})}>
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Contact Number</label>
                <input type="text" className="input-field" placeholder="+91 9876543210" value={editFormData.contact} onChange={e => {
                  let val = e.target.value;
                  if (!val.startsWith('+91 ')) {
                    if (val.startsWith('+91')) val = '+91 ' + val.substring(3);
                    else val = '+91 ' + val.replace(/^\+?91/, '');
                  }
                  // Only allow digits after +91 
                  const digits = val.substring(4).replace(/\D/g, '').substring(0, 10);
                  setEditFormData({...editFormData, contact: '+91 ' + digits});
                }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button variant="outline" onClick={() => setIsEditDetailsOpen(false)} style={{ flex: 1 }} type="button">Cancel</Button>
                <Button variant="primary" style={{ flex: 1 }} type="submit" disabled={isUpdating}>{isUpdating ? 'Saving...' : 'Save'}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {isUploadDocOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Upload Document</h3>
            <form onSubmit={handleUploadDocument} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                border: '2px dashed var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '2rem 1rem',
                textAlign: 'center',
                backgroundColor: 'var(--bg-main)',
                position: 'relative'
              }}>
                <input 
                  type="file" 
                  required 
                  onChange={handleFileChange}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }} 
                />
                <Upload size={32} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
                {uploadFormData.name ? (
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{uploadFormData.name}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{uploadFormData.size}</p>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Click or drag a file to upload</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>Supports PDF, JPG, PNG (Max 5MB)</p>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button variant="outline" onClick={() => setIsUploadDocOpen(false)} style={{ flex: 1 }} type="button">Cancel</Button>
                <Button variant="primary" style={{ flex: 1 }} type="submit" disabled={isUploading}>{isUploading ? 'Uploading...' : 'Upload'}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ width: '100%', maxWidth: '800px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{previewDoc.name}</h3>
              </div>
              <button onClick={() => setPreviewDoc(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={24} />
              </button>
            </div>
            <div style={{ flex: 1, backgroundColor: '#e5e7eb', padding: '2rem', display: 'flex', justifyContent: 'center', overflowY: 'auto' }}>
              {previewDoc.dataUrl ? (
                previewDoc.dataUrl.startsWith('data:image/') ? (
                  <img src={previewDoc.dataUrl} alt={previewDoc.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                ) : previewDoc.dataUrl.startsWith('data:application/pdf') ? (
                  <iframe src={previewDoc.dataUrl} style={{ width: '100%', height: '80vh', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} title={previewDoc.name}></iframe>
                ) : (
                  <div style={{ width: '100%', maxWidth: '600px', backgroundColor: 'white', padding: '3rem 2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={64} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Preview not available for this file type</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Please download the file to view it.</p>
                  </div>
                )
              ) : (
                <div style={{ width: '100%', maxWidth: '600px', backgroundColor: 'white', padding: '3rem 2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={64} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Legacy Document</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>This document does not contain preview data.</p>
                </div>
              )}
            </div>
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <Button variant="outline" onClick={() => setPreviewDoc(null)}>Close Preview</Button>
              {previewDoc.dataUrl && (
                <a href={previewDoc.dataUrl} download={previewDoc.name} style={{ textDecoration: 'none' }}>
                  <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} type="button">
                    <Download size={16} /> Download {previewDoc.size}
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
