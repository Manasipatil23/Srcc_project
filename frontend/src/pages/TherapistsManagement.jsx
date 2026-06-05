import React, { useState, useEffect } from 'react';
useEffect(() => {
  if (!localStorage.getItem('therapists')) {
    localStorage.setItem(
      'therapists',
      JSON.stringify(mockTherapists)
    );
  }
}, []);
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { mockTherapists } from '../data/mockData';
import { Search, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/ui/Modal';


const TherapistsManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [therapists, setTherapists] = useState(
    JSON.parse(localStorage.getItem('therapists')) ||
    mockTherapists
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newQualification, setNewQualification] = useState('');
  const [newExperience, setNewExperience] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleRemoveClick = (therapist) => {
    setSelectedTherapist(therapist);
    setIsRemoveModalOpen(true);
  };

  const filteredTherapists = therapists.filter((t) => {
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

  const handleAddTherapist = () => {

    if (
      !newName ||
      !newSpecialty ||
      !newQualification ||
      !newExperience ||
      !newEmail ||
      !newPhone
    ) {
      alert('Please fill all fields');
      return;
    }

    const newTherapist = {
      id: Date.now().toString(),
      name: newName,
      specialty: newSpecialty,
      qualification: newQualification,
      experience: Number(newExperience),
      email: newEmail,
      phone: newPhone,
      availability: 'Available',
      patientsCount: 0,
      rating: 0,
      image: 'https://i.pravatar.cc/150'
    };

    const updatedTherapists = [
      ...therapists,
      newTherapist
    ];

    setTherapists(updatedTherapists);

    localStorage.setItem(
      'therapists',
      JSON.stringify(updatedTherapists)
    );

    setIsAddModalOpen(false);

    setNewName('');
    setNewSpecialty('');
    setNewQualification('');
    setNewExperience('');
    setNewEmail('');
    setNewPhone('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '2rem'
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem'
                }}
              >
                Our Therapists
              </h1>
            </div>

            <Button
              style={{
                marginLeft: '34rem'
              }}
              onClick={() => {
                console.log("ADD CLICKED");
                setIsAddModalOpen(true);
              }}

            >
              + Add Therapist
            </Button>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>Find and manage therapy professionals.</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '250px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              placeholder="Search therapists..."
              className="input-field"
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input-field"
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            style={{ minWidth: '220px' }}
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
            style={{ minWidth: '180px' }}
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
                <img src={therapist.image} alt={therapist.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
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

      {filteredTherapists.length === 0 && (
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
            <strong>{selectedTherapist?.name}</strong>?
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
              onClick={() => {
                const updatedTherapists =
                  therapists.filter(
                    (t) => t.id !== selectedTherapist.id
                  );

                setTherapists(updatedTherapists);

                localStorage.setItem(
                  'therapists',
                  JSON.stringify(updatedTherapists)
                );

                setIsRemoveModalOpen(false);
              }}
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

          <Button onClick={handleAddTherapist}>
            Save Therapist
          </Button>
        </div>
      </Modal>

    </div>
  );
};

export default TherapistsManagement;
