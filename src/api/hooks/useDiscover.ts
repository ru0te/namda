import { useQuery, skipToken } from "@tanstack/react-query";
import { fetchDiscover } from "../functions/fetchDiscover";
import type { DiscoverFilters } from "../../types/types";

export function useDiscover(filters: DiscoverFilters | null) {
  return useQuery({
    queryKey: ["discover", filters],
    queryFn: filters ? () => fetchDiscover(filters) : skipToken,
  });
}
