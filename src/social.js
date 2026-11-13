
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  runTransaction,
  increment,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

// ========================================
// SEGUIDORES
// ========================================

export async function followUser(currentUserId, targetUserId) {
  if (!currentUserId || !targetUserId || currentUserId === targetUserId) {
    throw new Error("No puedes seguir a este usuario.");
  }

  const currentRef = doc(db, "users", currentUserId);
  const targetRef = doc(db, "users", targetUserId);

  const followingRef = doc(
    db, "users", currentUserId, "following", targetUserId
  );

  const followerRef = doc(
    db, "users", targetUserId, "followers", currentUserId
  );

  await runTransaction(db, async (transaction) => {
    const followingSnapshot = await transaction.get(followingRef);

    if (followingSnapshot.exists()) return;

    const targetSnapshot = await transaction.get(targetRef);

    if (!targetSnapshot.exists()) {
      throw new Error("El usuario no existe.");
    }

    transaction.set(followingRef, {
      uid: targetUserId,
      createdAt: serverTimestamp(),
    });

    transaction.set(followerRef, {
      uid: currentUserId,
      createdAt: serverTimestamp(),
    });

    transaction.update(currentRef, {
      followingCount: increment(1),
    });

    transaction.update(targetRef, {
      followersCount: increment(1),
    });
  });
}

export async function unfollowUser(currentUserId, targetUserId) {
  const currentRef = doc(db, "users", currentUserId);
  const targetRef = doc(db, "users", targetUserId);

  const followingRef = doc(
    db, "users", currentUserId, "following", targetUserId
  );

  const followerRef = doc(
    db, "users", targetUserId, "followers", currentUserId
  );

  await runTransaction(db, async (transaction) => {
    const followingSnapshot = await transaction.get(followingRef);

    if (!followingSnapshot.exists()) return;

    transaction.delete(followingRef);
    transaction.delete(followerRef);

    transaction.update(currentRef, {
      followingCount: increment(-1),
    });

    transaction.update(targetRef, {
      followersCount: increment(-1),
    });
  });
}

// ========================================
// LISTAS DE USUARIOS
// ========================================

export async function getUsersByIds(ids) {
  const results = await Promise.all(
    ids.map(async (id) => {
      const snapshot = await getDoc(doc(db, "users", id));

      return snapshot.exists()
        ? { id: snapshot.id, ...snapshot.data() }
        : null;
    })
  );

  return results.filter(Boolean);
}

export async function getFollowingUsers(userId) {
  const snapshot = await getDocs(
    collection(db, "users", userId, "following")
  );

  return getUsersByIds(snapshot.docs.map((item) => item.id));
}

export async function getFollowerUsers(userId) {
  const snapshot = await getDocs(
    collection(db, "users", userId, "followers")
  );

  return getUsersByIds(snapshot.docs.map((item) => item.id));
}

// ========================================
// BUSCAR USUARIOS
// ========================================

export async function searchUserByUsername(username) {
  const normalized = username.trim().replace(/^@/, "").toLowerCase();

  if (!normalized) return null;

  const usersQuery = query(
    collection(db, "users"),
    where("username", "==", normalized)
  );

  const snapshot = await getDocs(usersQuery);

  if (snapshot.empty) return null;

  const result = snapshot.docs[0];

  return { id: result.id, ...result.data() };
}

export async function isFollowing(currentUserId, targetUserId) {
  const reference = doc(
    db, "users", currentUserId, "following", targetUserId
  );

  const snapshot = await getDoc(reference);
  return snapshot.exists();
}

// ========================================
// LIKES
// ========================================

export async function toggleTweetLike(tweetId, userId) {
  if (!tweetId || !userId) {
    throw new Error("Falta información para dar Me gusta.");
  }

  const tweetRef = doc(db, "tweets", tweetId);
  const likeRef = doc(db, "tweets", tweetId, "likes", userId);

  return await runTransaction(db, async (transaction) => {
    const likeSnapshot = await transaction.get(likeRef);
    const tweetSnapshot = await transaction.get(tweetRef);

    if (!tweetSnapshot.exists()) {
      throw new Error("La publicación no existe.");
    }

    if (likeSnapshot.exists()) {
      transaction.delete(likeRef);
      transaction.update(tweetRef, {
        likesCount: increment(-1),
      });

      return false;
    }

    transaction.set(likeRef, {
      userId,
      createdAt: serverTimestamp(),
    });

    transaction.update(tweetRef, {
      likesCount: increment(1),
    });

    return true;
  });
}

export async function hasLikedTweet(tweetId, userId) {
  if (!tweetId || !userId) return false;

  const likeRef = doc(db, "tweets", tweetId, "likes", userId);
  const snapshot = await getDoc(likeRef);

  return snapshot.exists();
}

// ========================================
// COMPARTIR / REPUBLICAR
// ========================================

export async function shareTweet(currentUser, originalTweet, comment = "") {
  if (!currentUser?.uid || !originalTweet?.id) {
    throw new Error("No se pudo identificar la publicación.");
  }

  const sharedTweet = {
    originalTweetId: originalTweet.id,
    originalAuthorId: originalTweet.authorId,
    content: originalTweet.content || "",
    fullName: originalTweet.fullName || "Usuario desconocido",
    username: originalTweet.username || "usuario",
    photoURL: originalTweet.photoURL || "",
    createdAt: originalTweet.createdAt || null,
  };

  const newTweet = {
    authorId: currentUser.uid,
    fullName: currentUser.fullName || currentUser.displayName || "Usuario",
    username: currentUser.username || "usuario",
    photoURL: currentUser.photoURL || "",
    content: comment.trim(),
    sharedTweetId: originalTweet.id,
    sharedTweet,
    isShare: true,
    likesCount: 0,
    createdAt: serverTimestamp(),
  };

  const reference = await addDoc(collection(db, "tweets"), newTweet);

  return reference.id;
}
