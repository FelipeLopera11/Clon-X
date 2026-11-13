
import { useEffect, useState } from "react";
import { getFollowingUsers } from "../social";
import Pagination, { PAGE_SIZE } from "../components/Pagination";
import UserCard from "../components/UserCard";

function FollowingPage({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    try {
      const result = await getFollowingUsers(currentUser.uid);
      result.sort((a, b) =>
        a.fullName.localeCompare(b.fullName, "es")
      );
      setUsers(result);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los usuarios seguidos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [currentUser.uid]);

  function handleFollowChange(userId, following) {
    if (!following) {
      setUsers((previous) => previous.filter((user) => user.id !== userId));
    }
  }

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleUsers = users.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <section>
      <div className="mb-4">
        <p className="text-primary fw-semibold mb-1">Tu comunidad</p>
        <h1 className="h2 mb-1">Usuarios seguidos</h1>
        <p className="text-secondary mb-0">{users.length} personas</p>
      </div>

      {loading && <p>Cargando usuarios...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && users.length === 0 && (
        <div className="alert alert-light border">
          Todavía no sigues a ningún usuario.
        </div>
      )}

      {visibleUsers.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          currentUser={currentUser}
          isFollowing
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

export default FollowingPage;
