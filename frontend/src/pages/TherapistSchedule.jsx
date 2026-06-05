import React from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import { mockTherapists, therapistSchedules } from '../data/mockData';

const TherapistSchedule = () => {
  const { id } = useParams();

  const therapist = mockTherapists.find(
    (t) => t.id === id
  );

  const schedule = therapistSchedules[id] || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1>
        {therapist?.name} Schedule
      </h1>

      <Card style={{ padding: '1.5rem' }}>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Patient</th>
            </tr>
          </thead>

          <tbody>
            {schedule.map((item, index) => (
              <tr key={index}>
                <td>{item.day}</td>
                <td>{item.time}</td>
                <td>{item.patient}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default TherapistSchedule;