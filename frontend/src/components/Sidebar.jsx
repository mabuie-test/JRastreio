import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const [role,setRole] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) {
      const p = JSON.parse(atob(t.split('.')[1]));
      setRole(p.role);
    }
  }, []);

  const links = [
    { to:'/dashboard', label:'Painel de controlo', roles:['super-admin','admin','user'] },
    { to:'/tenants',   label:'Tenants',   roles:['super-admin'] },
    { to:'/users',     label:'Utilizadores', roles:['super-admin','admin'] },
    { to:'/devices',   label:'Dispositivos', roles:['super-admin','admin','user'] }
  ];

  return (
    <aside className="w-64 bg-gray-100 p-4 overflow-auto">
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      {links.filter(l=>l.roles.includes(role)).map(l=>(
        <NavLink
          key={l.to}
          to={l.to}
          className={({isActive})=>`block p-2 mb-2 rounded ${isActive?'bg-blue-200':'hover:bg-gray-200'}`}
        >
          {l.label}
        </NavLink>
      ))}
    </aside>
  );
}
