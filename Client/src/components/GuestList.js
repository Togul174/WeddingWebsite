import React, { useEffect, useState } from 'react';

function GuestList() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/guest-list')
      .then(res => {
        if (!res.ok) throw new Error('Ошибка сети');
        return res.json();
      })
      .then(data => {
        setGuests(data.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      <h2>Список гостей</h2>
      {guests.length === 0 ? (
        <p>Гости не найдены</p>
      ) : (
        <ul>
          {guests.map((guest, idx) => (
            <li key={idx}>{guest.name} — {guest.phone}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GuestList;