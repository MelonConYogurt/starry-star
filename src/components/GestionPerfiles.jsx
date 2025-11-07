import { useState } from "react";
import "../styles/global.css";

const GestionPerfiles = () => {
  const [perfil, setPerfil] = useState({
    identificacion: "",
    nombres: "",
    apellidos: "",
    telefono: "",
    correo: "",
    direccion: "",
    municipio: "",
  });

  const handleChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const handleCrear = () => console.log("Crear", perfil);
  const handleConsultar = () => console.log("Consultar", perfil);
  const handleModificar = () => console.log("Modificar", perfil);
  const handleGuardar = () => console.log("Guardar", perfil);
  const handleInhabilitar = () => console.log("Inhabilitar", perfil);
  const handleCancelar = () => console.log("Cancelar");
  const handleSalir = () => console.log("Salir");

  return (
    <div
      className="w-screen h-screen"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full h-full bg-black/40 flex items-center justify-center p-10">
        <div className="flex flex-row w-full max-w-[1600px] h-[90vh] gap-10 items-stretch">
          <div className="flex-1 flex flex-col">
            <div className="bg-white/95 p-10 rounded-3xl shadow-2xl border border-white/30 h-full flex flex-col">
              <h1
                className="text-5xl font-bold mb-10 text-left border-b-2 pb-4"
                style={{ color: "#423FF3", borderColor: "#423FF3" }}
              >
                Gestión de Perfiles
              </h1>
              
              <form className="grid grid-cols-2 gap-8 flex-1">
                {[
                  { name: "identificacion", placeholder: "Identificación" },
                  { name: "nombres", placeholder: "Nombres" },
                  { name: "apellidos", placeholder: "Apellidos" },
                  { name: "telefono", placeholder: "Teléfono" },
                  { name: "correo", placeholder: "Correo electrónico", type: "email" },
                  { name: "direccion", placeholder: "Dirección" },
                  { name: "municipio", placeholder: "Municipio" },
                ].map((input) => (
                  <div key={input.name} className="flex flex-col">
                    <label
                      htmlFor={input.name}
                      className="text-gray-700 font-semibold mb-3 text-lg"
                    >
                      {input.placeholder}
                    </label>
                    <input
                      type={input.type || "text"}
                      name={input.name}
                      id={input.name}
                      placeholder={input.placeholder}
                      value={perfil[input.name]}
                      onChange={handleChange}
                      className="p-4 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-[#43453F] focus:border-[#43453F] focus:outline-none text-gray-800 shadow transition-all duration-200 w-full text-lg bg-white/80"
                    />
                  </div>
                ))}
              </form>
            </div>
          </div>
          <div className="flex flex-col justify-center items-stretch gap-5 w-96">
            {[
              { label: "Crear", fn: handleCrear },
              { label: "Consultar", fn: handleConsultar },
              { label: "Modificar", fn: handleModificar },
              { label: "Guardar", fn: handleGuardar },
              { label: "Inhabilitar", fn: handleInhabilitar },
              { label: "Cancelar", fn: handleCancelar },
              { label: "Salir", fn: handleSalir },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.fn}
                style={{ backgroundColor: "#43453F" }}
                className="hover:opacity-90 text-white font-bold py-5 rounded-2xl shadow-2xl transition-all duration-200 transform hover:scale-[1.03] text-xl"
              >
                {btn.label}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default GestionPerfiles;
