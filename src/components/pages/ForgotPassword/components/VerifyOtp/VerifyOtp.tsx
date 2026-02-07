import { useForm } from 'react-hook-form'
import { useVerifyResetPassword } from '@/queries'
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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type VerifyFormData = {
  otp: string
}

type VerifyOtpProps = {
  email: string
  onSuccess: (otp: string) => void
}

export function VerifyOtp({ email, onSuccess }: VerifyOtpProps) {
  const form = useForm<VerifyFormData>({
    defaultValues: { otp: '' },
  })

  const {
    mutate: verifyResetPassword,
    isPending,
    error,
  } = useVerifyResetPassword()

  const onSubmit = (data: VerifyFormData) => {
    verifyResetPassword(
      { email, otp: data.otp },
      {
        onSuccess: () => {
          onSuccess(data.otp)
        },
      }
    )
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Enter verification code</CardTitle>
        <CardDescription>
          We sent a 6-digit code to {email}. Enter it below to continue.
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
                  <FormLabel className="text-center block">
                    Verification Code
                  </FormLabel>
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
              {isPending ? 'Verifying...' : 'Verify code'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </>
  )
}
