import { useEffect, useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  User,
  Trash2,
  Edit2,
  X,
  Plus,
  CheckCircle,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export default function PersonasAdmin() {
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;

  const token = user.token;

  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    direccion: "No especificada",
    correo: "",
    telefono: "",
  });
  const [editingId, setEditingId] = useState(null);

  async function fetchPersonas() {
    try {
      const res = await fetch("http://localhost:3000/api/personas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPersonas(data);
    } catch {
      setError("Error al cargar personas");
      toast.error("Error al cargar personas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPersonas();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value || "" }));
  }

  function validateForm(data) {
    if (!data.nombre || data.nombre.trim() === "") {
      toast.error("El nombre es obligatorio");
      return false;
    }
    if (!data.apellido || data.apellido.trim() === "") {
      toast.error("El apellido es obligatorio");
      return false;
    }
    if (!data.correo || data.correo.trim() === "") {
      toast.error("El correo es obligatorio");
      return false;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(data.correo)) {
      toast.error("Ingresa un correo válido");
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm(form)) return;

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:3000/api/personas/${editingId}`
      : "http://localhost:3000/api/personas";

    const body = editingId ? form : { ...form, estado: true };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let errMsg = "No se pudo guardar";
        try {
          const data = await res.json();
          errMsg = data.error || errMsg;
        } catch (e) {}
        toast.error("Error: " + errMsg);
        return;
      }

      toast.success(editingId ? "Persona actualizada" : "Persona agregada");
      setForm({
        nombre: "",
        apellido: "",
        direccion: "No especificada",
        correo: "",
        telefono: "",
      });
      setEditingId(null);
      fetchPersonas();
    } catch (err) {
      console.error(err);
      toast.error("Error al comunicarse con el servidor");
    }
  }

  async function deletePersona(id) {
    if (!confirm("¿Deseas desactivar esta persona?")) return;
    try {
      await fetch(`http://localhost:3000/api/personas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Persona desactivada");
      fetchPersonas();
    } catch {
      toast.error("Error al desactivar persona");
    }
  }

  function startEdit(p) {
    setForm({
      nombre: p.nombre || "",
      apellido: p.apellido || "",
      direccion: p.direccion || "No especificada",
      correo: p.correo || "",
      telefono: p.telefono || "",
    });
    setEditingId(p._id);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({
      nombre: "",
      apellido: "",
      direccion: "No especificada",
      correo: "",
      telefono: "",
    });
  }

  if (loading)
    return (
      <p className="text-center py-8" style={{ color: "#333333" }}>
        Cargando personas...
      </p>
    );
  if (error)
    return (
      <p className="text-center py-8" style={{ color: "#d32f2f" }}>
        {error}
      </p>
    );

  return (
    <div className="space-y-6" style={{ backgroundColor: "#FAFAF9" }}>
      <h2 className="text-2xl font-bold" style={{ color: "#333333" }}>
        Administrar personas
      </h2>
      <form
        onSubmit={handleSubmit}
        className="shadow-lg rounded-xl p-6"
        style={{ backgroundColor: "#E9E4D8" }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: "#2E7D32" }}>
          {editingId ? "Editar Persona" : "Agregar Nueva Persona"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <User size={18} style={{ color: "#8F9779", marginRight: "8px" }} />
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              className="border-b-2 p-2 w-full bg-transparent focus:outline-none transition"
              style={{
                borderColor: "#2E7D32",
                color: "#333333",
              }}
              required
            />
          </div>

          <div className="flex items-center">
            <User size={18} style={{ color: "#8F9779", marginRight: "8px" }} />
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              placeholder="Apellido"
              className="border-b-2 p-2 w-full bg-transparent focus:outline-none transition"
              style={{
                borderColor: "#2E7D32",
                color: "#333333",
              }}
              required
            />
          </div>

          <div className="flex items-center">
            <Mail size={18} style={{ color: "#8F9779", marginRight: "8px" }} />
            <input
              name="correo"
              type="email"
              value={form.correo}
              onChange={handleChange}
              placeholder="Correo"
              className="border-b-2 p-2 w-full bg-transparent focus:outline-none transition"
              style={{
                borderColor: "#2E7D32",
                color: "#333333",
              }}
              required
            />
          </div>

          <div className="flex items-center">
            <Phone size={18} style={{ color: "#8F9779", marginRight: "8px" }} />
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Teléfono"
              className="border-b-2 p-2 w-full bg-transparent focus:outline-none transition"
              style={{
                borderColor: "#2E7D32",
                color: "#333333",
              }}
            />
          </div>

          <div className="flex items-center md:col-span-2">
            <MapPin
              size={18}
              style={{ color: "#8F9779", marginRight: "8px" }}
            />
            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Dirección"
              className="border-b-2 p-2 w-full bg-transparent focus:outline-none transition"
              style={{
                borderColor: "#2E7D32",
                color: "#333333",
              }}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="font-semibold py-2 px-6 rounded-lg transition-all flex items-center gap-2"
            style={{
              backgroundColor: "#2E7D32",
              color: "white",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#A5D6A7")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#2E7D32")}
          >
            <Plus size={18} />
            {editingId ? "Actualizar" : "Agregar"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="font-semibold py-2 px-6 rounded-lg transition-all flex items-center gap-2"
              style={{
                backgroundColor: "#8F9779",
                color: "white",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#A5D6A7")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#8F9779")}
            >
              <X size={18} />
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div
        className="overflow-x-auto shadow-lg rounded-xl"
        style={{ backgroundColor: "white" }}
      >
        <table className="w-full text-left border-collapse">
          <thead style={{ backgroundColor: "#2E7D32" }}>
            <tr>
              <th className="p-4 text-white font-semibold">Nombre</th>
              <th className="p-4 text-white font-semibold">Apellido</th>
              <th className="p-4 text-white font-semibold">Correo</th>
              <th className="p-4 text-white font-semibold">Dirección</th>
              <th className="p-4 text-white font-semibold">Teléfono</th>
              <th className="p-4 text-white font-semibold">Estado</th>
              <th className="p-4 text-white font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {personas.map((p, index) => (
              <tr
                key={p._id}
                className="border-b transition"
                style={{
                  backgroundColor: index % 2 === 0 ? "#FAFAF9" : "#E9E4D8",
                  color: p.estado === false ? "#8F9779" : "#333333",
                }}
              >
                <td className="p-4">{p.nombre}</td>
                <td className="p-4">{p.apellido}</td>
                <td className="p-4">{p.correo}</td>
                <td className="p-4">{p.direccion}</td>
                <td className="p-4">{p.telefono}</td>
                <td className="p-4 flex items-center gap-1">
                  {p.estado ? (
                    <>
                      <CheckCircle size={16} style={{ color: "#2E7D32" }} />
                      <span>Activa</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} style={{ color: "#8F9779" }} />
                      <span>Inactiva</span>
                    </>
                  )}
                </td>
                <td>
                  <div className="p-4 flex gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="text-white px-3 py-1 rounded-lg transition-all flex items-center gap-1"
                      style={{
                        backgroundColor: "#2E7D32",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#A5D6A7")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#2E7D32")
                      }
                    >
                      <Edit2 size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => deletePersona(p._id)}
                      className="text-white px-3 py-1 rounded-lg transition-all flex items-center gap-1"
                      style={{
                        backgroundColor: "#8F9779",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#A5D6A7")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#8F9779")
                      }
                    >
                      <Trash2 size={16} />
                      Desactivar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
