import "../styles/global.css";
import { useEffect, useState } from "react";
import { Edit2, Trash2, Plus, CheckCircle, XCircle } from "lucide-react";
import Cookies from "js-cookie";

export default function PerfilesAdmin() {
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;

  const token = user.token;

  const [perfiles, setPerfiles] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchPerfiles() {
    const res = await fetch("http://localhost:3000/api/perfiles", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPerfiles(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchPerfiles();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:3000/api/perfiles/${editingId}`
      : "http://localhost:3000/api/perfiles";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre }),
    });

    setNombre("");
    setEditingId(null);
    fetchPerfiles();
  }

  async function togglePerfil(id, estado) {
    const action = estado ? "desactivar" : "activar";
    if (!confirm(`¿Deseas ${action} este perfil?`)) return;

    const method = estado ? "DELETE" : "PATCH";
    const endpoint = estado
      ? `http://localhost:3000/api/perfiles/${id}`
      : `http://localhost:3000/api/perfiles/${id}/activate`;

    await fetch(endpoint, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchPerfiles();
  }

  async function deletePerfil(id) {
    if (!confirm("¿Deseas desactivar este perfil?")) return;
    await fetch(`http://localhost:3000/api/perfiles/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPerfiles();
  }

  function startEdit(perfil) {
    setEditingId(perfil._id);
    setNombre(perfil.nombre);
  }

  if (loading)
    return (
      <div className="text-center py-8" style={{ color: "#8F9779" }}>
        Cargando perfiles...
      </div>
    );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold" style={{ color: "#333333" }}>
        Administrar perfiles
      </h2>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg p-6 flex flex-wrap gap-4 items-end shadow-sm transition-all"
        style={{ backgroundColor: "#E9E4D8" }}
      >
        <div className="flex-1 min-w-64">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del perfil"
            className="w-full p-3 rounded-md border-2 transition-all focus:outline-none"
            style={{
              borderColor: "#A5D6A7",
              backgroundColor: "#FAFAF9",
              color: "#333333",
            }}
            required
          />
        </div>
        <button
          type="submit"
          className="font-semibold py-3 px-6 rounded-md transition-all flex items-center gap-2 text-white hover:shadow-md"
          style={{
            backgroundColor: "#2E7D32",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1e5a23")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#2E7D32")}
        >
          <Plus size={18} />
          {editingId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full text-left border-collapse">
          <thead style={{ backgroundColor: "#E9E4D8" }}>
            <tr>
              <th className="p-4 font-semibold" style={{ color: "#2E7D32" }}>
                Nombre
              </th>
              <th className="p-4 font-semibold" style={{ color: "#2E7D32" }}>
                Estado
              </th>
              <th className="p-4 font-semibold" style={{ color: "#2E7D32" }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {perfiles.map((p, idx) => (
              <tr
                key={p._id}
                style={{
                  backgroundColor: idx % 2 === 0 ? "#FAFAF9" : "#FFFFFF",
                  borderBottom: "1px solid #E9E4D8",
                }}
                className="hover:shadow-sm transition-all"
              >
                <td className="p-4" style={{ color: "#333333" }}>
                  {p.nombre}
                </td>
                <td className="p-4">
                  {p.estado ? (
                    <span
                      className="flex items-center gap-2 font-medium"
                      style={{ color: "#2E7D32" }}
                    >
                      <CheckCircle size={18} />
                      Activo
                    </span>
                  ) : (
                    <span
                      className="flex items-center gap-2 font-medium"
                      style={{ color: "#8F9779" }}
                    >
                      <XCircle size={18} />
                      Inactivo
                    </span>
                  )}
                </td>
                <td className="p-4 flex gap-2 flex-wrap">
                  <button
                    onClick={() => startEdit(p)}
                    className="text-white px-3 py-2 rounded-md flex items-center gap-1 hover:shadow-md transition-all"
                    style={{ backgroundColor: "#8F9779" }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#6d7a62")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#8F9779")
                    }
                  >
                    <Edit2 size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => deletePerfil(p._id)}
                    className="text-white px-3 py-2 rounded-md hover:shadow-md transition-all"
                    style={{ backgroundColor: "#A5D6A7" }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#7ac97a")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#A5D6A7")
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => togglePerfil(p._id, p.estado)}
                    className="text-white px-3 py-2 rounded-md flex items-center gap-1 hover:shadow-md transition-all"
                    style={{
                      backgroundColor: p.estado ? "#A5D6A7" : "#2E7D32",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = p.estado
                        ? "#7ac97a"
                        : "#1e5a23";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = p.estado
                        ? "#A5D6A7"
                        : "#2E7D32";
                    }}
                  >
                    {p.estado ? (
                      <>
                        <XCircle size={16} />
                        Desactivar
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Activar
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
