import "../styles/global.css";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase";
import {
  Edit2,
  Trash2,
  Plus,
  Mail,
  Lock,
  Phone,
  MapPin,
  User,
} from "lucide-react";

import Cookies from "js-cookie";

export default function UsersAdmin() {
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;

  const token = user.token;

  const [usuarios, setUsuarios] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    email: "",
    password: "",
    perfilId: "",
  });

  async function fetchUsuarios() {
    try {
      const res = await fetch("http://localhost:3000/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsuarios(data);
    } catch {
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  }

  async function fetchPerfiles() {
    try {
      const res = await fetch("http://localhost:3000/api/perfiles");
      const data = await res.json();
      setPerfiles(data);
    } catch {
      toast.error("Error al cargar perfiles");
    }
  }

  useEffect(() => {
    fetchUsuarios();
    fetchPerfiles();
  }, []);

  async function deleteUsuario(id) {
    if (!confirm("¿Deseas desactivar este usuario?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al eliminar usuario");
      toast.success("Usuario desactivado correctamente");
      fetchUsuarios();
    } catch {
      toast.error("No se pudo desactivar el usuario");
    }
  }

  function openModal(usuario = null) {
    setEditingUser(usuario);
    if (usuario) {
      setForm({
        nombre: usuario.personaId?.nombre || "",
        apellido: usuario.personaId?.apellido || "",
        direccion: usuario.personaId?.direccion || "",
        telefono: usuario.personaId?.telefono || "",
        email: usuario.email,
        password: "",
        perfilId: usuario.perfilId?._id || "",
      });
    } else {
      setForm({
        nombre: "",
        apellido: "",
        direccion: "",
        telefono: "",
        email: "",
        password: "",
        perfilId: "",
      });
    }
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingUser) {
        const res = await fetch(
          `http://localhost:3000/api/usuarios/${editingUser._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              email: form.email,
              perfilId: form.perfilId,
            }),
          }
        );
        if (!res.ok) throw new Error("Error al actualizar usuario");
        toast.success("Usuario actualizado correctamente");
      } else {
        const auth = getAuth(app);
        const cred = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );

        const user = cred.user;
        const firebaseToken = await user.getIdToken();

        const registroData = {
          firebaseUid: user.uid,
          email: form.email,
          passwordHash: "firebase",
          perfilId: form.perfilId,
          persona: {
            nombre: form.nombre,
            apellido: form.apellido,
            direccion: form.direccion || "No especificada",
            telefono: form.telefono || "",
            correo: form.email,
          },
        };

        const res = await fetch("http://localhost:3000/api/usuarios/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${firebaseToken}`,
          },
          body: JSON.stringify(registroData),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Error al registrar usuario");
        }

        toast.success("Usuario creado correctamente");
      }

      setModalOpen(false);
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error al procesar la operación");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading)
    return (
      <p className="p-4" style={{ color: "#333333" }}>
        Cargando usuarios...
      </p>
    );
  if (error) return <p style={{ color: "#c41e3a" }}>{error}</p>;

  return (
    <div className="p-4">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: "#333333" }}>
          Administrar Usuarios
        </h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
          style={{
            backgroundColor: "#2E7D32",
            borderColor: "#A5D6A7",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1B4D1F")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#2E7D32")}
        >
          <Plus size={20} />
          Nuevo Usuario
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full text-left border-collapse">
          <thead style={{ backgroundColor: "#E9E4D8" }}>
            <tr>
              <th className="p-4 font-semibold" style={{ color: "#333333" }}>
                Nombre
              </th>
              <th className="p-4 font-semibold" style={{ color: "#333333" }}>
                Correo
              </th>
              <th className="p-4 font-semibold" style={{ color: "#333333" }}>
                Perfil
              </th>
              <th className="p-4 font-semibold" style={{ color: "#333333" }}>
                Estado
              </th>
              <th
                className="p-4 font-semibold text-center"
                style={{ color: "#333333" }}
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: "#FAFAF9" }}>
            {usuarios.map((u, idx) => (
              <tr
                key={u._id}
                style={{
                  backgroundColor: idx % 2 === 0 ? "#FAFAF9" : "#E9E4D8",
                  borderBottom: "1px solid #E9E4D8",
                }}
              >
                <td className="p-4" style={{ color: "#333333" }}>
                  {u.personaId?.nombre} {u.personaId?.apellido}
                </td>
                <td className="p-4" style={{ color: "#333333" }}>
                  {u.email}
                </td>
                <td className="p-4" style={{ color: "#8F9779" }}>
                  {u.perfilId?.nombre}
                </td>
                <td className="p-4">
                  {u.estado ? (
                    <span className="font-medium" style={{ color: "#2E7D32" }}>
                      Activo
                    </span>
                  ) : (
                    <span className="font-medium" style={{ color: "#c41e3a" }}>
                      Inactivo
                    </span>
                  )}
                </td>
                <td className="p-4 flex gap-2 justify-center">
                  <button
                    onClick={() => openModal(u)}
                    className="flex items-center gap-1 text-white px-3 py-2 rounded-md transition-all hover:shadow-md"
                    style={{ backgroundColor: "#8F9779" }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#A5D6A7")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#8F9779")
                    }
                  >
                    <Edit2 size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => deleteUsuario(u._id)}
                    className="flex items-center gap-1 text-white px-3 py-2 rounded-md transition-all hover:shadow-md"
                    style={{ backgroundColor: "#c41e3a" }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#9a1528")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#c41e3a")
                    }
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className="rounded-lg shadow-lg w-full max-w-lg p-6"
            style={{ backgroundColor: "#FAFAF9" }}
          >
            <h3
              className="text-lg font-semibold mb-6"
              style={{ color: "#2E7D32" }}
            >
              {editingUser ? "Editar Usuario" : "Registrar Usuario"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-3"
                    style={{ color: "#8F9779" }}
                  />
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value })
                    }
                    disabled={!!editingUser}
                    required={!editingUser}
                    className="w-full pl-10 p-2 rounded-lg border transition-all"
                    style={{
                      borderColor: "#E9E4D8",
                      color: "#333333",
                      backgroundColor: "#FAFAF9",
                    }}
                  />
                </div>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-3"
                    style={{ color: "#8F9779" }}
                  />
                  <input
                    type="text"
                    placeholder="Apellido"
                    value={form.apellido}
                    onChange={(e) =>
                      setForm({ ...form, apellido: e.target.value })
                    }
                    disabled={!!editingUser}
                    required={!editingUser}
                    className="w-full pl-10 p-2 rounded-lg border transition-all"
                    style={{
                      borderColor: "#E9E4D8",
                      color: "#333333",
                      backgroundColor: "#FAFAF9",
                    }}
                  />
                </div>
              </div>

              {!editingUser && (
                <>
                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-3 top-3"
                      style={{ color: "#8F9779" }}
                    />
                    <input
                      type="text"
                      placeholder="Dirección"
                      value={form.direccion}
                      onChange={(e) =>
                        setForm({ ...form, direccion: e.target.value })
                      }
                      className="w-full pl-10 p-2 rounded-lg border transition-all"
                      style={{
                        borderColor: "#E9E4D8",
                        color: "#333333",
                        backgroundColor: "#FAFAF9",
                      }}
                    />
                  </div>
                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3 top-3"
                      style={{ color: "#8F9779" }}
                    />
                    <input
                      type="tel"
                      placeholder="Teléfono"
                      value={form.telefono}
                      onChange={(e) =>
                        setForm({ ...form, telefono: e.target.value })
                      }
                      className="w-full pl-10 p-2 rounded-lg border transition-all"
                      style={{
                        borderColor: "#E9E4D8",
                        color: "#333333",
                        backgroundColor: "#FAFAF9",
                      }}
                    />
                  </div>
                </>
              )}

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-3"
                  style={{ color: "#8F9779" }}
                />
                <input
                  type="email"
                  placeholder="Correo"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 p-2 rounded-lg border transition-all"
                  style={{
                    borderColor: "#E9E4D8",
                    color: "#333333",
                    backgroundColor: "#FAFAF9",
                  }}
                  required
                />
              </div>

              {!editingUser && (
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-3"
                    style={{ color: "#8F9779" }}
                  />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full pl-10 p-2 rounded-lg border transition-all"
                    style={{
                      borderColor: "#E9E4D8",
                      color: "#333333",
                      backgroundColor: "#FAFAF9",
                    }}
                    required
                  />
                </div>
              )}

              <select
                value={form.perfilId}
                onChange={(e) => setForm({ ...form, perfilId: e.target.value })}
                className="w-full p-2 rounded-lg border transition-all"
                style={{
                  borderColor: "#E9E4D8",
                  color: "#333333",
                  backgroundColor: "#FAFAF9",
                }}
                required
              >
                <option value="">Seleccionar perfil</option>
                {perfiles.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.nombre}
                  </option>
                ))}
              </select>

              <div
                className="flex justify-end gap-3 pt-4 border-t"
                style={{ borderColor: "#E9E4D8" }}
              >
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="text-white px-4 py-2 rounded-lg transition-all"
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
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="text-white px-4 py-2 rounded-lg transition-all font-medium"
                  style={{
                    backgroundColor: submitting ? "#A5D6A7" : "#2E7D32",
                  }}
                  onMouseEnter={(e) =>
                    !submitting && (e.target.style.backgroundColor = "#1B4D1F")
                  }
                  onMouseLeave={(e) =>
                    !submitting && (e.target.style.backgroundColor = "#2E7D32")
                  }
                >
                  {submitting
                    ? "Procesando..."
                    : editingUser
                    ? "Guardar Cambios"
                    : "Registrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
