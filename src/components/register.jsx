import "../styles/global.css";
import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function RegisterComponent() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handlehtmlFormData(e) {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    setError("");
    setSuccess("");
  }

  async function registerUser(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!formData.email || !formData.password) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      setSuccess("¡Registro exitoso! Ahora puedes iniciar sesión.");
      setFormData({ email: "", password: "" });
      console.log(userCredentials);

      //mandar al login si algo 
    } catch (error) {
      setError(error.code);
      console.log(error.code, "Ocurrió un error. Intenta de nuevo.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Registro</h1>
        {error && (
          <div className="mb-4 text-red-500 text-center text-sm">{error}</div>
        )}
        {success && (
          <div className="mb-4 text-green-600 text-center text-sm">
            {success}
          </div>
        )}
        <form onSubmit={registerUser}>
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
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
