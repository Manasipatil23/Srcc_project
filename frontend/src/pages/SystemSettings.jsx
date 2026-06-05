import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const SystemSettings = () => {
    const [hospitalName, setHospitalName] = useState('SRCC Children Hospital');
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);

    const handleSave = () => {
        alert('Settings Saved Successfully');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1
                    style={{
                        fontSize: '1.75rem',
                        fontWeight: 'bold',
                        marginBottom: '0.5rem'
                    }}
                >
                    System Settings
                </h1>

                <p style={{ color: 'var(--text-secondary)' }}>
                    Manage hospital preferences and notification settings.
                </p>
            </div>

            <Card style={{ padding: '2rem' }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem'
                    }}
                >
                    <div>
                        <label>Hospital Name</label>

                        <input
                            className="input-field"
                            value={hospitalName}
                            onChange={(e) => setHospitalName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={emailNotifications}
                                onChange={() =>
                                    setEmailNotifications(!emailNotifications)
                                }
                            />
                            {' '}Enable Email Notifications
                        </label>
                    </div>

                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={smsNotifications}
                                onChange={() =>
                                    setSmsNotifications(!smsNotifications)
                                }
                            />
                            {' '}Enable SMS Notifications
                        </label>
                    </div>

                    <Button onClick={handleSave}>
                        Save Settings
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default SystemSettings;