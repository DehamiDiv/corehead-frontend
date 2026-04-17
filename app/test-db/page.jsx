'use client';
import { useEffect, useState } from 'react';

export default function TestDbPage() {
  const [dbTime, setDbTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/test-db')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDbTime(data.time);
        else setError('Failed to fetch DB time');
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Error connecting to backend');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading database time...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Database Time Test</h1>
      <p>Current database time is:</p>
      <code>{dbTime}</code>
    </div>
  );
}