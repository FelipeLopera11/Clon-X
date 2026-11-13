
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  runTransaction,
  increment,
} from "firebase/firestore";

import { db } from "./firebase";

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
      createdAt: new Date(),
    });

    transaction.set(followerRef, {
      uid: currentUserId,
      createdAt: new Date(),
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
