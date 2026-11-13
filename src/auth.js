
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  deleteUser,
} from "firebase/auth";

import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db, googleProvider } from "./firebase";

function normalizeUsername(username = "") {
  return username.trim().replace(/^@/, "").toLowerCase();
}

function getErrorMessage(error) {
  const messages = {
    "auth/email-already-in-use": "Este correo ya está registrado.",
    "auth/invalid-email": "El correo electrónico no es válido.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/invalid-credential": "Usuario o contraseña incorrectos.",
    "auth/popup-closed-by-user": "Cerraste la ventana de Google.",
    "auth/cancelled-popup-request": "La solicitud de Google fue cancelada.",
    USERNAME_TAKEN: "Este nombre de usuario ya está ocupado.",
  };

  return messages[error.code] || error.message || "Ocurrió un error.";
}

export async function registerUser(userData) {
  let credential = null;

  try {
    const username = normalizeUsername(userData.username);

    if (!username) {
      return {
        success: false,
        message: "Escribe un nombre de usuario.",
      };
    }

    credential = await createUserWithEmailAndPassword(
      auth,
      userData.email.trim(),
      userData.password
    );

    const user = credential.user;

    await runTransaction(db, async (transaction) => {
      const usernameRef = doc(db, "usernames", username);
      const userRef = doc(db, "users", user.uid);

      const usernameSnapshot = await transaction.get(usernameRef);

      if (usernameSnapshot.exists()) {
        throw new Error("USERNAME_TAKEN");
      }

      transaction.set(userRef, {
        uid: user.uid,
        fullName: userData.fullName.trim(),
        username,
        email: user.email,
        photoURL: "",
        followersCount: 0,
        followingCount: 0,
        createdAt: serverTimestamp(),
      });

      transaction.set(usernameRef, {
        uid: user.uid,
        email: user.email,
      });
    });

    return {
      success: true,
      message: "Cuenta creada correctamente.",
    };
  } catch (error) {
    if (credential?.user) {
      try {
        await deleteUser(credential.user);
      } catch (deleteError) {
        console.error("Error al eliminar cuenta incompleta:", deleteError);
      }
    }

    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}

export async function loginUser(username, password) {
  try {
    const normalizedUsername = normalizeUsername(username);

    if (!normalizedUsername) {
      return {
        success: false,
        message: "Escribe tu nombre de usuario.",
      };
    }

    const usernameRef = doc(db, "usernames", normalizedUsername);
    const usernameSnapshot = await getDoc(usernameRef);

    if (!usernameSnapshot.exists()) {
      return {
        success: false,
        message: "El nombre de usuario no existe.",
      };
    }

    const email = usernameSnapshot.data().email;

    await signInWithEmailAndPassword(auth, email, password);

    return {
      success: true,
      message: "Inicio de sesión correcto.",
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      const emailPrefix = user.email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "");

      const username = `${emailPrefix}_${user.uid.slice(0, 6)}`;

      await runTransaction(db, async (transaction) => {
        const usernameRef = doc(db, "usernames", username);
        const usernameSnapshot = await transaction.get(usernameRef);

        if (usernameSnapshot.exists()) {
          throw new Error("USERNAME_TAKEN");
        }

        transaction.set(userRef, {
          uid: user.uid,
          fullName: user.displayName || "Usuario",
          username,
          email: user.email,
          photoURL: user.photoURL || "",
          followersCount: 0,
          followingCount: 0,
          createdAt: serverTimestamp(),
        });

        transaction.set(usernameRef, {
          uid: user.uid,
          email: user.email,
        });
      });
    }

    return {
      success: true,
      message: "Inicio de sesión con Google correcto.",
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}

export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback(null);
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        callback({
          ...userSnapshot.data(),
          uid: user.uid,
        });
      } else {
        callback({
          uid: user.uid,
          fullName: user.displayName || "Usuario",
          email: user.email,
          photoURL: user.photoURL || "",
          username: user.email?.split("@")[0] || "usuario",
          followersCount: 0,
          followingCount: 0,
        });
      }
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
      callback(null);
    }
  });
}

export async function logoutUser() {
  try {
    await signOut(auth);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}
