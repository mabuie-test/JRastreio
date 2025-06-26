import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function DeviceForm() {
  const { id } = useParams();
  const [form,setForm] = useState({
    imei:'', label:'', tenantId:'', owner:'', status:'active'
  });
  const [tenants,setTenants] = useState([]);
  const [users,setUsers]     = useState([]);
  const [role,setRole]       = useState(null);
  const nav = useNavigate();

  useEffect(()=>{
    const t = localStorage.getItem('token');
    if (!t) return;
    const p = JSON.parse(atob(t.split('.')[1]));
    setRole(p.role);
    if (p.role==='super-admin') {
      axios.get(`${import.meta.env.VITE_API_URL}/api/tenants`,{headers:{Authorization:`Bearer ${t}`}})
        .then(r=>setTenants(r.data)).catch(console.error);
      axios.get(`${import.meta.env.VITE_API_URL}/api/users`,{headers:{Authorization:`Bearer ${t}`}})
        .then(r=>setUsers(r.data)).catch(console.error);
    } else {
      setForm(f=>({...f,tenantId:p.tenantId}));
      axios.get(`${import.meta.env.VITE_API_URL}/api/users`,{headers:{Authorization:`Bearer ${t}`}})
        .then(r=>setUsers(r.data)).catch(console.error);
    }
  },[]);

  useEffect(()=>{
    if (!id) return;
    axios.get(`${import.meta.env.VITE_API_URL}/api/devices/${id}`,{
      headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}
    })
    .then(r=>setForm({
      imei:r.data.imei,label:r.data.label,
      tenantId:r.data.tenantId,owner:r.data.owner?._id||'',
      status:r.data.status
    })).catch(console.error);
  },[id]);

  const handleChange=e=>{
    const {name,value}=e.target;
    setForm(f=>({...f,[name]:value}));
  };

  const handleSubmit=e=>{
    e.preventDefault();
    const m = id?'put':'post';
    const url = `${import.meta.env.VITE_API_URL}/api/devices${id?`/${id}`:''}`;
    axios[m](url,form,{headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}})
    .then(()=>nav('/devices'))
    .catch(err=>{
      console.error(err);
      alert('Falha ao guardar: '+(err.response?.data?.error||err.message));
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{id?'Editar':'Novo'} Dispositivo</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        {role==='super-admin' && (
          <label className="block">
            Tenant
            <select name="tenantId" value={form.tenantId} onChange={handleChange}
              className="w-full border p-2 rounded" required>
              <option value="">Selecione um Tenant</option>
              {tenants.map(t=>(
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          </label>
        )}
        <label className="block">
          IMEI
          <input name="imei" value={form.imei} onChange={handleChange}
            className="w-full border p-2 rounded" required/>
        </label>
        <label className="block">
          Label
          <input name="label" value={form.label} onChange={handleChange}
            className="w-full border p-2 rounded"/>
        </label>
        {id && (
          <label className="block">
            Status
            <select name="status" value={form.status} onChange={handleChange}
              className="w-full border p-2 rounded">
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </label>
        )}
        <label className="block">
          Dono do Veículo
          <select name="owner" value={form.owner} onChange={handleChange}
            className="w-full border p-2 rounded" required>
            <option value="">Selecione um utilizador</option>
            {users.map(u=>(
              <option key={u._id} value={u._id}>{u.username}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Guardar
        </button>
      </form>
    </div>
  );
}
