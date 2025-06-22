import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Circle } from 'react-leaflet';
import { useSocket } from '../context/SocketContext';

export default function MapView({ device }) {
  const socket = useSocket();
  const [positions,setPositions] = useState([]);

  useEffect(() => {
    if (!device || !socket) return;
    const ch = `device:${device.imei}`;
    socket.emit('join', ch);
    socket.on(ch, d => {
      setPositions(p=>[...p,[d.lat,d.lng]]);
    });
    return ()=>socket.emit('leave', ch);
  },[device,socket]);

  if (!device) {
    return <div className="flex-1 flex items-center justify-center text-gray-500">
      Selecione um dispositivo
    </div>;
  }

  const center = positions.length
    ? positions[positions.length-1]
    : [device.geofence?.center.lat||0, device.geofence?.center.lng||0];

  return (
    <MapContainer center={center} zoom={15} className="flex-1 h-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      {positions.map((pos,i)=><Marker key={i} position={pos}/>)}
      <Polyline positions={positions}/>
      {device.geofence?.center && (
        <Circle center={[device.geofence.center.lat,device.geofence.center.lng]}
          radius={device.geofence.radius}/>
      )}
    </MapContainer>
  );
}
