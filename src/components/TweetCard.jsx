
import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  hasLikedTweet,
  toggleTweetLike,
  shareTweet,
} from "../social";

function TweetCard({ tweet, user, currentUser }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(tweet.likesCount ?? 0);
  const [liking, setLiking] = useState(false);

  const [showShare, setShowShare] = useState(false);
  const [shareComment, setShareComment] = useState("");
  const [sharing, setSharing] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fullName = user?.fullName ?? "Usuario desconocido";
  const username = user?.username ?? "usuario";

  const date = tweet.createdAt?.toDate
    ? tweet.createdAt.toDate()
    : tweet.createdAt
      ? new Date(tweet.createdAt)
      : null;

  const publishedAt = date && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat("es-CO", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date)
    : "Fecha pendiente";

  useEffect(() => {
    let active = true;

    async function checkLike() {
      if (!currentUser?.uid || !tweet.id) return;

      try {
        const result = await hasLikedTweet(tweet.id, currentUser.uid);

        if (active) setLiked(result);
      } catch (error) {
        console.error("Error comprobando like:", error);
      }
    }

    checkLike();

    return () => {
      active = false;
    };
  }, [tweet.id, currentUser?.uid]);

  useEffect(() => {
    setLikesCount(tweet.likesCount ?? 0);
  }, [tweet.likesCount]);

  async function handleLike() {
    if (!currentUser?.uid || liking) return;

    setLiking(true);
    setError("");
    setMessage("");

    try {
      const result = await toggleTweetLike(tweet.id, currentUser.uid);

      setLiked(result);
      setLikesCount((previous) =>
        Math.max(0, previous + (result ? 1 : -1))
      );
    } catch (error) {
      console.error("Error al dar like:", error);
      setError("No se pudo actualizar el Me gusta.");
    } finally {
      setLiking(false);
    }
  }

  async function handleShare(event) {
    event.preventDefault();

    if (!currentUser?.uid || sharing) return;

    setSharing(true);
    setError("");
    setMessage("");

    try {
      await shareTweet(currentUser, tweet, shareComment);

      setShareComment("");
      setShowShare(false);
      setMessage("¡Publicación compartida correctamente!");
    } catch (error) {
      console.error("Error al compartir:", error);
      setError("No se pudo compartir la publicación.");
    } finally {
      setSharing(false);
    }
  }

  return (
    <article className="card border-0 shadow-sm mb-3">
      <div className="card-body p-4">

        <p className="fw-semibold mb-2">
          <Link
            className="text-body text-decoration-none"
            to={`/users/${username}`}
          >
            {fullName}
          </Link>

          {", "}

          <span className="text-secondary">
            @{username}
          </span>

          <span className="text-secondary">
            {" - "}{publishedAt}
          </span>
        </p>

        {tweet.isShare && (
          <p className="text-secondary small mb-2">
            🔁 Republicó una publicación
          </p>
        )}

        {tweet.content && (
          <p className="mb-3 text-break">
            {tweet.content}
          </p>
        )}

        {tweet.sharedTweet && (
          <div className="border rounded p-3 mb-3">
            <p className="small mb-2">
              <Link
                to={`/users/${tweet.sharedTweet.username || "usuario"}`}
                className="fw-semibold text-decoration-none"
              >
                {tweet.sharedTweet.fullName || "Usuario desconocido"}
              </Link>

              <span className="text-secondary">
                {" "}@{tweet.sharedTweet.username || "usuario"}
              </span>
            </p>

            <p className="mb-0 text-break">
              {tweet.sharedTweet.content}
            </p>
          </div>
        )}

        <hr />

        <div className="d-flex align-items-center gap-4 flex-wrap">

          <button
            type="button"
            className={`btn btn-sm ${
              liked ? "btn-danger" : "btn-outline-danger"
            }`}
            onClick={handleLike}
            disabled={liking}
          >
            {liking ? "..." : liked ? "♥ Te gusta" : "♡ Me gusta"}
            {" "}
            ({likesCount})
          </button>

          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={() => {
              setShowShare(!showShare);
              setError("");
              setMessage("");
            }}
          >
            🔁 Compartir
          </button>

        </div>

        {showShare && (
          <form onSubmit={handleShare} className="mt-3">

            <label className="form-label fw-semibold">
              Añade un comentario (opcional)
            </label>

            <textarea
              className="form-control mb-2"
              rows="3"
              maxLength={280}
              placeholder="¿Qué quieres decir al compartir?"
              value={shareComment}
              onChange={(event) =>
                setShareComment(event.target.value)
              }
            />

            <div className="d-flex justify-content-between align-items-center">
              <small className="text-secondary">
                {shareComment.length}/280
              </small>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setShowShare(false)}
                  disabled={sharing}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={sharing}
                >
                  {sharing ? "Compartiendo..." : "Republicar"}
                </button>
              </div>
            </div>
          </form>
        )}

        {error && (
          <div className="text-danger small mt-3" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="text-success small mt-3" role="status">
            {message}
          </div>
        )}

      </div>
    </article>
  );
}

export default TweetCard;
