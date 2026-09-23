import { useQuery } from "@tanstack/react-query";

import { fetchHeroImage } from "../api/functions/fetchHeroImage";

function Hero() {
  const { data: image } = useQuery({
    queryKey: ["hero-image"],
    queryFn: fetchHeroImage,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <div className="hero">
        <img src={image} alt="" className="hero-image" />
      </div>
    </>
  );
}

export default Hero;
