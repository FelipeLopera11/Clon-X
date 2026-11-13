
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase";
import Pagination, { PAGE_SIZE } from "../components/Pagination";
import TweetCard from "../components/TweetCard";

function FeedPage() {
  const [tweets, setTweets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const tweetsQuery = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      tweetsQuery,
      (snapshot) => {
        const loadedTweets = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        setTweets(loadedTweets);
        setLoading(false);
        setError("");
      },
      (firebaseError) => {
        console.error("Error al cargar publicaciones:", firebaseError);
        setError("No se pudieron cargar las publicaciones.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleTweets = tweets.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <section>
      <div className="mb-4">
        <p className="text-primary fw-semibold mb-1">
          Lo último de tu comunidad
        </p>
        <h1 className="h2 mb-0">Feed</h1>
      </div>

      {loading && (
        <p className="text-secondary">Cargando publicaciones...</p>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && tweets.length === 0 && (
        <div className="alert alert-light border" role="status">
          Todavía no hay publicaciones. ¡Sé el primero en publicar!
        </div>
      )}

      {!loading &&
        visibleTweets.map((tweet) => {
          const author = {
            fullName: tweet.fullName,
            username: tweet.username,
            photoURL: tweet.photoURL,
          };

          return (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              user={author}
            />
          );
        })}

      {!loading && tweets.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={tweets.length}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
}

export default FeedPage;
