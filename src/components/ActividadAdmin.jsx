import "../styles/global.css";
import { useEffect, useState } from "react";
import {
  Edit2,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  Image,
  DollarSign,
  FileText,
} from "lucide-react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function ActividadAdmin() {
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;
  const token = user?.token;

  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    imagen: "",
    observaciones: "",
    valor: "",
  });

  async function fetchTipos() {
    const res = await fetch("http://localhost:3000/api/tipos-actividad", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTipos(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchTipos();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";

    const url = editingId
      ? `http://localhost:3000/api/tipos-actividad/${editingId}`
      : "http://localhost:3000/api/tipos-actividad";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success(editingId ? "Actividad actualizada" : "Actividad creada");
      setForm({ nombre: "", imagen: "", observaciones: "", valor: "" });
      setEditingId(null);
      fetchTipos();
    } else {
      toast.error("Error al guardar la actividad");
    }
  }

  async function toggleTipo(id, estado) {
    const method = estado ? "DELETE" : "PATCH";

    const endpoint = estado
      ? `http://localhost:3000/api/tipos-actividad/${id}`
      : `http://localhost:3000/api/tipos-actividad/${id}/activate`;

    const res = await fetch(endpoint, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      toast.success(estado ? "Actividad eliminada" : "Actividad activada");
      fetchTipos();
    } else {
      toast.error("Error al actualizar la actividad");
    }
  }

  function startEdit(t) {
    setEditingId(t._id);
    setForm({
      nombre: t.nombre,
      imagen: t.imagen,
      observaciones: t.observaciones,
      valor: t.valor,
    });
  }

  if (loading)
    return (
      <div className="text-center py-8" style={{ color: "#8F9779" }}>
        Cargando tipos de actividad...
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg" style={{ backgroundColor: "#2E7D32" }}>
          <Plus size={24} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold" style={{ color: "#333333" }}>
          Administrar Tipos de Actividad
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg p-6 space-y-4 shadow-md border-t-4"
        style={{ backgroundColor: "#E9E4D8", borderTopColor: "#2E7D32" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label
              className="text-sm font-semibold"
              style={{ color: "#333333" }}
            >
              Nombre
            </label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre de la actividad"
              required
              className="w-full mt-2 p-3 rounded-md border-2 transition-colors"
              style={{ borderColor: "#A5D6A7", backgroundColor: "#FAFAF9" }}
              onFocus={(e) => (e.target.style.borderColor = "#2E7D32")}
              onBlur={(e) => (e.target.style.borderColor = "#A5D6A7")}
            />
          </div>

          <div className="relative">
            <label
              className="text-sm font-semibold"
              style={{ color: "#333333" }}
            >
              Valor ($)
            </label>
            <input
              name="valor"
              value={form.valor}
              onChange={handleChange}
              placeholder="0.00"
              type="number"
              step="0.01"
              className="w-full mt-2 p-3 rounded-md border-2 transition-colors"
              style={{ borderColor: "#A5D6A7", backgroundColor: "#FAFAF9" }}
              onFocus={(e) => (e.target.style.borderColor = "#2E7D32")}
              onBlur={(e) => (e.target.style.borderColor = "#A5D6A7")}
            />
          </div>
        </div>

        <div className="relative">
          <label className="text-sm font-semibold" style={{ color: "#333333" }}>
            URL de imagen
          </label>
          <input
            name="imagen"
            value={form.imagen}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="w-full mt-2 p-3 rounded-md border-2 transition-colors"
            style={{ borderColor: "#A5D6A7", backgroundColor: "#FAFAF9" }}
            onFocus={(e) => (e.target.style.borderColor = "#2E7D32")}
            onBlur={(e) => (e.target.style.borderColor = "#A5D6A7")}
          />
        </div>

        <div className="relative">
          <label className="text-sm font-semibold" style={{ color: "#333333" }}>
            Observaciones
          </label>
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
            placeholder="Detalles adicionales sobre la actividad..."
            className="w-full mt-2 p-3 rounded-md border-2 transition-colors resize-none"
            rows="3"
            style={{ borderColor: "#A5D6A7", backgroundColor: "#FAFAF9" }}
            onFocus={(e) => (e.target.style.borderColor = "#2E7D32")}
            onBlur={(e) => (e.target.style.borderColor = "#A5D6A7")}
          />
        </div>

        <button
          type="submit"
          className="w-full font-semibold py-3 px-6 rounded-md flex items-center justify-center gap-2 text-white transition-all hover:shadow-lg"
          style={{ backgroundColor: "#2E7D32" }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1B5E20")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#2E7D32")}
        >
          <Plus size={18} />
          {editingId ? "Actualizar Actividad" : "Agregar Actividad"}
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead style={{ backgroundColor: "#2E7D32" }}>
            <tr>
              <th className="p-4 font-semibold text-white">Nombre</th>
              <th className="p-4 font-semibold text-white">Imagen</th>
              <th className="p-4 font-semibold text-white">Valor</th>
              <th className="p-4 font-semibold text-white">Estado</th>
              <th className="p-4 font-semibold text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tipos.map((t, i) => (
              <tr
                key={t._id}
                style={{
                  backgroundColor: i % 2 === 0 ? "#FAFAF9" : "#FFFFFF",
                }}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 font-medium" style={{ color: "#333333" }}>
                  {t.nombre}
                </td>
                <td className="p-4">
                  {t.imagen ? (
                    <img
                      src={t.imagen || "/placeholder.svg"}
                      alt={t.nombre}
                      className="h-12 w-12 rounded object-cover border-2"
                      style={{ borderColor: "#A5D6A7" }}
                    />
                  ) : (
                    <div
                      className="h-12 w-12 rounded flex items-center justify-center"
                      style={{ backgroundColor: "#E9E4D8" }}
                    >
                      <Image size={18} style={{ color: "#8F9779" }} />
                    </div>
                  )}
                </td>
                <td className="p-4 font-semibold" style={{ color: "#2E7D32" }}>
                  ${t.valor}
                </td>

                <td className="p-4">
                  {t.estado ? (
                    <span
                      className="flex items-center gap-2 px-3 py-1 rounded-full w-fit"
                      style={{ backgroundColor: "#A5D6A7", color: "#1B5E20" }}
                    >
                      <CheckCircle size={16} /> Activo
                    </span>
                  ) : (
                    <span
                      className="flex items-center gap-2 px-3 py-1 rounded-full w-fit"
                      style={{ backgroundColor: "#E9E4D8", color: "#8F9779" }}
                    >
                      <XCircle size={16} /> Inactivo
                    </span>
                  )}
                </td>

                <td className="p-4 flex gap-2">
                  <button
                    className="px-3 py-2 rounded-md text-white transition-all hover:shadow-md"
                    style={{ backgroundColor: "#8F9779" }}
                    onClick={() => startEdit(t)}
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    className="px-3 py-2 rounded-md text-white transition-all hover:shadow-md"
                    style={{
                      backgroundColor: t.estado ? "#8F9779" : "#2E7D32",
                    }}
                    onClick={() => toggleTipo(t._id, t.estado)}
                    title={t.estado ? "Eliminar" : "Activar"}
                  >
                    {t.estado ? (
                      <Trash2 size={16} />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tipos.length === 0 && (
        <div
          className="text-center py-12 rounded-lg"
          style={{ backgroundColor: "#E9E4D8" }}
        >
          <p style={{ color: "#8F9779" }} className="font-medium">
            No hay tipos de actividad registrados
          </p>
        </div>
      )}
    </div>
  );
}
