import { useState, useEffect } from 'react';
import { getUpcomingEvents } from '../api';
import './CountdownBanner.css';

function getTimeLeft(targetDate) {
  const diff = new Date(targetDate) - new Date();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const pad = (n) => String(n).padStart(2, '0');

export default function CountdownBanner() {
  const [event, setEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 14, minutes: 48, seconds: 18 });

  useEffect(() => {
    getUpcomingEvents()
      .then(res => {
        if (res.data.length > 0) setEvent(res.data[0]);
      })
      .catch(() => {
        setEvent({
          name: 'Davao Weekend Bazaar',
          discount_percent: 20,
          start_date: new Date(Date.now() + 4 * 86400000 + 14 * 3600000).toISOString(),
          venue: 'SM Lanang Premier, Davao City',
        });
      });
  }, []);

  useEffect(() => {
    if (!event) return;
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(event.start_date));
    }, 1000);
    return () => clearInterval(timer);
  }, [event]);

  if (!event) return null;

  return (
    <section className="countdown-banner on-dark">
      <div className="countdown-content">
        <h2 className="countdown-title">{event.name}</h2>
        <p className="countdown-subtitle">
          Get {event.discount_percent}% off · Limited Time Offer!
        </p>
        <div className="countdown-timer">
          <div className="time-block">
            <span className="time-value">{pad(timeLeft.days)}</span>
            <span className="time-label">Days</span>
          </div>
          <span className="time-sep" aria-hidden="true">:</span>
          <div className="time-block">
            <span className="time-value">{pad(timeLeft.hours)}</span>
            <span className="time-label">Hours</span>
          </div>
          <span className="time-sep" aria-hidden="true">:</span>
          <div className="time-block">
            <span className="time-value">{pad(timeLeft.minutes)}</span>
            <span className="time-label">Minutes</span>
          </div>
          <span className="time-sep" aria-hidden="true">:</span>
          <div className="time-block">
            <span className="time-value">{pad(timeLeft.seconds)}</span>
            <span className="time-label">Seconds</span>
          </div>
        </div>
        <button className="btn btn-ghost">Shop Now →</button>
      </div>
      <div className="countdown-image">
        <div className="countdown-image-placeholder">
          <span aria-hidden="true">🎪</span>
          <p>{event.venue}</p>
        </div>
      </div>
    </section>
  );
}
