import React from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { mockTherapists } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/ui/Modal';
import { useState } from 'react';

const TherapistProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const storedTherapists =
    JSON.parse(localStorage.getItem('therapists')) ||
    mockTherapists;

  const originalTherapist =
    storedTherapists.find((t) => t.id === id);

  const [therapist, setTherapist] = useState(originalTherapist);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [editedTherapist, setEditedTherapist] = useState({
    name: therapist?.name || '',
    specialty: therapist?.specialty || '',
    email: therapist?.email || '',
    phone: therapist?.phone || '',
    qualification: therapist?.qualification || '',
    experience: therapist?.experience || ''
  });

  if (!therapist) {
    return <h2>Therapist not found</h2>;
  }

  const handleSave = () => {
    const updatedTherapist = {
      ...therapist,
      ...editedTherapist
    };

    setTherapist(updatedTherapist);

    const storedTherapists =
      JSON.parse(localStorage.getItem('therapists')) ||
      mockTherapists;

    const updatedTherapists =
      storedTherapists.map((t) =>
        t.id === therapist.id
          ? updatedTherapist
          : t
      );

    localStorage.setItem(
      'therapists',
      JSON.stringify(updatedTherapists)
    );

    setIsEditModalOpen(false);

    alert('Therapist updated successfully');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
        Therapist Profile
      </h1>

      <Card style={{ padding: '2rem' }}>
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center'
          }}
        >
          <img
            src={therapist.image}
            alt={therapist.name}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%'
            }}
          />

          <div>
            <h2>{therapist.name}</h2>
            <p>{therapist.specialty}</p>
            <p>Rating: {therapist.rating}</p>
            <p>Patients: {therapist.patientsCount}</p>
            <p>Status: {therapist.availability}</p>
          </div>
        </div>

        <div
          style={{
            marginTop: '2rem',
            display: 'flex',
            gap: '1rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >
            <Button onClick={() => navigate(`/therapists/${therapist.id}/schedule`)}> View Schedule </Button>

            <Button variant="outline"> Contact Therapist </Button>

            <Button
              style={{
                backgroundColor: 'var(--primary)',
                color: 'white'
              }}
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Therapist
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Therapist"
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
            value={editedTherapist.name}
            onChange={(e) =>
              setEditedTherapist({
                ...editedTherapist,
                name: e.target.value
              })
            }
            placeholder="Name"
          />

          <input
            className="input-field"
            value={editedTherapist.specialty}
            onChange={(e) =>
              setEditedTherapist({
                ...editedTherapist,
                specialty: e.target.value
              })
            }
            placeholder="Specialty"
          />

          <input
            className="input-field"
            value={editedTherapist.qualification}
            onChange={(e) =>
              setEditedTherapist({
                ...editedTherapist,
                qualification: e.target.value
              })
            }
            placeholder="Qualification"
          />

          <input
            className="input-field"
            value={editedTherapist.experience}
            onChange={(e) =>
              setEditedTherapist({
                ...editedTherapist,
                experience: e.target.value
              })
            }
            placeholder="Experience"
          />

          <input
            className="input-field"
            value={editedTherapist.email}
            onChange={(e) =>
              setEditedTherapist({
                ...editedTherapist,
                email: e.target.value
              })
            }
            placeholder="Email"
          />

          <input
            className="input-field"
            value={editedTherapist.phone}
            onChange={(e) =>
              setEditedTherapist({
                ...editedTherapist,
                phone: e.target.value
              })
            }
            placeholder="Phone"
          />

          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </Modal>

    </div>
  );
};

export default TherapistProfile;