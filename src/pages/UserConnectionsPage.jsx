
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import {
  searchUserByUsername,
  getFollowingUsers,
  getFollowerUsers,
  isFollowing,
} from "../social";

import Pagination, { PAGE_SIZE } from "../components/Pagination";
import UserCard from "../components/UserCard";

function UserConnectionsPage({ currentUser }) {
  const { username, type } = useParams();

  const [profileUser, setProfileUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadConnections() {
      try {
        setLoading(true);
        setError("");
        setProfileUser(null);
        setUsers([]);
        setFollowingIds([]);
        setCurrentPage(1);

        const foundUser = await searchUserByUsername(username);

        if (!active) return;

        if (!foundUser) {
          setError("No encontramos ese usuario.");
          return;
        }

        if (type !== "followers" && type !== "following") {
          setError("La lista solicitada no existe.");
          return;
        }

        setProfileUser(foundUser);

        const result =
          type === "followers"
            ? await getFollowerUsers(foundUser.id)
            : await getFollowingUsers(foundUser.id);

        if (!active) return;

        result.sort((a, b) =>
          (a.fullName || "").localeCompare(
            b.fullName || "",
            "es"
          )
        );

        setUsers(result);

        const followingResults = await Promise.all(
          result.map(async (user) => ({
            id: user.id,
            following: user.id === currentUser.uid
              ? false
              : await isFollowing(currentUser.uid, user.id),
          }))
        );

        if (!active) return;

        setFollowingIds(
          followingResults
            .filter((item) => item.following)
            .map((item) => item.id)
        );
      } catch (err) {
        console.error("Error al cargar conexiones:", err);

        if (active) {
          setError("No se pudo cargar la lista de usuarios.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadConnections();

    return () => {
      active = false;
    };
  }, [username, type, currentUser.uid]);

  function handleFollowChange(userId, following) {
    setFollowingIds((previous) =>
      following
        ? [...new Set([...previous, userId])]
        : previous.filter((id) => id !== userId)
    );
  }

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleUsers = users.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const isFollowers = type === "followers";
  const title = isFollowers ? "Seguidores" : "Siguiendo";

  if (loading) {
    return <p className="text-secondary">Cargando usuarios...</p>;
  }

  if (error) {
    return (
      <div className="alert alert-warning">
        {error}
        <div className="mt-2">
          <Link to="/feed">Volver al feed</Link>
        </div>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-4">
        <Link
          to={`/users/${profileUser.username}`}
          className="text-decoration-none"
        >
          ← Volver al perfil de @{profileUser.username}
        </Link>

        <h1 className="h2 mt-3 mb-1">
          {title} de {profileUser.fullName}
        </h1>

        <p className="text-secondary mb-0">
          {users.length} personas
        </p>
      </div>

      {users.length === 0 ? (
        <div className="alert alert-light border">
          {isFollowers
            ? "Este usuario todavía no tiene seguidores."
            : "Este usuario todavía no sigue a nadie."}
        </div>
      ) : (
        visibleUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            currentUser={currentUser}
            isFollowing={followingIds.includes(user.id)}
            onFollowChange={handleFollowChange}
          />
        ))
      )}

      <Pagination
        currentPage={currentPage}
        totalItems={users.length}
        onPageChange={setCurrentPage}
      />
    </section>
  );
}

export default UserConnectionsPage;
