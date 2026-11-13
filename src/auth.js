
const USERS_KEY = "clonx_users";
const SESSION_KEY = "clonx_session";

// Obtener los usuarios registrados
export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

// Obtener el usuario con sesión activa
export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

// Registrar un nuevo usuario
export function registerUser(userData) {
  const users = getUsers();

  const email = userData.email.trim().toLowerCase();
  const username = userData.username.trim().replace(/^@/, "");

  const emailExists = users.some(
    (user) => user.email.toLowerCase() === email
  );

  if (emailExists) {
    return {
      success: false,
      message: "Este correo electrónico ya está registrado.",
    };
  }

  const usernameExists = users.some(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );

  if (usernameExists) {
    return {
      success: false,
      message: "Este nombre de usuario ya está registrado.",
    };
  }

  const newUser = {
    id: Date.now(),
    fullName: userData.fullName.trim(),
    username,
    email,
    password: userData.password,
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  const session = {
    id: newUser.id,
    fullName: newUser.fullName,
    username: newUser.username,
    email: newUser.email,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("clonx-auth-change"));

  return {
    success: true,
    user: session,
  };
}

// Iniciar sesión
export function loginUser(username, password) {
  const users = getUsers();

  const normalizedUsername = username.trim().replace(/^@/, "").toLowerCase();

  const user = users.find(
    (user) =>
      user.username.toLowerCase() === normalizedUsername &&
      user.password === password
  );

  if (!user) {
    return {
      success: false,
      message: "Nombre de usuario o contraseña incorrectos.",
    };
  }

  const session = {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("clonx-auth-change"));

  return {
    success: true,
    user: session,
  };
}

// Cerrar sesión
export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("clonx-auth-change"));
}
