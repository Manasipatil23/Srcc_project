import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { therapistApi, authApi } from '../services/api';
import { Search, Star, Clock, CheckCircle, XCircle } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/ui/Modal';


const TherapistsManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [therapists, setTherapists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionBusyId, setActionBusyId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newQualification, setNewQualification] = useState('');
  const [newExperience, setNewExperience] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const loadTherapists = useCallback(async () => {
    try {
      const data = await therapistApi.getAll({ status: 'all' });
      setTherapists(data);
    } catch {
      setTherapists([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTherapists();
  }, [loadTherapists]);

  const pendingTherapists = therapists.filter(
    (t) => t.status === 'Pending' || t.status === 'Rejected'
  );
  const approvedTherapists = therapists.filter(
    (t) => !t.status || t.status === 'Approved'
  );

  const handleStatusChange = async (therapist, status) => {
    setActionBusyId(therapist.id);
    try {
      await therapistApi.updateStatus(therapist.id, status);
      await loadTherapists();
    } catch (err) {
      alert(err.message || 'Failed to update therapist status.');
    } finally {
      setActionBusyId(null);
    }
  };

  const handleRemoveClick = (therapist) => {
    setSelectedTherapist(therapist);
    setIsRemoveModalOpen(true);
  };

  const handleRemoveConfirm = async () => {
    setActionBusyId(selectedTherapist.id);
    try {
      await therapistApi.remove(selectedTherapist.id);
      await loadTherapists();
    } catch (err) {
      alert(err.message || 'Failed to remove therapist.');
    } finally {
      setActionBusyId(null);
      setIsRemoveModalOpen(false);
    }
  };

  const filteredTherapists = approvedTherapists.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.specialty.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty =
      specialtyFilter === '' ||
      t.specialty === specialtyFilter;

    const matchesAvailability =
      availabilityFilter === '' ||
      t.availability === availabilityFilter;

    return (
      matchesSearch &&
      matchesSpecialty &&
      matchesAvailability
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'var(--success)';
      case 'Busy': return 'var(--warning)';
      default: return 'var(--error)';
    }
  };

  const handleAddTherapist = async () => {

    if (
      !newName ||
      !newSpecialty ||
      !newQualification ||
      !newExperience ||
      !newEmail ||
      !newPhone ||
      !newPassword
    ) {
      alert('Please fill all fields');
      return;
    }

    try {
      await authApi.register({
        name: newName,
        email: newEmail,
        password: newPassword,
        role: 'therapist',
        phone: newPhone,
        specialty: newSpecialty,
        qualification: newQualification,
        experience: newExperience,
      });
      await loadTherapists();
    } catch (err) {
      alert(err.message || 'Failed to add therapist.');
      return;
    }

    setIsAddModalOpen(false);

    setNewName('');
    setNewSpecialty('');
    setNewQualification('');
    setNewExperience('');
    setNewEmail('');
    setNewPhone('');
    setNewPassword('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Our Therapists</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Find and manage therapy professionals.</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            + Add Therapist
          </Button>
        </div>

        {pendingTherapists.length > 0 && (
          <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '4px solid var(--warning)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} color="var(--warning)" />
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                Registration Requests ({pendingTherapists.length})
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              New therapist accounts cannot sign in until you verify and approve them.
            </p>

            {pendingTherapists.map((therapist) => (
              <div
                key={therapist.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  padding: '1rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-main)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{therapist.name}</h3>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.125rem 0.625rem',
                      borderRadius: '999px',
                      color: therapist.status === 'Pending' ? 'var(--warning)' : 'var(--error)',
                      backgroundColor: therapist.status === 'Pending' ? 'rgba(245, 158, 11, 0.12)' : 'var(--error-bg)'
                    }}>
                      {therapist.status}
                    </span>
                  </div>
                  <p style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 500 }}>
                    {therapist.specialty} · {therapist.qualification} · {therapist.experience} yrs experience
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                    {therapist.email} · {therapist.phone}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Button
                    style={{ backgroundColor: 'var(--success)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                    disabled={actionBusyId === therapist.id}
                    onClick={() => handleStatusChange(therapist, 'Approved')}
                  >
                    <CheckCircle size={16} /> Approve
                  </Button>
                  {therapist.status === 'Pending' ? (
                    <Button
                      style={{ backgroundColor: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                      disabled={actionBusyId === therapist.id}
                      onClick={() => handleStatusChange(therapist, 'Rejected')}
                    >
                      <XCircle size={16} /> Reject
                    </Button>
                  ) : (
                    <Button
                      style={{ backgroundColor: '#ef4444', color: 'white' }}
                      disabled={actionBusyId === therapist.id}
                      onClick={() => handleRemoveClick(therapist)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </Card>
        )}

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              placeholder="Search therapists..."
              className="input-field"
              style={{ paddingLeft: '2.5rem', width: '100%' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input-field"
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            style={{ minWidth: '220px', width: 'auto' }}
          >
            <option value="">All Specialties</option>
            <option value="Clinical Psychologist">Clinical Psychologist</option>
            <option value="Psychiatrist">Psychiatrist</option>
            <option value="Couples Therapist">Couples Therapist</option>
            <option value="Child Psychologist">Child Psychologist</option>
            <option value="Cognitive Behavioral Therapist">
              Cognitive Behavioral Therapist
            </option>
            <option value="Addiction Counselor">Addiction Counselor</option>
            <option value="Clinical Social Worker">Clinical Social Worker</option>
            <option value="Family Therapist">Family Therapist</option>
          </select>

          <select
            className="input-field"
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            style={{ minWidth: '180px', width: 'auto' }}
          >
            <option value="">All Status</option>
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {filteredTherapists.map(therapist => (
          <Card key={therapist.id} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <Avatar name={therapist.name} src={therapist.image} size={64} />
                <span className={therapist.availability === 'Available' ? 'pulse-success' : ''} style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: '14px', height: '14px', borderRadius: '50%',
                  backgroundColor: getStatusColor(therapist.availability),
                  border: '2px solid var(--bg-surface)'
                }}></span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{therapist.name}</h3>
                <p style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 500 }}>{therapist.specialty}</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Rating</p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                  <Star size={16} fill="#F59E0B" color="#F59E0B" />
                  {therapist.rating}
                </p>
              </div>
              <div style={{ width: '1px', backgroundColor: 'var(--border)' }}></div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Patients</p>
                <p style={{ fontWeight: 600 }}>{therapist.patientsCount}</p>
              </div>
              <div style={{ width: '1px', backgroundColor: 'var(--border)' }}></div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Status</p>
                <p style={{
                  fontWeight: 600,
                  color: getStatusColor(therapist.availability)
                }}>
                  {therapist.availability}
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '0.75rem'
              }}
            >
              <Button
                variant="outline"
                style={{ flex: 1 }}
                onClick={() => navigate(`/therapists/${therapist.id}`)}
              >
                View Profile
              </Button>

              <Button
                style={{
                  flex: 1,
                  backgroundColor: '#ef4444',
                  color: 'white'
                }}
                onClick={() => handleRemoveClick(therapist)}
              >
                Remove Therapist
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {!isLoading && filteredTherapists.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
          <p>No therapists found matching your search.</p>
        </div>
      )}
      <Modal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        title="Remove Therapist"
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <p>
            Are you sure you want to remove{" "}
            <strong>{selectedTherapist?.name}</strong>? This also deletes their
            login account.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem'
            }}
          >
            <Button
              variant="outline"
              onClick={() => setIsRemoveModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              disabled={actionBusyId === selectedTherapist?.id}
              onClick={handleRemoveConfirm}
            >
              Yes, Remove
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Therapist"
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <input
            className="input-field"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <input
            className="input-field"
            placeholder="Specialty"
            value={newSpecialty}
            onChange={(e) => setNewSpecialty(e.target.value)}
          />

          <input
            className="input-field"
            placeholder="Qualification"
            value={newQualification}
            onChange={(e) => setNewQualification(e.target.value)}
          />

          <input
            className="input-field"
            placeholder="Experience"
            value={newExperience}
            onChange={(e) => setNewExperience(e.target.value)}
          />

          <input
            className="input-field"
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />

          <input
            className="input-field"
            placeholder="Phone"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
          />

          <input
            className="input-field"
            type="password"
            placeholder="Login Password (min 6 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Button onClick={handleAddTherapist}>
            Save Therapist
          </Button>
        </div>
      </Modal>

    </div>
  );
};

export default TherapistsManagement;
