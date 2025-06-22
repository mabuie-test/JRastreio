import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function History({ device }) {
  const [history,setHistory] = useState([]);

  useEffect(()=>{
    if (!device) return;
    axios.get(`${import.meta.env.VITE_API_URL}/api/track/history`, {
      params:{ deviceId: device._id },
      headers:{ Authorization:`Bearer ${localStorage.getItem('token')}` }
    })
    .then(r=>setHistory(r.data))
    .catch(console.error);
  },[device]);

  return (
    <div className="w-64 bg-white p-4 overflow-auto">
      <h2 className="text-lg mb-4">Histórico</h2>
      <ul>
        {history.map(h=>(
          <li key={h._id} className="mb-2 text-sm">
            {new Date(h.timestamp).toLocaleString()}<br/>
            Lat: {h.latitude.toFixed(5)}, Lng: {h.longitude.toFixed(5)}
          </li>
        ))}
      </ul>
    </div>
  );
}
