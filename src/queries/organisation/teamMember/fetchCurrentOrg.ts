import { useQuery } from "@tanstack/react-query";
import { CurrentOrg } from "./types";
import { get } from "@/lib/api";

export type FetchCurrentOrgRequest = {
  // No request parameters
}

export type FetchCurrentOrgResponse = CurrentOrg

/**
 * Query function to fetch current organisation
 * GET /organisations/team/currentOrg
 */
export async function fetchCurrentOrg(): Promise<FetchCurrentOrgResponse> {
  return get<FetchCurrentOrgResponse>('/organisations/team/currentOrg')
}

/**
 * Query hook to fetch current organisation
 * GET /organisations/team/currentOrg
 */
export function useCurrentOrg() {
  return useQuery({
    queryKey: ['user', 'currentOrg'],
    queryFn: fetchCurrentOrg,
    staleTime: Infinity,
  })
}