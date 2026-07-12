import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { therapistApi } from '../services/api';
import Avatar from '../components/ui/Avatar';

const TherapistProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [therapist, setTherapist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [editedTherapist, setEditedTherapist] = useState({
    name: '',
    specialty: '',
    email: '',
    phone: '',
    qualification: '',
    experience: ''
  });

  useEffect(() => {
    therapistApi
      .getById(id)
      .then((data) => {
        setTherapist(data);
        setEditedTherapist({
          name: data.name || '',
          specialty: data.specialty || '',
          email: data.email || '',
          phone: data.phone || '',
          qualification: data.qualification || '',
          experience: data.experience ?? ''
        });
      })
      .catch(() => setTherapist(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <h2>Loading therapist...</h2>;
  }

  if (!therapist) {
    return <h2>Therapist not found</h2>;
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await therapistApi.update(therapist.id, editedTherapist);
      setTherapist(updated);
      setIsEditModalOpen(false);
      alert('Therapist updated successfully');
    } catch (err) {
      alert(err.message || 'Failed to update therapist.');
    } finally {
      setIsSaving(false);
    }
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
          <Avatar name={therapist.name} src={therapist.image} size={120} />

          <div>
            <h2>{therapist.name}</h2>
            <p>{therapist.specialty}</p>
            <p>{therapist.qualification} · {therapist.experience} yrs experience</p>
            <p>{therapist.email} · {therapist.phone}</p>
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

            <Button variant="outline" onClick={() => window.location.href = `mailto:${therapist.email}`}> Contact Therapist </Button>

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

          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Modal>

    </div>
  );
};

export default TherapistProfile;
