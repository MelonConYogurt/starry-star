const BASE_URL = "http://localhost:3000";

export default async function createUser(token, user) {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
