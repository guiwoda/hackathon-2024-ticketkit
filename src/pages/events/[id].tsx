"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";

export default function EventDetails() {
  const params = useParams<{ id: string }>();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (params) {
      fetch(`/api/events/${params.id}`)
        .then(response => response.json())
        .then(data => setEvent(data))
        .catch(error => console.error('Error fetching event:', error));
    }
  }, [params]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <h1>{event.name}</h1>
      <p>Date: {event.date}</p>
      <p>Location: {event.location}</p>
      <img src={event.image} alt={event.name} />
      <p>Capacity: {event.capacity}</p>
    </Layout>
  );
}