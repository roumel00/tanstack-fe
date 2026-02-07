import { useNavigate, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { signIn as betterAuthSignIn, type User } from '@/lib/auth-client'
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type SignInFormData = {
  email: string
  password: string
}

export function Login() {
  const navigate = useNavigate()
  const form = useForm<SignInFormData>({
    defaultValues: { email: '', password: '' },
  })

  const { mutate: signIn, isPending, error } = useMutation({
    mutationFn: async (data: SignInFormData) => {
      const result = await betterAuthSignIn.email({
        email: data.email,
        password: data.password,
      })
      if (!result.data) throw new Error('Sign in failed')
      return result.data
    },
    onSuccess: (data) => {
      const user = data.user as User
      const hasOrg = !!user?.lastAccessedOrg
      navigate({ to: hasOrg ? '/dashboard' : '/select-org' })
    },
  })

  const onSubmit = async (data: SignInFormData) => {
    signIn(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Enter your email and password to sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                rules={{ required: 'Password is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <div className="text-sm text-destructive">
                  {error instanceof Error ? error.message : 'An error occurred'}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 space-y-2">
            <div className="text-center text-sm">
              <Link to="/forgot-password" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
