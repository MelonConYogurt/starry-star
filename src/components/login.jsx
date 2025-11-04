//React imports
import "../styles/global.css";
import { useState } from "react";

//Lib for cookies
import Cookies from "js-cookie";

//Firabase imports
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginComponent() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handlehtmlFormData(e) {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    setError("");
    setSuccess("");
  }

  async function LoginUser(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!formData.email || !formData.password) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      setSuccess("¡Inicio de sesión exitoso!");
      setFormData({ email: "", password: "" });

      const userData = {
        uid: userCredentials.user.uid,
        email: userCredentials.user.email,
        displayName: userCredentials.user.displayName,
        emailVerified: userCredentials.user.emailVerified,
      };

      //Save the cookie info
      Cookies.set("user", JSON.stringify(userData), { expires: 1 });

      window.location.href = "/";
    } catch (error) {
      setError(error.code);
      console.log(error.code, "Ocurrió un error. Intenta de nuevo.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>
        {error && (
          <div className="mb-4 text-red-500 text-center text-sm">{error}</div>
        )}
        {success && (
          <div className="mb-4 text-green-600 text-center text-sm">
            {success}
          </div>
        )}
        <form onSubmit={LoginUser}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-medium">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
              onChange={handlehtmlFormData}
              value={formData.email}
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-1 font-medium">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
              onChange={handlehtmlFormData}
              value={formData.password}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Iniciar sesión
          </button>
        </form>
        <div className="flex flex-col gap-1 items-center justify-center mt-5">
          <p>¿No tienes una cuenta?</p>
          <a href="/register" className="text-blue-400">
            Registrarse
          </a>
        </div>
      </div>
    </div>
  );
}
