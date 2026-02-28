import { useMutation } from '@tanstack/react-query'
import { post } from '@/lib/api'

export async function clearOrg(): Promise<void> {
  return post<void>('/organisations/team/clear')
}

export function useClearOrg() {
  return useMutation({
    mutationFn: clearOrg,
  })
}
