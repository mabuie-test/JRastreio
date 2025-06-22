import React,{useState,useEffect} from 'react';
import axios from 'axios';
import {useNavigate,useParams} from 'react-router-dom';

export default function TenantForm() {
  const {id}=useParams();
  const [form,setForm]=useState({
    name:'',contactEmail:'',plan:'basic',adminUserId:''
  });
  const [users,setUsers]=useState([]);
  const nav=useNavigate();
  useEffect(()=>{
    axios.get(`${import.meta.env.VITE_API_URL}/api/users`,{
      headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}
    })
    .then(r=>setUsers(r.data)).catch(console.error);
    if(id){
      axios.get(`${import.meta.env.VITE_API_URL}/api/tenants/${id}`,{
        headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}
      })
      .then(r=>setForm({
        name:r.data.name,contactEmail:r.data.contactEmail,
        plan:r.data.plan,adminUserId:r.data.adminUser?._id||''
      })).catch(console.error);
    }
  },[id]);
  const handle=e=>setForm(f=>({...f,[e.target.name]:e.target.value}));
  const submit=e=>{
    e.preventDefault();
    const url = id?`${import.meta.env.VITE_API_URL}/api/tenants/${id}`:`${import.meta.env.VITE_API_URL}/api/tenants`;
    const m = id?'put':'post';
    axios[m](url,form,{headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}})
    .then(()=>nav('/tenants')).catch(err=>alert(err.response?.data?.error||err.message));
  };
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{id?'Editar':'Novo'} Tenant</h1>
      <form onSubmit={submit} className="max-w-md space-y-4">
        <label className="block">
          Nome
          <input name="name" value={form.name} onChange={handle}
            className="w-full border p-2 rounded" required/>
        </label>
        <label className="block">
          Email de Contacto
          <input name="contactEmail" type="email" value={form.contactEmail} onChange={handle}
            className="w-full border p-2 rounded" required/>
        </label>
        <label className="block">
          Plano
          <select name="plan" value={form.plan} onChange={handle}
            className="w-full border p-2 rounded">
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>
        </label>
        <label className="block">
          Administrador
          <select name="adminUserId" value={form.adminUserId} onChange={handle}
            className="w-full border p-2 rounded" required={!id}>
            <option value="">Selecione um usuário</option>
            {users.map(u=>(
              <option key={u._id} value={u._id}>{u.username}</option>
            ))}
          </select>
        </label>
        <button type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Guardar
        </button>
      </form>
    </div>
  );
}
