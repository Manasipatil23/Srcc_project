import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { therapistApi, scheduleApi, appointmentApi } from '../services/api';

const SchedulePatient = () => {
  const [therapists, setTherapists] = useState([]);
  const [slotsByTherapist, setSlotsByTherapist] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [contact, setContact] = useState('');
  const [patientType, setPatientType] = useState('');
  const [therapist, setTherapist] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [scheduled, setScheduled] = useState(false);

  useEffect(() => {
    Promise.all([therapistApi.getAll(), scheduleApi.getTherapistSlots()])
      .then(([therapistData, slotData]) => {
        setTherapists(therapistData);
        setSlotsByTherapist(slotData);
      })
      .catch(() => {
        setTherapists([]);
        setSlotsByTherapist({});
      })
      .finally(() => setIsLoading(false));
  }, []);

  const selectedTherapist = therapists.find((t) => t.id === therapist);

  const selectedSlots =
    selectedTherapist && date
      ? slotsByTherapist[selectedTherapist.name] || []
      : [];

  const handleSchedule = async () => {
    if (
      !patientName ||
      !age ||
      !contact ||
      !patientType ||
      !therapist ||
      !date ||
      !time
    ) {
      alert('Please fill all fields');
      return;
    }

    setIsBooking(true);
    try {
      await appointmentApi.book({
        therapistId: therapist,
        patientName,
        date,
        time,
        type: patientType
      });
      setScheduled(true);

      // Refresh slot availability so the booked slot shows as FULL
      scheduleApi
        .getTherapistSlots()
        .then(setSlotsByTherapist)
        .catch(() => {});
    } catch (err) {
      alert(err.message || 'Failed to schedule appointment.');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return <h2>Loading therapists...</h2>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        maxWidth: '900px'
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
          Schedule Patient
        </h1>

        <p style={{ color: 'var(--text-secondary)' }}>
          Create appointments for walk-in, emergency, and regular patients.
        </p>
      </div>

      <Card style={{ padding: '2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}
        >
          <input
            className="input-field"
            placeholder="Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />

          <input
            className="input-field"
            placeholder="Age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <input
            className="input-field"
            placeholder="Contact Number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />

          <select
            className="input-field"
            value={patientType}
            onChange={(e) => setPatientType(e.target.value)}
          >
            <option value="">Select Patient Type</option>
            <option value="Walk-In">Walk-In</option>
            <option value="Emergency">Emergency</option>
            <option value="Regular">Regular</option>
          </select>

          <select
            className="input-field"
            value={therapist}
            onChange={(e) => {
              setTherapist(e.target.value);
              setTime('');
            }}
          >
            <option value="">Select Therapist</option>

            {therapists.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <div style={{ gridColumn: '1 / span 2' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600'
              }}
            >
              Appointment Date
            </label>

            <input
              type="date"
              className="input-field"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
            />

            <label
              style={{
                display: 'block',
                marginTop: '1rem',
                marginBottom: '0.5rem',
                fontWeight: '600'
              }}
            >
              Select Time Slot
            </label>

            {!therapist || !date ? (
              <div
                style={{
                  padding: '1rem',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  color: '#64748b'
                }}
              >
                Please select therapist and appointment date first.
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.75rem'
                }}
              >
                {selectedSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setTime(slot.time)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',

                      border:
                        time === slot.time
                          ? '2px solid var(--primary)'
                          : '1px solid var(--border)',

                      backgroundColor: slot.available
                        ? '#dcfce7'
                        : '#fee2e2',

                      color: slot.available
                        ? '#166534'
                        : '#991b1b',

                      cursor: slot.available
                        ? 'pointer'
                        : 'not-allowed'
                    }}
                  >
                    <div>{slot.time}</div>

                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginTop: '4px'
                      }}
                    >
                      {slot.available ? 'AVL' : 'FULL'}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <Button onClick={handleSchedule} disabled={isBooking}>
            {isBooking ? 'Scheduling...' : 'Schedule Patient'}
          </Button>
        </div>
      </Card>

      {scheduled && (
        <Card
          style={{
            padding: '2rem',
            borderLeft: '4px solid var(--success)'
          }}
        >
          <h3
            style={{
              color: 'var(--success)',
              marginBottom: '1rem'
            }}
          >
            ✓ Appointment Scheduled Successfully
          </h3>

          <p>
            <strong>Patient:</strong> {patientName}
          </p>

          <p>
            <strong>Type:</strong> {patientType}
          </p>

          <p>
            <strong>Therapist:</strong> {selectedTherapist?.name}
          </p>

          <p>
            <strong>Date:</strong> {date}
          </p>

          <p>
            <strong>Time:</strong> {time}
          </p>
        </Card>
      )}
    </div>
  );
};

export default SchedulePatient;