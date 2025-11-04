const BASE_URL = "http://localhost:3000";

export default async function getUsers(token) {
  try {
    const response = await fetch(`${BASE_URL}/users?limit=${10}&skip=${0}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}
