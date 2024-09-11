"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@crossmint/client-sdk-react-ui";
import Layout from "../../components/Layout";

export default function CreateEvent() {
  const [newEvent, setNewEvent] = useState({ name: '', date: '', location: '', image: '', capacity: '', paymentAmount: '', paymentCurrency: 'USDC', recipientAddress: '', fee: '' });
  const router = useRouter();
  const { wallet, status } = useWallet();

  useEffect(() => {
    if (status === "loaded" && wallet) {
      setNewEvent(prevEvent => ({ ...prevEvent, recipientAddress: wallet.address }));
    }
  }, [status, wallet]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });
      const data = await response.json();
      console.log(data);
      // Redirect to the create-ticket page for this specific event
      router.push(`/events/${data.collection.id}/tickets/create`);
    } catch (error) {
      console.error('Error creating event:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg w-full max-w-2xl">
          <h1 className="text-white text-center text-xl mb-6">Create Event</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 mb-2">Event Name</label>
            <input
              type="text"
              name="name"
              placeholder="i.e. Taylor Swift Eras Tour, United Airlines ticket"
              value={newEvent.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Event Date</label>
            <input
              type="date"
              name="date"
              value={newEvent.date}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Event Location</label>
            <input
              type="text"
              name="location"
              placeholder="Event Location"
              value={newEvent.location}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Event Image URL</label>
            <input
              type="text"
              name="image"
              placeholder="Event Image URL"
              value={newEvent.image}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-md"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 mb-2">Payment Settings</label>
              <div className="flex">
                <input
                  type="number"
                  name="paymentAmount"
                  placeholder="0"
                  value={newEvent.paymentAmount}
                  onChange={handleInputChange}
                  className="w-2/3 px-4 py-2 bg-gray-700 text-gray-200 rounded-l-md"
                  required
                />
                <select
                  name="paymentCurrency"
                  value={newEvent.paymentCurrency}
                  onChange={handleInputChange}
                  className="w-1/3 px-4 py-2 bg-gray-700 text-gray-200 rounded-r-md"
                  required
                >
                  <option value="USDC">USDC</option>
                  <option value="ETH">ETH</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Event Capacity</label>
              <input
                type="number"
                name="capacity"
                placeholder="i.e. 2,000"
                value={newEvent.capacity}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-md"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 mb-2 flex items-center">
              Fee <span className="ml-2 text-gray-500 cursor-pointer">ℹ️</span>
            </label>
            <input
              type="number"
              name="fee"
              placeholder="i.e. 5%"
              value={newEvent.fee}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-md"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 mb-2">Recipient Address</label>
              <input
                type="text"
                name="recipientAddress"
                placeholder="Recipient Address"
                value={newEvent.recipientAddress}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-md"
                required
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Release Date</label>
              <input
                type="date"
                name="releaseDate"
                value={newEvent.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-md"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md">Next</button>
          </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}