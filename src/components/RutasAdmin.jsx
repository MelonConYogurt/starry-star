"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Edit2,
  Trash2,
  Plus,
  Clock,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Cookies from "js-cookie";

export default function RutasAdmin() {
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;
  const token = user?.token;

  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    duracion: "",
    observacion: "",
    valor: "",
  });

  async function fetchRutas() {
    try {
      const res = await fetch("http://localhost:3000/api/rutas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRutas(data);
    } catch (error) {
      toast.error("Error al cargar rutas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRutas();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:3000/api/rutas/${editingId}`
      : "http://localhost:3000/api/rutas";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success(editingId ? "Ruta actualizada" : "Ruta creada");
        setForm({ nombre: "", duracion: "", observacion: "", valor: "" });
        setEditingId(null);
        fetchRutas();
      } else {
        toast.error("Error al guardar la ruta");
      }
    } catch (error) {
      toast.error("Error al procesar la operación");
    }
  }

  async function toggleRuta(id, estado) {
    const method = estado ? "DELETE" : "PATCH";
    const url = estado
      ? `http://localhost:3000/api/rutas/${id}`
      : `http://localhost:3000/api/rutas/${id}/activate`;

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success(estado ? "Ruta eliminada" : "Ruta activada");
        fetchRutas();
      } else {
        toast.error("Error al actualizar la ruta");
      }
    } catch (error) {
      toast.error("Error al procesar la operación");
    }
  }

  function startEdit(r) {
    setEditingId(r._id);
    setForm({
      nombre: r.nombre,
      duracion: r.duracion,
      observacion: r.observacion,
      valor: r.valor,
    });
  }

  if (loading)
    return (
      <div className="text-center py-8" style={{ color: "#8F9779" }}>
        Cargando rutas...
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg" style={{ backgroundColor: "#2E7D32" }}>
          <Plus size={24} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold" style={{ color: "#333333" }}>
          Administrar Rutas
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
              Nombre de Ruta
            </label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Ruta Montaña"
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
              Duración (minutos)
            </label>
            <div className="flex items-center">
              <Clock
                size={18}
                className="absolute left-3 mt-8"
                style={{ color: "#8F9779" }}
              />
              <input
                name="duracion"
                value={form.duracion}
                onChange={handleChange}
                placeholder="0"
                type="number"
                required
                className="w-full mt-2 pl-10 p-3 rounded-md border-2 transition-colors"
                style={{ borderColor: "#A5D6A7", backgroundColor: "#FAFAF9" }}
                onFocus={(e) => (e.target.style.borderColor = "#2E7D32")}
                onBlur={(e) => (e.target.style.borderColor = "#A5D6A7")}
              />
            </div>
          </div>
        </div>

        <div className="relative">
          <label className="text-sm font-semibold" style={{ color: "#333333" }}>
            Valor ($)
          </label>
          <div className="flex items-center">
            <DollarSign
              size={18}
              className="absolute left-3 mt-8"
              style={{ color: "#8F9779" }}
            />
            <input
              name="valor"
              value={form.valor}
              onChange={handleChange}
              placeholder="0.00"
              type="number"
              step="0.01"
              className="w-full mt-2 pl-10 p-3 rounded-md border-2 transition-colors"
              style={{ borderColor: "#A5D6A7", backgroundColor: "#FAFAF9" }}
              onFocus={(e) => (e.target.style.borderColor = "#2E7D32")}
              onBlur={(e) => (e.target.style.borderColor = "#A5D6A7")}
            />
          </div>
        </div>

        <div className="relative">
          <label className="text-sm font-semibold" style={{ color: "#333333" }}>
            Observaciones
          </label>
          <div className="flex items-start">
            <FileText
              size={18}
              className="absolute left-3 mt-8"
              style={{ color: "#8F9779" }}
            />
            <textarea
              name="observacion"
              value={form.observacion}
              onChange={handleChange}
              placeholder="Detalles adicionales sobre la ruta..."
              className="w-full mt-2 pl-10 p-3 rounded-md border-2 transition-colors resize-none"
              rows="3"
              style={{ borderColor: "#A5D6A7", backgroundColor: "#FAFAF9" }}
              onFocus={(e) => (e.target.style.borderColor = "#2E7D32")}
              onBlur={(e) => (e.target.style.borderColor = "#A5D6A7")}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full font-semibold py-3 px-6 rounded-md flex items-center justify-center gap-2 text-white transition-all hover:shadow-lg"
          style={{ backgroundColor: "#2E7D32" }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1B5E20")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#2E7D32")}
        >
          <Plus size={18} />
          {editingId ? "Actualizar Ruta" : "Agregar Ruta"}
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead style={{ backgroundColor: "#2E7D32" }}>
            <tr>
              <th className="p-4 font-semibold text-white">Nombre</th>
              <th className="p-4 font-semibold text-white">Duración</th>
              <th className="p-4 font-semibold text-white">Valor</th>
              <th className="p-4 font-semibold text-white">Estado</th>
              <th className="p-4 font-semibold text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rutas.map((r, i) => (
              <tr
                key={r._id}
                style={{
                  backgroundColor: i % 2 === 0 ? "#FAFAF9" : "#FFFFFF",
                }}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 font-medium" style={{ color: "#333333" }}>
                  {r.nombre}
                </td>
                <td
                  className="p-4 flex items-center gap-2"
                  style={{ color: "#333333" }}
                >
                  <Clock size={16} style={{ color: "#8F9779" }} />
                  {r.duracion} min
                </td>
                <td className="p-4 font-semibold" style={{ color: "#2E7D32" }}>
                  <DollarSign size={16} className="inline mr-1" />
                  {r.valor}
                </td>

                <td className="p-4">
                  {r.estado ? (
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
                    onClick={() => startEdit(r)}
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    className="px-3 py-2 rounded-md text-white transition-all hover:shadow-md"
                    style={{
                      backgroundColor: r.estado ? "#8F9779" : "#2E7D32",
                    }}
                    onClick={() => toggleRuta(r._id, r.estado)}
                    title={r.estado ? "Eliminar" : "Activar"}
                  >
                    {r.estado ? (
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

      {rutas.length === 0 && (
        <div
          className="text-center py-12 rounded-lg"
          style={{ backgroundColor: "#E9E4D8" }}
        >
          <p style={{ color: "#8F9779" }} className="font-medium">
            No hay rutas registradas
          </p>
        </div>
      )}
    </div>
  );
}
