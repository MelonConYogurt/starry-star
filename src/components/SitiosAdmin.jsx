"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Edit2, Trash2, Plus, Map, Filter, ImageIcon } from "lucide-react";
import Cookies from "js-cookie";

export default function SitiosAdmin() {
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;
  const token = user?.token;

  const [sitios, setSitios] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    tipoActividad: "",
    lat: "",
    lng: "",
    imagen: "",
    video: "",
  });

  async function fetchSitios() {
    try {
      const res = await fetch("http://localhost:3000/api/sitios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSitios(data);
    } catch {
      toast.error("Error al cargar sitios");
    }
  }

  async function fetchTipos() {
    try {
      const res = await fetch("http://localhost:3000/api/tipos-actividad", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTipos(data);
    } catch {
      toast.error("Error al cargar tipos de actividad");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    Promise.all([fetchSitios(), fetchTipos()]);
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";

    const url = editingId
      ? `http://localhost:3000/api/sitios/${editingId}`
      : "http://localhost:3000/api/sitios";

    const body = {
      nombre: form.nombre,
      tipoActividad: form.tipoActividad,
      coordenadas: { lat: parseFloat(form.lat), lng: parseFloat(form.lng) },
      imagen: form.imagen,
      video: form.video,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editingId ? "Sitio actualizado" : "Sitio creado");
        setForm({
          nombre: "",
          tipoActividad: "",
          lat: "",
          lng: "",
          imagen: "",
          video: "",
        });
        setEditingId(null);
        fetchSitios();
      } else {
        toast.error("Error al guardar el sitio");
      }
    } catch {
      toast.error("Error al procesar la operación");
    }
  }

  function startEdit(s) {
    setEditingId(s._id);
    setForm({
      nombre: s.nombre,
      tipoActividad: s.tipoActividad?._id || "",
      lat: s.coordenadas.lat,
      lng: s.coordenadas.lng,
      imagen: s.imagen,
      video: s.video,
    });
  }

  async function deleteSitio(id) {
    if (!confirm("¿Eliminar sitio permanentemente?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/sitios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("Sitio eliminado correctamente");
        fetchSitios();
      } else {
        toast.error("Error al eliminar el sitio");
      }
    } catch {
      toast.error("Error al procesar la operación");
    }
  }

  if (loading)
    return (
      <div className="text-center py-8" style={{ color: "#8F9779" }}>
        Cargando sitios...
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg" style={{ backgroundColor: "#2E7D32" }}>
          <Map size={24} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold" style={{ color: "#333333" }}>
          Administrar Sitios
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
              Nombre del Sitio
            </label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Cascada del Bosque"
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
              Tipo de Actividad
            </label>
            <div className="flex items-center mt-2">
              <Filter
                size={18}
                className="absolute left-3"
                style={{ color: "#8F9779" }}
              />
              <select
                name="tipoActividad"
                value={form.tipoActividad}
                onChange={handleChange}
                className="w-full pl-10 p-3 rounded-md border-2 transition-colors"
                style={{ borderColor: "#A5D6A7", backgroundColor: "#FAFAF9" }}
                onFocus={(e) => (e.target.style.borderColor = "#2E7D32")}
                onBlur={(e) => (e.target.style.borderColor = "#A5D6A7")}
                required
              >
                <option value="">Seleccione Tipo de Actividad</option>
                {tipos.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label
              className="text-sm font-semibold"
              style={{ color: "#333333" }}
            >
              Latitud
            </label>
            <input
              name="lat"
              value={form.lat}
              onChange={handleChange}
              placeholder="0.000000"
              type="number"
              step="0.000001"
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
              Longitud
            </label>
            <input
              name="lng"
              value={form.lng}
              onChange={handleChange}
              placeholder="0.000000"
              type="number"
              step="0.000001"
              required
              className="w-full mt-2 p-3 rounded-md border-2 transition-colors"
              style={{ borderColor: "#A5D6A7", backgroundColor: "#FAFAF9" }}
              onFocus={(e) => (e.target.style.borderColor = "#2E7D32")}
              onBlur={(e) => (e.target.style.borderColor = "#A5D6A7")}
            />
          </div>
        </div>

        <div className="relative">
          <label className="text-sm font-semibold" style={{ color: "#333333" }}>
            URL de Imagen
          </label>
          <div className="flex items-center mt-2">
            <ImageIcon
              size={18}
              className="absolute left-3"
              style={{ color: "#8F9779" }}
            />
            <input
              name="imagen"
              value={form.imagen}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full pl-10 p-3 rounded-md border-2 transition-colors"
              style={{ borderColor: "#A5D6A7", backgroundColor: "#FAFAF9" }}
              onFocus={(e) => (e.target.style.borderColor = "#2E7D32")}
              onBlur={(e) => (e.target.style.borderColor = "#A5D6A7")}
            />
          </div>
        </div>

        <div className="relative">
          <label className="text-sm font-semibold" style={{ color: "#333333" }}>
            URL de Video
          </label>
          <input
            name="video"
            value={form.video}
            onChange={handleChange}
            placeholder="https://youtube.com/..."
            className="w-full mt-2 p-3 rounded-md border-2 transition-colors"
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
          {editingId ? "Actualizar Sitio" : "Agregar Sitio"}
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead style={{ backgroundColor: "#2E7D32" }}>
            <tr>
              <th className="p-4 font-semibold text-white">Nombre</th>
              <th className="p-4 font-semibold text-white">Tipo</th>
              <th className="p-4 font-semibold text-white">Imagen</th>
              <th className="p-4 font-semibold text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sitios.map((s, i) => (
              <tr
                key={s._id}
                style={{
                  backgroundColor: i % 2 === 0 ? "#FAFAF9" : "#FFFFFF",
                }}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 font-medium" style={{ color: "#333333" }}>
                  {s.nombre}
                </td>
                <td className="p-4" style={{ color: "#8F9779" }}>
                  {s.tipoActividad?.nombre}
                </td>
                <td className="p-4">
                  {s.imagen && (
                    <img
                      src={s.imagen || "/placeholder.svg"}
                      alt={s.nombre}
                      className="h-12 w-12 object-cover rounded border"
                      style={{ borderColor: "#E9E4D8" }}
                    />
                  )}
                </td>
                <td className="p-4 flex gap-2">
                  <button
                    className="px-3 py-2 rounded-md text-white transition-all hover:shadow-md"
                    style={{ backgroundColor: "#8F9779" }}
                    onClick={() => startEdit(s)}
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="px-3 py-2 rounded-md text-white transition-all hover:shadow-md"
                    style={{ backgroundColor: "#2E7D32" }}
                    onClick={() => deleteSitio(s._id)}
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sitios.length === 0 && (
        <div
          className="text-center py-12 rounded-lg"
          style={{ backgroundColor: "#E9E4D8" }}
        >
          <p style={{ color: "#8F9779" }} className="font-medium">
            No hay sitios registrados
          </p>
        </div>
      )}
    </div>
  );
}
