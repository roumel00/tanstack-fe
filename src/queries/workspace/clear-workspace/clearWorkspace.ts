import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { post } from '@/lib/api'
import { ClearWorkspaceResponse } from './types'

export async function clearWorkspace(): Promise<ClearWorkspaceResponse> {
  return post<ClearWorkspaceResponse>('/workspaces/team/clear')
}

export function useClearWorkspace() {
  const router = useRouter()

  return useMutation({
    mutationFn: clearWorkspace,
    onSuccess: () => {
      router.invalidate()
    },
  })
}
