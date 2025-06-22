import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapView from '../components/MapView';
import History from '../components/History';

export default function Dashboard() {
  const [devices,setDevices] = useState([]);
  const [sel,setSel] = useState(null);

  useEffect(()=>{
    axios.get(`${import.meta.env.VITE_API_URL}/api/devices`,{
      headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}
    })
    .then(r=>setDevices(r.data))
    .catch(console.error);
  },[]);

  return (
    <div className="flex h-full">
      <aside className="w-64 bg-white p-4 border-r overflow-auto">
        <h2 className="text-lg font-bold mb-4">Selecione Dispositivo</h2>
        <ul>
          {devices.map(d=>(
            <li key={d._id} className="mb-2">
              <button className={`w-full text-left p-2 rounded ${
                sel?.imei===d.imei?'bg-blue-100':'hover:bg-gray-100'
              }`} onClick={()=>setSel(d)}>
                {d.label||d.imei}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 flex flex-col h-full">
        <div className="flex-1 flex h-full">
          <MapView device={sel}/>
          <History device={sel}/>
        </div>
      </main>
    </div>
  );
}
