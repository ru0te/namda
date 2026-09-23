import { useEffect } from "react";

import { useHeroImage } from "../api/hooks/useHeroImage";

function Hero({ onReady }: { onReady: () => void }) {
  const { data: image, isError } = useHeroImage();

  useEffect(() => {
    if (isError) onReady();
  }, [isError, onReady]);

  return (
    <>
      <div className="hero">
        {image ? (
          <img
            src={image}
            alt=""
            className="hero-image"
            decoding="async"
            fetchPriority="high"
            onError={onReady}
            onLoad={onReady}
          />
        ) : (
          <div className="hero-image hero-placeholder" role="status">
            {isError
              ? "Unable to load featured image"
              : "Loading featured image..."}
          </div>
        )}
      </div>
    </>
  );
}

export default Hero;
