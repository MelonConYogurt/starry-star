import "../styles/global.css";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Leaf } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      toast.error("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredentials.user;
      const token = await user.getIdToken();

      const res = await fetch(
        `http://localhost:3000/api/usuarios/byFirebaseUid/${user.uid}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok)
        throw new Error("No se pudo obtener la información del usuario.");

      const backendUser = await res.json();
      const perfil = backendUser?.perfilId?.nombre || "Usuario";

      Cookies.set(
        "user",
        JSON.stringify({
          firebase: { uid: user.uid, email: user.email },
          backend: backendUser,
          token,
          perfil,
        }),
        { expires: 1 }
      );

      toast.success("¡Inicio de sesión exitoso!");
      setFormData({ email: "", password: "" });

      setTimeout(() => {
        window.location.href =
          perfil === "Administrador" || perfil === "Superadministrador"
            ? "/admin"
            : "/";
      }, 1000);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast.error("Credenciales inválidas o error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset(e) {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Por favor, ingresa tu correo electrónico.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success(
        "Correo de recuperación enviado. Revisa tu bandeja de entrada."
      );
      setResetEmail("");
      setResetting(false);
    } catch (error) {
      console.error("Error al enviar correo de recuperación:", error);
      toast.error("No se pudo enviar el correo. Verifica el email ingresado.");
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
        className="w-full max-w-md rounded-lg p-8"
      >
        <div className="flex items-center justify-center mb-8">
          <Leaf size={32} style={{ color: "#2E7D32" }} className="mr-2" />
          <h1 style={{ color: "#333333" }} className="text-3xl font-bold">
            Acceso
          </h1>
        </div>

        <p style={{ color: "#8F9779" }} className="text-center text-sm mb-8">
          Ingresa tu correo y contraseña para continuar
        </p>

        {!resetting ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                style={{ color: "#333333" }}
                className="block text-sm font-semibold mb-2"
              >
                Correo electrónico
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
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition"
                  style={{
                    borderColor: "#E9E4D8",
                    color: "#333333",
                    "--tw-ring-color": "#A5D6A7",
                  }}
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
                Contraseña
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
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition"
                  style={{
                    borderColor: "#E9E4D8",
                    color: "#333333",
                    "--tw-ring-color": "#A5D6A7",
                  }}
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

            <div className="text-center">
              <button
                type="button"
                onClick={() => setResetting(true)}
                className="text-sm text-green-700 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
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
                  <Lock size={20} />
                </div>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-5">
            <div>
              <label
                htmlFor="resetEmail"
                className="block text-sm font-semibold mb-2"
                style={{ color: "#333333" }}
              >
                Ingresa tu correo para recuperar la contraseña
              </label>
              <input
                type="email"
                id="resetEmail"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition"
                style={{
                  borderColor: "#E9E4D8",
                  color: "#333333",
                  "--tw-ring-color": "#A5D6A7",
                }}
                placeholder="tu@correo.com"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg font-semibold transition-all duration-200 mt-4"
              style={{
                backgroundColor: "#2E7D32",
                color: "#ffffff",
              }}
            >
              Enviar correo de recuperación
            </button>

            <button
              type="button"
              onClick={() => setResetting(false)}
              className="w-full py-2 text-sm text-gray-600 hover:underline"
            >
              Volver al inicio de sesión
            </button>
          </form>
        )}

        <div
          style={{ backgroundColor: "#E9E4D8" }}
          className="mt-6 p-4 rounded-lg text-center"
        >
          <p style={{ color: "#333333" }} className="text-sm">
            ¿No tienes una cuenta?{" "}
            <a
              href="/register"
              style={{ color: "#2E7D32" }}
              className="font-semibold hover:underline"
            >
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
