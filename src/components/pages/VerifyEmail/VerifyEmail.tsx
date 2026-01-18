import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useVerifyEmail, useResendVerification } from '@/queries'
import { useSession } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type VerifyEmailFormData = {
  otp: string
}

export function VerifyEmail() {
  const navigate = useNavigate()
  const { data: session } = useSession()
  const form = useForm<VerifyEmailFormData>({
    defaultValues: { otp: '' },
  })

  const { mutate: verifyEmail, isPending: isVerifying } = useVerifyEmail()
  const { mutate: resendCode, isPending: isResending } = useResendVerification()

  const onSubmit = (data: VerifyEmailFormData) => {
    verifyEmail(
      { otp: data.otp },
      {
        onSuccess: () => {
          // Redirect to root - it will check emailVerified and org status
          navigate({ to: '/dashboard' })
        },
      }
    )
  }

  const handleResend = () => {
    resendCode(undefined, {
      onSuccess: () => {
        // Show success message or toast
        form.setValue('otp', '')
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            We sent a 6-digit code to {session?.user?.email}. Enter it below to verify your email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="otp"
                rules={{
                  required: 'Verification code is required',
                  pattern: {
                    value: /^\d{6}$/,
                    message: 'Code must be 6 digits',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-center block">Verification Code</FormLabel>
                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          {...field}
                          onChange={(value) => {
                            field.onChange(value)
                          }}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormDescription className="text-center">
                      Enter the 6-digit code sent to your email
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isVerifying}>
                {isVerifying ? 'Verifying...' : 'Verify Email'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={handleResend}
              disabled={isResending}
              className="text-sm"
            >
              {isResending ? 'Sending...' : "Didn't receive a code? Resend"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
