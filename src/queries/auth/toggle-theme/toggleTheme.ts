import { useMutation } from '@tanstack/react-query'
import { post } from '@/lib/api'
import { ToggleThemeRequest, ToggleThemeResponse } from './types'

export async function toggleTheme(data: ToggleThemeRequest): Promise<ToggleThemeResponse> {
  return post<ToggleThemeResponse, ToggleThemeRequest>('/user/theme/toggle', data)
}

export function useToggleTheme() {
  return useMutation({
    mutationFn: toggleTheme,
  })
}
