import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { post } from '@/lib/api'

export async function clearOrg(): Promise<void> {
  return post<void>('/organisations/team/clear')
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
