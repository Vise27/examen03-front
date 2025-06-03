// src/components/admin/AdminLayout.jsx
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div>
      <h2>Panel de Administración</h2>
      <Outlet /> {/* Esto renderizará las rutas anidadas */}
    </div>
  );
}