import { useQuery } from "@tanstack/react-query";

import { fetchHeroImage } from "../functions/fetchHeroImage";

export function useHeroImage() {
  return useQuery({
    queryKey: ["hero-image"],
    queryFn: fetchHeroImage,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
