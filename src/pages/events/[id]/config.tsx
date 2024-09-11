"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { useWallet } from "@crossmint/client-sdk-react-ui";

export default function EventConfig() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { wallet } = useWallet();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [royaltiesEnabled, setRoyaltiesEnabled] = useState(false);
  const [basisPoints, setBasisPoints] = useState(0);

  useEffect(() => {
    if (params) {
      fetch(`/api/events/${params.id}`)
        .then(response => response.json())
        .then(data => {
          setEvent(data);
          if (data.royalties) {
            setRoyaltiesEnabled(true);
            setBasisPoints(data.royalties.basisPoints);
          }
        })
        .catch(error => console.error('Error fetching event:', error));
    }
  }, [params]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedEvent = {
      ...event,
      royalties: royaltiesEnabled ? { basisPoints, address: wallet?.address } : null,
    };
    fetch(`/api/events/${params.id}/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEvent),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update event');
        }
        return response.json();
      })
      .then(data => {
        router.push(`/events/${params.id}`);
      })
      .catch(error => {
        setError(error.message);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoyaltiesEnabled(e.target.checked);
  };

  const handleBasisPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBasisPoints(parseFloat(e.target.value));
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <h1>Event Configuration</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <label className="flex flex-col">
          <span>Event Name</span>
          <input
            type="text"
            name="name"
            value={event.name}
            onChange={handleInputChange}
            className="border p-2 rounded bg-gray-100"
          />
        </label>
        <label className="flex flex-col">
          <span>Event Date</span>
          <input
            type="date"
            name="date"
            value={event.date}
            onChange={handleInputChange}
            className="border p-2 rounded bg-gray-100"
          />
        </label>
        <label className="flex flex-col">
          <span>Event Location</span>
          <input
            type="text"
            name="location"
            value={event.location}
            onChange={handleInputChange}
            className="border p-2 rounded bg-gray-100"
          />
        </label>
        <label className="flex flex-col">
          <span>Event Image URL</span>
          <input
            type="text"
            name="image"
            value={event.image}
            onChange={handleInputChange}
            className="border p-2 rounded bg-gray-100"
          />
        </label>
        <label className="flex flex-col">
          <span>Event Capacity</span>
          <input
            type="number"
            name="capacity"
            value={event.capacity}
            onChange={handleInputChange}
            className="border p-2 rounded bg-gray-100"
          />
        </label>
        <div className="flex flex-col">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={royaltiesEnabled}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <span>Enable Royalties</span>
          </label>
          {royaltiesEnabled && (
            <label className="flex flex-col mt-2">
              <span>Basis Points</span>
              <input
                type="number"
                step="0.01"
                value={basisPoints}
                onChange={handleBasisPointsChange}
                className="border p-2 rounded bg-gray-100"
              />
              <div className="mt-4"><Wallet /></div>
            </label>
          )}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Save
        </button>
      </form>
    </Layout>
  );
}

function Wallet() {
    const { wallet, status, error } = useWallet();
  
    return (
      <div>
        {status === "loading-error" && error && (
          <div className="border-2 border-red-500 text-red-500 font-bold py-4 px-8 rounded-lg">
            Error: {error.message}
          </div>
        )}
        {status === "in-progress" && (
          <div className="border-2 border-yellow-500 text-yellow-500 font-bold py-4 px-8 rounded-lg">
            Loading...
          </div>
        )}
        {status === "loaded" && wallet && (
          <div className="border-2 border-green-500 text-green-500 font-bold py-4 px-8 rounded-lg">
            Wallet: {wallet.address}
          </div>
        )}
        {status === "not-loaded" && (
          <div className="border-2 border-gray-500 text-gray-500 font-bold py-4 px-8 rounded-lg">
            Wallet not loaded
          </div>
        )}
      </div>
    );
  }
  