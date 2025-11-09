import Cookies from "js-cookie";
import AdminTabs from "../components/AdminTabs";
import "../styles/global.css";

export default function AdminPage() {
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;

  if (
    !user ||
    (user.perfil !== "Administrador" && user.perfil !== "Superadministrador")
  ) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Panel de Administración
        </h1>
      </div>
      <AdminTabs token={user.token} />
    </div>
  );
}
