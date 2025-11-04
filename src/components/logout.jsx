import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useEffect } from "react";

//Lib for cookies
import Cookies from "js-cookie";

export default function SingOut() {
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(auth);
        Cookies.remove("user");
        window.location.href = "/login";
      } catch (error) {
        console.log("Error al cerrar sesión:", error);
      }
    };

    handleLogout();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <p className="text-lg">Cerrando sesión...</p>
    </div>
  );
}
