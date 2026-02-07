import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useForgotPassword } from '@/queries'
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

type RequestFormData = {
  email: string
}

type RequestResetProps = {
  defaultEmail: string
  onSuccess: (email: string) => void
}

export function RequestReset({ defaultEmail, onSuccess }: RequestResetProps) {
  const form = useForm<RequestFormData>({
    defaultValues: { email: defaultEmail },
  })

  const {
    mutate: forgotPassword,
    isPending,
    error,
  } = useForgotPassword()

  const onSubmit = (data: RequestFormData) => {
    forgotPassword(
      { email: data.email },
      {
        onSuccess: () => {
          onSuccess(data.email)
        },
      }
    )
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a code to reset your
          password.
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
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
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
              {isPending ? 'Sending...' : 'Send reset code'}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          <Link to="/login" className="text-primary hover:underline">
            Back to sign in
          </Link>
        </div>
      </CardContent>
    </>
  )
}
