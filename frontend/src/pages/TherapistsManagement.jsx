import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { mockTherapists } from '../data/mockData';
import { Search, Star, Filter } from 'lucide-react';

const TherapistsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTherapists = mockTherapists.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return 'var(--success)';
      case 'Busy': return 'var(--warning)';
      default: return 'var(--error)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Our Therapists</h1>
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
          <Button variant="outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} />
            Filter
          </Button>
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

            <Button variant="outline" className="w-full">View Profile</Button>
          </Card>
        ))}
      </div>
      
      {filteredTherapists.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
          <p>No therapists found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default TherapistsManagement;
