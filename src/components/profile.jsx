import "../styles/global.css";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function UserProfile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUserData(parsedUser);
      } catch (error) {
        console.error("Error parsing user data from cookie:", error);
      }
    }
  }, []);

  return (
    <main className="w-full h-screen flex flex-col justify-center items-center">
      {userData ? (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col justify-center items-center gap-2 border border-gray-200">
          <h2>Perfil de Usuario</h2>
          <p>Email: {userData.email}</p>
          {userData.displayName && <p>Nombre: {userData.displayName}</p>}
          {userData.uid && <p>ID: {userData.uid}</p>}
        </div>
      ) : (
        <p className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center border border-gray-200">
          No hay datos de usuario en cookies
        </p>
      )}
    </main>
  );
}
