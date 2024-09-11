"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";

export default function CreatorDashboard() {
  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/events')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  const handleEventClick = (id) => {
    router.push(`/events/${id}`);
  };

  return (
    <Layout>
      <h1>Creator Dashboard</h1>
      <button 
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
        onClick={() => router.push('/events/create')}
      >
        Create New Event
      </button>
      <div className="events-list">
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events.map(event => (
            <div key={event.id} className="event-item flex" onClick={() => handleEventClick(event.id)}>
              <img src={event.image} alt={event.name} className="event-image w-1/3" />
              <div className="event-details w-2/3 p-4">
                <h2 className="text-xl font-bold">{event.name}</h2>
                <p>Date: {event.date}</p>
                <p>Location: {event.location}</p>
                <p>Capacity: {event.capacity}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}