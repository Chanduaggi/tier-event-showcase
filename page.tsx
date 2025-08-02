'use client';
import { currentUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const tiers = ['free', 'silver', 'gold', 'platinum'];
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userTier, setUserTier] = useState('free');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await currentUser();
        const tier = user?.publicMetadata?.tier || 'free';
        setUserTier(tier);

        const allowedTiers = tiers.slice(0, tiers.indexOf(tier) + 1);

        const { data, error } = await supabase
          .from('events')
          .select('*')
          .in('tier', allowedTiers)
          .order('event_date');

        if (error) throw error;

        setEvents(data);
      } catch (err) {
        setError('Failed to load events.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading events...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Events for {userTier}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="p-4 border rounded shadow">
            <img src={event.image_url || '/placeholder.jpg'} className="w-full h-40 object-cover rounded" />
            <h2 className="text-xl font-semibold mt-2">{event.title}</h2>
            <p className="text-sm text-gray-600">{new Date(event.event_date).toLocaleDateString()}</p>
            <p className="mt-2 text-gray-700">{event.description}</p>
            <span className="inline-block mt-3 px-2 py-1 rounded bg-blue-200 text-sm">{event.tier}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 

'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const tierLevel = {
  free: 1,
  silver: 2,
  gold: 3,
  platinum: 4
}

export default function EventsPage() {
  const { user } = useUser()
  const [events, setEvents] = useState([])

  const userTier: keyof typeof tierLevel = (user?.publicMetadata?.tier as any) || 'free'

  useEffect(() => {
    const loadEvents = async () => {
      const { data, error } = await supabase.from('events').select('*')

      if (!error && data) {
        const filtered = data.filter(
          (e: any) => tierLevel[e.tier] <= tierLevel[userTier]
        )
        setEvents(filtered)
      }
    }

    if (user) loadEvents()
  }, [user])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Events for {userTier} Tier</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((e: any) => (
          <div key={e.id} className="bg-white rounded-xl shadow-md p-4">
            <img src={e.image_url} alt={e.title} className="rounded w-full h-40 object-cover" />
            <h2 className="text-xl font-semibold mt-2">{e.title}</h2>
            <p className="text-gray-600">{e.description}</p>
            <p className="text-sm text-gray-500">{new Date(e.event_date).toLocaleString()}</p>
            <span className="inline-block mt-2 px-3 py-1 text-sm bg-gray-200 rounded-full">{e.tier.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

