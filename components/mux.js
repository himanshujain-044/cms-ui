"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

export default function Player({ id }) {
  const DynamicMuxPlayer = dynamic(
    () => import("@mux/mux-player-react"),
    {
      loading: () => <p>Loading...</p>,
      ssr: false // This ensures the component is only loaded on the client side
    }
  );

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      setIsLoaded(true);
    }
  }, [id]);

  return (
    <>
      {isLoaded ? (
        <DynamicMuxPlayer streamType="on-demand" playbackId={id} />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
