
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

function ComposePage({ currentUser }) {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const text = content.trim();

    if (!text) {
      setError("Escribe algo antes de publicar.");
      return;
    }

    if (text.length > 280) {
      setError("La publicación no puede superar los 280 caracteres.");
      return;
    }

    if (!auth.currentUser) {
      setError("Debes iniciar sesión para publicar.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "tweets"), {
        content: text,
        authorId: auth.currentUser.uid,
        fullName: currentUser.fullName,
        username: currentUser.username,
        photoURL: currentUser.photoURL || "",
        createdAt: serverTimestamp(),
      });

      navigate("/feed");
    } catch (error) {
      console.error("Error al publicar:", error);
      setError("No se pudo publicar. Revisa los permisos de Firestore.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <section className="card border-0 shadow-sm">
          <div className="card-body p-4 p-md-5">
            <p className="text-primary fw-semibold mb-1">
              Nueva publicación
            </p>

            <h1 className="h3 mb-2">¿Qué está pasando?</h1>

            <p className="text-secondary mb-4">
              Comparte una idea con tu comunidad.
            </p>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="tweetContent">
                  Mensaje
                </label>

                <textarea
                  className="form-control"
                  id="tweetContent"
                  name="content"
                  rows="5"
                  placeholder="Escribe tu tweet..."
                  maxLength={280}
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  required
                />
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className={content.length > 280 ? "text-danger" : "text-secondary"}>
                  {content.length}/280 caracteres
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <Link className="btn btn-link text-decoration-none px-0" to="/home">
                  Cancelar
                </Link>

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={loading || !content.trim() || content.length > 280}
                >
                  {loading ? "Publicando..." : "Publicar"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ComposePage;
