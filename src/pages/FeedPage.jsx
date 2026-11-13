
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase";
import { getFollowingUsers } from "../social";
import Pagination, { PAGE_SIZE } from "../components/Pagination";
import TweetCard from "../components/TweetCard";

function FeedPage({ currentUser }) {
  const [tweets, setTweets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser?.uid) return;

    let active = true;
    let unsubscribeTweets = null;

    async function loadFeed() {
      try {
        setLoading(true);
        setError("");

        const followingUsers = await getFollowingUsers(currentUser.uid);

        if (!active) return;

        const allowedUserIds = [
          currentUser.uid,
          ...followingUsers.map((user) => user.uid || user.id),
        ];

        const tweetsQuery = query(
          collection(db, "tweets"),
          orderBy("createdAt", "desc")
        );

        unsubscribeTweets = onSnapshot(
          tweetsQuery,
          (snapshot) => {
            if (!active) return;

            const loadedTweets = snapshot.docs
              .map((document) => ({
                id: document.id,
                ...document.data(),
              }))
              .filter((tweet) =>
                allowedUserIds.includes(tweet.authorId)
              );

            setTweets(loadedTweets);
            setCurrentPage(1);
            setLoading(false);
            setError("");
          },
          (firebaseError) => {
            console.error("Error al cargar publicaciones:", firebaseError);

            if (active) {
              setError("No se pudieron cargar las publicaciones.");
              setLoading(false);
            }
          }
        );
      } catch (firebaseError) {
        console.error("Error al cargar el feed:", firebaseError);

        if (active) {
          setError(
            "No se pudieron cargar los usuarios seguidos. Revisa los permisos de Firebase."
          );
          setLoading(false);
        }
      }
    }

    loadFeed();

    return () => {
      active = false;

      if (unsubscribeTweets) {
        unsubscribeTweets();
      }
    };
  }, [currentUser?.uid]);

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
        <p className="text-secondary">
          Cargando publicaciones...
        </p>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && tweets.length === 0 && (
        <div className="alert alert-light border" role="status">
          Todavía no hay publicaciones de las personas que sigues.
          ¡Publica algo o sigue a otros usuarios!
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
