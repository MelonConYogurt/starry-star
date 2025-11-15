import "../styles/global.css";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Leaf,
  Eye,
  EyeOff,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    email: "",
    password: "",
    perfilId: "", 
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/perfiles")
      .then((res) => res.json())
      .then((data) => {
        const perfilBase = data.find((p) => ["Usuario"].includes(p.nombre));
        if (perfilBase) {
          setForm((prev) => ({ ...prev, perfilId: perfilBase._id }));
        } else {
          toast.error(
            "No se encontró el perfil base 'Usuario' en la base de datos."
          );
        }
      })
      .catch(() => toast.error("Error al cargar perfiles"));
  }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validarFormulario() {
    if (!form.nombre || !form.apellido || !form.email || !form.password) {
      toast.error("Por favor completa todos los campos obligatorios");
      return false;
    }
    if (form.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    if (!form.perfilId) {
      toast.error("No se pudo asignar el perfil base");
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();

      const registroData = {
        firebaseUid: user.uid,
        email: form.email,
        passwordHash: "firebase",
        perfilId: form.perfilId,
        persona: {
          nombre: form.nombre,
          apellido: form.apellido,
          direccion: form.direccion,
          telefono: form.telefono,
          correo: form.email,
        },
      };

      const res = await fetch("http://localhost:3000/api/usuarios/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(registroData),
      });

      if (res.ok) {
        toast.success("¡Registro exitoso!");
        setForm({
          nombre: "",
          apellido: "",
          direccion: "",
          telefono: "",
          email: "",
          password: "",
          perfilId: "",
        });

        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        const err = await res.json();
        toast.error(err.error || "Error al registrar usuario");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error en el registro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{ backgroundColor: "#FAFAF9" }}
      className="flex items-center justify-center min-h-screen p-4"
    >
      <Toaster position="top-right" />

      <div
        style={{
          backgroundColor: "#ffffff",
          borderTop: "4px solid #2E7D32",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
        className="w-full max-w-2xl rounded-lg p-8"
      >
        <div className="flex items-center justify-center mb-8">
          <Leaf size={32} style={{ color: "#2E7D32" }} className="mr-2" />
          <h1 style={{ color: "#333333" }} className="text-3xl font-bold">
            Registro
          </h1>
        </div>

        <p style={{ color: "#8F9779" }} className="text-center text-sm mb-8">
          Crea tu cuenta completando los siguientes datos
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="nombre"
                style={{ color: "#333333" }}
                className="block text-sm font-semibold mb-2"
              >
                Nombre *
              </label>
              <div className="relative">
                <User
                  size={20}
                  style={{ color: "#8F9779" }}
                  className="absolute left-3 top-3"
                />
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  style={{
                    borderColor: "#E9E4D8",
                    color: "#333333",
                  }}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition"
                  placeholder="Juan"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="apellido"
                style={{ color: "#333333" }}
                className="block text-sm font-semibold mb-2"
              >
                Apellido *
              </label>
              <div className="relative">
                <User
                  size={20}
                  style={{ color: "#8F9779" }}
                  className="absolute left-3 top-3"
                />
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  style={{
                    borderColor: "#E9E4D8",
                    color: "#333333",
                  }}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition"
                  placeholder="Pérez"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              style={{ color: "#333333" }}
              className="block text-sm font-semibold mb-2"
            >
              Correo electrónico *
            </label>
            <div className="relative">
              <Mail
                size={20}
                style={{ color: "#8F9779" }}
                className="absolute left-3 top-3"
              />
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={{
                  borderColor: "#E9E4D8",
                  color: "#333333",
                }}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition"
                placeholder="tu@correo.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              style={{ color: "#333333" }}
              className="block text-sm font-semibold mb-2"
            >
              Contraseña *
            </label>
            <div className="relative">
              <Lock
                size={20}
                style={{ color: "#8F9779" }}
                className="absolute left-3 top-3"
              />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                style={{
                  borderColor: "#E9E4D8",
                  color: "#333333",
                }}
                className="w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ? (
                  <EyeOff size={20} style={{ color: "#8F9779" }} />
                ) : (
                  <Eye size={20} style={{ color: "#8F9779" }} />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="direccion"
              style={{ color: "#333333" }}
              className="block text-sm font-semibold mb-2"
            >
              Dirección
            </label>
            <div className="relative">
              <MapPin
                size={20}
                style={{ color: "#8F9779" }}
                className="absolute left-3 top-3"
              />
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                style={{
                  borderColor: "#E9E4D8",
                  color: "#333333",
                }}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition"
                placeholder="Calle Principal 123"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="telefono"
              style={{ color: "#333333" }}
              className="block text-sm font-semibold mb-2"
            >
              Teléfono
            </label>
            <div className="relative">
              <Phone
                size={20}
                style={{ color: "#8F9779" }}
                className="absolute left-3 top-3"
              />
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                style={{
                  borderColor: "#E9E4D8",
                  color: "#333333",
                }}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition"
                placeholder="+34 123 456 789"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#2E7D32",
              color: "#ffffff",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#A5D6A7")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#2E7D32")}
            className="w-full py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center mt-6"
          >
            {loading ? (
              <div className="animate-spin">
                <Leaf size={20} />
              </div>
            ) : (
              "Registrarse"
            )}
          </button>
        </form>

        <div
          style={{ backgroundColor: "#E9E4D8" }}
          className="mt-6 p-4 rounded-lg text-center"
        >
          <p style={{ color: "#333333" }} className="text-sm">
            ¿Ya tienes una cuenta?{" "}
            <a
              href="/login"
              style={{ color: "#2E7D32" }}
              className="font-semibold hover:underline"
            >
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
