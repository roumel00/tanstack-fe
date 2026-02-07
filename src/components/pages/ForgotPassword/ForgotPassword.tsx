import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { RequestReset, VerifyOtp, ResetPassword } from './components'

type Step = 'request' | 'verify' | 'reset'

export function ForgotPassword() {
  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        {step === 'request' && (
          <RequestReset
            defaultEmail={email}
            onSuccess={(submittedEmail) => {
              setEmail(submittedEmail)
              setStep('verify')
            }}
          />
        )}

        {step === 'verify' && (
          <VerifyOtp
            email={email}
            onSuccess={(verifiedOtp) => {
              setOtp(verifiedOtp)
              setStep('reset')
            }}
          />
        )}

        {step === 'reset' && (
          <ResetPassword email={email} otp={otp} />
        )}
      </Card>
    </div>
  )
}
