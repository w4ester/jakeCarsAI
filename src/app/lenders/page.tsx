'use client'

import { useState } from 'react'
import LenderMatcher from '@/components/LenderMatcher'
import { CustomerProfile } from '@/types'

export default function LendersPage() {
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>({
    firstName: 'Roger',
    lastName: 'Smith',
    email: 'rsmith@gmail.com',
    phone: '22846',
    income: 32000,
    creditScore: 640,
    downPayment: undefined,
    currentVehicle: '2014 GMC Yukon',
    tradeInValue: 4384.41,
    vehiclePreferences: 'Looking for an SUV with apple car play, sunroof and leather'
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Lender Matching Engine
          </h1>
          <p className="text-lg text-gray-600">
            AI-powered lender matching for optimal financing
          </p>
        </div>

        <LenderMatcher 
          customerProfile={customerProfile}
          onLenderSelected={(lender) => {
            console.log('Lender selected:', lender)
          }}
        />
      </div>
    </main>
  )
}