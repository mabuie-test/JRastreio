import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar     from './components/Sidebar';
import Login       from './components/Login';
import Dashboard   from './pages/Dashboard';
import TenantList  from './pages/TenantList';
import TenantForm  from './pages/TenantForm';
import UserList    from './pages/UserList';
import DeviceList  from './pages/DeviceList';
import DeviceForm  from './pages/DeviceForm';   // ← import corrigido
import MapView     from './components/MapView';
import History     from './components/History';

export default function App() {
  const token = localStorage.getItem('token');
  if (!token) return <Login onLogin={() => window.location.reload()} />;

  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/tenants" element={<TenantList />} />
            <Route path="/tenants/new" element={<TenantForm />} />
            <Route path="/tenants/:id" element={<TenantForm />} />

            <Route path="/users" element={<UserList />} />

            <Route path="/devices" element={<DeviceList />} />
            {/* STATIC before DYNAMIC */}
            <Route path="/devices/new" element={<DeviceForm />} />
            <Route path="/devices/:id" element={<DeviceForm />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
