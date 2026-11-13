
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase";

import {
  searchUserByUsername,
  followUser,
  unfollowUser,
  isFollowing,
} from "../social";

import Pagination, { PAGE_SIZE } from "../components/Pagination";
import TweetCard from "../components/TweetCard";

function UserTweetsPage({ currentUser }) {
  const { username } = useParams();

  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [following, setFollowing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setError("");
        setUser(null);
        setTweets([]);
        setFollowing(false);

        if (!currentUser?.uid || !username) {
          return;
        }

        // Buscar el usuario por su nombre
        const foundUser = await searchUserByUsername(username);

        if (!active) return;

        if (!foundUser) {
          setUser(null);
          return;
        }

        setUser(foundUser);

        // Obtener las publicaciones del usuario
        const tweetsQuery = query(
          collection(db, "tweets"),
          where("authorId", "==", foundUser.uid || foundUser.id)
        );

        const snapshot = await getDocs(tweetsQuery);

        if (!active) return;

        const loadedTweets = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        // Ordenar por fecha, de más reciente a más antigua
        loadedTweets.sort((a, b) => {
          const dateA = a.createdAt?.toMillis?.() || 0;
          const dateB = b.createdAt?.toMillis?.() || 0;
          return dateB - dateA;
        });

        setTweets(loadedTweets);
        setCurrentPage(1);

        // Comprobar si la cuenta actual sigue a este usuario
        if (foundUser.id !== currentUser.uid) {
          const result = await isFollowing(
            currentUser.uid,
            foundUser.id
          );

          if (!active) return;

          setFollowing(result);
        }
      } catch (err) {
        console.error("Error al cargar perfil:", err);

        if (active) {
          setError(
            err.code === "permission-denied"
              ? "No tienes permisos para consultar este perfil o sus publicaciones."
              : err.code === "failed-precondition"
                ? "Firestore necesita revisar un índice para esta consulta."
                : `No se pudo cargar el perfil: ${err.message}`
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [username, currentUser?.uid]);

  async function handleFollow() {
    if (!user || actionLoading) return;

    setActionLoading(true);
    setError("");

    try {
      if (following) {
        await unfollowUser(currentUser.uid, user.id);

        setFollowing(false);

        setUser((previous) => ({
          ...previous,
          followersCount: Math.max(
            0,
            (previous.followersCount || 0) - 1
          ),
        }));
      } else {
        await followUser(currentUser.uid, user.id);

        setFollowing(true);

        setUser((previous) => ({
          ...previous,
          followersCount: (previous.followersCount || 0) + 1,
        }));
      }
    } catch (err) {
      console.error("Error al actualizar seguimiento:", err);
      setError("No se pudo actualizar el seguimiento.");
    } finally {
      setActionLoading(false);
    }
  }

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleTweets = tweets.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  if (loading) {
    return (
      <p className="text-secondary">Cargando perfil...</p>
    );
  }

  if (error && !user) {
    return (
      <div className="alert alert-danger">
        {error}
        <div className="mt-2">
          <Link to="/feed">Volver al feed</Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="alert alert-warning">
        No encontramos ese usuario.{" "}
        <Link to="/feed">Volver al feed</Link>
      </div>
    );
  }

  return (
    <section>
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-sm-row justify-content-between gap-3">
            <div>
              <h1 className="h3 mb-1">{user.fullName}</h1>

              <p className="text-secondary mb-3">
                @{user.username}
              </p>

              <div className="d-flex flex-wrap gap-4">
                <span>
                  <strong>{user.followersCount || 0}</strong>{" "}
                  seguidores
                </span>

                <span>
                  <strong>{user.followingCount || 0}</strong>{" "}
                  siguiendo
                </span>
              </div>
            </div>

            {user.id !== currentUser.uid && (
              <button
                className={`btn align-self-sm-start ${
                  following
                    ? "btn-outline-primary"
                    : "btn-primary"
                }`}
                type="button"
                onClick={handleFollow}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Procesando..."
                  : following
                    ? "Dejar de seguir"
                    : "Seguir"}
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <h2 className="h5 mb-3">Publicaciones</h2>

      {visibleTweets.length > 0 ? (
        visibleTweets.map((tweet) => (
          <TweetCard
            key={tweet.id}
            tweet={tweet}
            user={user}
          />
        ))
      ) : (
        <div className="alert alert-light border">
          Este usuario todavía no tiene publicaciones.
        </div>
      )}

      {tweets.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={tweets.length}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
}

export default UserTweetsPage;
