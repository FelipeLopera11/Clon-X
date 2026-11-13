
import { useState } from "react";
import { Link } from "react-router";
import { followUser, unfollowUser } from "../social";

function UserCard({
  user,
  currentUser,
  isFollowing = false,
  onFollowChange,
}) {
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFollow() {
    if (!currentUser?.uid || loading) return;

    setLoading(true);
    setError("");

    try {
      if (following) {
        await unfollowUser(currentUser.uid, user.id);
        setFollowing(false);
        onFollowChange?.(user.id, false);
      } else {
        await followUser(currentUser.uid, user.id);
        setFollowing(true);
        onFollowChange?.(user.id, true);
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar el seguimiento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="card border-0 shadow-sm mb-3">
      <div className="card-body d-flex justify-content-between align-items-center gap-3">
        <div>
          <Link
            className="fw-semibold text-body text-decoration-none"
            to={`/users/${user.username}`}
          >
            {user.fullName}
          </Link>

          <p className="text-secondary mb-0">@{user.username}</p>
        </div>

        {currentUser?.uid !== user.id && (
          <button
            className={`btn ${
              following ? "btn-outline-primary" : "btn-primary"
            }`}
            type="button"
            onClick={handleFollow}
            disabled={loading}
          >
            {loading
              ? "Procesando..."
              : following
                ? "Dejar de seguir"
                : "Seguir"}
          </button>
        )}
      </div>

      {error && (
        <div className="px-3 pb-2 text-danger small">{error}</div>
      )}
    </article>
  );
}

export default UserCard;
