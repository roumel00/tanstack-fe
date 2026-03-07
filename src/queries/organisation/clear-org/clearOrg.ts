import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { post } from '@/lib/api'
import { ClearOrgResponse } from './types'

export async function clearOrg(): Promise<ClearOrgResponse> {
  return post<ClearOrgResponse>('/organisations/team/clear')
}

export function useClearOrg() {
  const router = useRouter()

  return useMutation({
    mutationFn: clearOrg,
    onSuccess: () => {
      router.invalidate()
    },
  })
}
