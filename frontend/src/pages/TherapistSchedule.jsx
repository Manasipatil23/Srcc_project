import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import { therapistApi, scheduleApi } from '../services/api';

const TherapistSchedule = () => {
  const { id } = useParams();

  const [therapist, setTherapist] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([therapistApi.getById(id), scheduleApi.getWeeklySchedules()])
      .then(([therapistData, weeklySchedules]) => {
        setTherapist(therapistData);
        setSchedule(weeklySchedules[id] || []);
      })
      .catch(() => {
        setTherapist(null);
        setSchedule([]);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <h2>Loading schedule...</h2>;
  }

  if (!therapist) {
    return <h2>Therapist not found</h2>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1>
        {therapist?.name} Schedule
      </h1>

      <Card style={{ padding: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Day</th>
              <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Time</th>
              <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Patient</th>
            </tr>
          </thead>

          <tbody>
            {schedule.length > 0 ? (
              schedule.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem 0.5rem' }}>{item.day}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>{item.time}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>{item.patient}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
                  No schedule available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default TherapistSchedule;