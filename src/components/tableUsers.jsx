import getUsers from "../utils/api/users/getUsers";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function TableUsers() {
  const [users, SetUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        console.log(token);

        const response = await getUsers(token);
        if (response) {
          SetUsers(response);
        }
      } else {
        console.log("No user is signed in");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="m-5">
      {users && users.length > 0 ? (
        <div className="rounded-lg overflow-hidden w-full">
          <table className="table-auto w-full overflow-x-scroll ">
            <thead className="bg-gray-200 ">
              <tr className="py-5">
                <th className="py-5">Avatar</th>
                <th>Nombre</th>
                <th>Edad</th>
                <th>Email</th>
                <th>Género</th>
                <th>Usuario</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {users.map((user) => (
                <tr key={user._id} className=" border-t border-gray-200">
                  <td className="px-6 py-3 border border-gray-200">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name ?? "avatar"}
                        width="50"
                        height="50"
                        style={{ borderRadius: 4 }}
                      />
                    ) : null}
                  </td>
                  <td className="px-6 py-3 border border-gray-200">
                    {user.name}
                  </td>
                  <td className="px-6 py-3 border border-gray-200">
                    {user.age}
                  </td>
                  <td className="px-6 py-3 border border-gray-200">
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td className="px-6 py-3 border border-gray-200">
                    {user.gender}
                  </td>
                  <td className="px-6 py-3 border border-gray-200">
                    {user.username}
                  </td>
                  <td
                    className="px-6 py-3 border border-gray-200"
                    style={{ fontSize: "0.8em", color: "#666" }}
                  >
                    {user._id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No hay usuarios.</p>
      )}
    </section>
  );
}
