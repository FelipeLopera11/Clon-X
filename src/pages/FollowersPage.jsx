
import { useEffect, useState } from "react";
import { getFollowerUsers, isFollowing } from "../social";
import Pagination, { PAGE_SIZE } from "../components/Pagination";
import UserCard from "../components/UserCard";

function FollowersPage({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        const followers = await getFollowerUsers(currentUser.uid);

        const followingResults = await Promise.all(
          followers.map(async (user) => ({
            id: user.id,
            following: await isFollowing(currentUser.uid, user.id),
          }))
        );

        followers.sort((a, b) =>
          a.fullName.localeCompare(b.fullName, "es")
        );

        setUsers(followers);
        setFollowingIds(
          followingResults
            .filter((item) => item.following)
            .map((item) => item.id)
        );
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los seguidores.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [currentUser.uid]);

  function handleFollowChange(userId, following) {
    setFollowingIds((previous) =>
      following
        ? [...previous, userId]
        : previous.filter((id) => id !== userId)
    );
  }

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleUsers = users.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <section>
      <div className="mb-4">
        <p className="text-primary fw-semibold mb-1">Tu comunidad</p>
        <h1 className="h2 mb-1">Seguidores</h1>
        <p className="text-secondary mb-0">{users.length} personas</p>
      </div>

      {loading && <p>Cargando seguidores...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && users.length === 0 && (
        <div className="alert alert-light border">
          Todavía no tienes seguidores.
        </div>
      )}

      {visibleUsers.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          currentUser={currentUser}
          isFollowing={followingIds.includes(user.id)}
          onFollowChange={handleFollowChange}
        />
      ))}

      <Pagination
        currentPage={currentPage}
        totalItems={users.length}
        onPageChange={setCurrentPage}
      />
    </section>
  );
}

export default FollowersPage;
