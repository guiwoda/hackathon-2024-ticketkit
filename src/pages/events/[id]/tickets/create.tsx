"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Layout from "../../../../components/Layout";

export default function CreateTicket() {
  const [ticket, setTicket] = useState({ name: '', supply: '', description: '', attributes: [{ key: '', value: '' }], image: '' });
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/events/${params.id}`)
        .then(response => response.json())
        .then(data => setEvent(data))
        .catch(error => console.error('Error fetching event:', error));
    }
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
    const { name, value } = e.target;
    if (name === 'key' || name === 'value') {
      const newAttributes = [...ticket.attributes];
      newAttributes[index!] = { ...newAttributes[index!], [name]: value };
      setTicket({ ...ticket, attributes: newAttributes });
    } else {
      setTicket({ ...ticket, [name]: value });
    }
  };

  const handleAddAttribute = () => {
    setTicket({ ...ticket, attributes: [...ticket.attributes, { key: '', value: '' }] });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/events/${params.id}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }

      const data = await response.json();
      console.log('Ticket created:', data);
      router.push(`/events/${params.id}`);
    } catch (error) {
      console.error('Error creating ticket:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg w-full max-w-2xl">
          <h1 className="text-white text-center text-xl mb-6">Create Ticket for {event.name}</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-400 mb-2">Ticket Name</label>
              <input
                type="text"
                name="name"
                placeholder="Ticket Name"
                value={ticket.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Supply</label>
              <input
                type="number"
                name="supply"
                placeholder="Supply"
                value={ticket.supply}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Description</label>
              <textarea
                name="description"
                placeholder="Description"
                value={ticket.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Attributes (optional)</label>
              {ticket.attributes.map((attribute, index) => (
                <div key={index} className="flex gap-4 mb-2">
                  <input
                    type="text"
                    name="key"
                    placeholder="Key"
                    value={attribute.key}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-1/2 px-4 py-2 bg-gray-700 text-gray-200 rounded-md"
                  />
                  <input
                    type="text"
                    name="value"
                    placeholder="Value"
                    value={attribute.value}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-1/2 px-4 py-2 bg-gray-700 text-gray-200 rounded-md"
                  />
                </div>
              ))}
              <button type="button" onClick={handleAddAttribute} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                Add Attribute
              </button>
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Image</label>
              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={ticket.image}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-md"
                required
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md">Create Ticket</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}