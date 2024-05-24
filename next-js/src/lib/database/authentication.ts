import { Endpoints } from "./endpoints";

export async function login(email: string, password: string) {
  try {
    const response = await fetch(Endpoints.authentication + "signin", {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email, 
        password: password 
      }),
    });
    if (response.status != 200) {
      return null;
    }
    return (await response.json()).token;
  } catch (error) {
    //TODO: Handle error
    console.log('Error:', error);
    return null;
  }
}

export async function decodeToken(token: string) {
  try {
    const response = await fetch(Endpoints.authentication + "decodeToken", {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token }),
    });
    if (response.status != 200) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}