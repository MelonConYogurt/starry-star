import { useState, useEffect, useRef } from "react";

const DropdownCRUD = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className=" text-gray-700 hover:text-blue-600 transition"
      >
        Gestiones
      </button>
      
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg flex flex-col z-50">
          <a
            href="/Gestion-perfil"
            className="px-4 py-2 hover:bg-gray-100 transition"
          >
            Gestión Perfil
          </a>
          <a
            href="/Gestion-Persona"
            className="px-4 py-2 hover:bg-gray-100 transition"
          >
            Gestión Persona
          </a>
          <a
            href="/Gestion-Usuario"
            className="px-4 py-2 hover:bg-gray-100 transition"
          >
            Gestión Usuario
          </a>
        </div>
      )}
    </div>
  );
};

export default DropdownCRUD;
