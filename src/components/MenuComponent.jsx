import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function MenuComponent() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    const userData = userCookie ? JSON.parse(userCookie) : null;
    setUser(userData);
  }, []);

  if (
    user &&
    !(
      user.perfil === "Usuario" ||
      user.perfil === "Empleado" ||
      user.perfil === "Administrador" ||
      user.perfil === "Superadministrador"
    )
  ) {
    window.location.href = "/login";
    return null;
  }

  const menuByRole = {
    Usuario: [
      { name: "Inicio", href: "/" },
      { name: "Gestión de Personas", href: "/gestion-personas" },
    ],

    Empleado: [
      { name: "Inicio", href: "/" },
      { name: "Gestión de Personas", href: "/gestion-personas" },
    ],

    Administrador: [
      { name: "Inicio", href: "/" },
      { name: "Gestión de Personas", href: "/gestion-personas" },
      { name: "Gestión de Perfil", href: "/gestion-perfil" },
      { name: "Gestión de Usuarios", href: "/gestion-usuarios" },

      { name: "Gestión de Rutas", href: "/gestion-rutas" },
      { name: "Tipos de Actividad", href: "/gestion-actividades" },
      { name: "Gestión de Sitios", href: "/gestion-sitios" },
    ],

    Superadministrador: [
      { name: "Inicio", href: "/" },
      { name: "Gestión de Personas", href: "/gestion-personas" },
      { name: "Gestión de Perfil", href: "/gestion-perfil" },
      { name: "Gestión de Usuarios", href: "/gestion-usuarios" },

      { name: "Gestión de Rutas", href: "/gestion-rutas" },
      { name: "Tipos de Actividad", href: "/gestion-actividades" },
      { name: "Gestión de Sitios", href: "/gestion-sitios" },
    ],
  };

  const menuItems = user
    ? menuByRole[user.perfil] || []
    : [{ name: "Inicio", href: "/" }];

  return (
    <nav className="w-full h-fit px-8 py-4 border-b border-[#E9E4D8] flex justify-between items-center bg-white shadow-sm">
      <div className="text-2xl font-bold text-[#2E7D32]">Logo</div>

      <div className="flex gap-6 items-center">
        {menuItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-[#333333] hover:text-[#2E7D32] transition-colors font-medium"
          >
            {item.name}
          </a>
        ))}

        {user ? (
          <a
            href="/logout"
            className="px-4 py-2 rounded-lg bg-[#2E7D32] text-white hover:bg-[#A5D6A7] hover:text-[#333333] transition-all font-medium"
          >
            Logout
          </a>
        ) : (
          <a
            href="/login"
            className="px-4 py-2 rounded-lg bg-[#2E7D32] text-white hover:bg-[#A5D6A7] hover:text-[#333333] transition-all font-medium"
          >
            Login
          </a>
        )}
      </div>
    </nav>
  );
}
