import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useResetPassword } from '@/queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type ResetFormData = {
  newPassword: string
  confirmPassword: string
}

type ResetPasswordProps = {
  email: string
  otp: string
}

export function ResetPassword({ email, otp }: ResetPasswordProps) {
  const navigate = useNavigate()
  const form = useForm<ResetFormData>({
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  const {
    mutate: resetPassword,
    isPending,
    error,
  } = useResetPassword()

  const onSubmit = (data: ResetFormData) => {
    resetPassword(
      {
        email,
        otp,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      },
      {
        onSuccess: () => {
          navigate({ to: '/login' })
        },
      }
    )
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Set new password</CardTitle>
        <CardDescription>
          Enter your new password below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="newPassword"
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              rules={{
                required: 'Please confirm your password',
                validate: (value) =>
                  value === form.getValues('newPassword') ||
                  'Passwords do not match',
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <div className="text-sm text-destructive">
                {error instanceof Error
                  ? error.message
                  : 'An error occurred'}
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? 'Resetting...' : 'Reset password'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </>
  )
}
