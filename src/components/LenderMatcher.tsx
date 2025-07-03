'use client'

import { useState, useEffect } from 'react'
import { LenderProfile, CustomerProfile, LenderApplication } from '@/types'
import { mcpServer } from '@/mcp/server'

interface LenderMatcherProps {
  customerProfile?: CustomerProfile
  onLenderSelected?: (lender: LenderProfile) => void
}

// Mock lender data based on Jake's Google Sheets analysis
const mockLenders: LenderProfile[] = [
  {
    id: '1',
    name: 'None (subprime to superprime tiers)',
    type: 'Traditional Bank',
    isActive: true,
    minCreditScore: 500,
    maxCreditScore: 850,
    minIncome: 25000,
    minLoanAmount: 5000,
    maxLoanAmount: 100000,
    minTerm: 36,
    maxTerm: 84,
    maxLTV: 120,
    maxPTI: 20,
    maxVehicleAge: 10,
    maxMileage: 150000,
    acquisitionFee: 0,
    baseRate: 8.0,
    programs: [
      {
        name: 'Standard Program',
        tier: 'All Tiers',
        ficoRange: '500-850',
        maxLTV: 120,
        maxTerm: 84,
        isActive: true
      }
    ]
  },
  {
    id: '2',
    name: 'Tier 0-9 ($300-$850)',
    type: 'Tier-Based Lender',
    isActive: true,
    minCreditScore: 550,
    maxCreditScore: 800,
    minIncome: 30000,
    minLoanAmount: 8000,
    maxLoanAmount: 75000,
    minTerm: 48,
    maxTerm: 72,
    maxLTV: 110,
    maxPTI: 18,
    maxVehicleAge: 8,
    maxMileage: 120000,
    acquisitionFee: 620,
    baseRate: 9.5,
    programs: [
      {
        name: 'Tier 0-3 Prime',
        tier: 'Tier 0-3',
        ficoRange: '700-800',
        maxLTV: 110,
        maxTerm: 72,
        isActive: true
      },
      {
        name: 'Tier 4-6 Near Prime',
        tier: 'Tier 4-6',
        ficoRange: '650-699',
        maxLTV: 105,
        maxTerm: 66,
        isActive: true
      },
      {
        name: 'Tier 7-9 Subprime',
        tier: 'Tier 7-9',
        ficoRange: '550-649',
        maxLTV: 100,
        maxTerm: 60,
        isActive: true
      }
    ]
  },
  {
    id: '3',
    name: 'Subprime to near-prime',
    type: 'Subprime Specialist',
    isActive: true,
    minCreditScore: 500,
    maxCreditScore: 699,
    minIncome: 20000,
    minLoanAmount: 5000,
    maxLoanAmount: 40000,
    minTerm: 36,
    maxTerm: 72,
    maxLTV: 110,
    maxPTI: 25,
    maxVehicleAge: 12,
    maxMileage: 180000,
    acquisitionFee: 588,
    baseRate: 12.5,
    programs: [
      {
        name: 'Subprime Program',
        tier: 'Subprime',
        ficoRange: '500-649',
        maxLTV: 110,
        maxTerm: 72,
        isActive: true
      },
      {
        name: 'Near Prime Program',
        tier: 'Near Prime',
        ficoRange: '650-699',
        maxLTV: 105,
        maxTerm: 66,
        isActive: true
      }
    ]
  },
  {
    id: '4',
    name: 'Deep subprime focus',
    type: 'Deep Subprime',
    isActive: true,
    minCreditScore: 300,
    maxCreditScore: 599,
    minIncome: 15000,
    minLoanAmount: 3000,
    maxLoanAmount: 25000,
    minTerm: 24,
    maxTerm: 60,
    maxLTV: 100,
    maxPTI: 30,
    maxVehicleAge: 15,
    maxMileage: 200000,
    acquisitionFee: 750,
    baseRate: 18.5,
    programs: [
      {
        name: 'Deep Subprime',
        tier: 'Deep Subprime',
        ficoRange: '300-599',
        maxLTV: 100,
        maxTerm: 60,
        isActive: true
      }
    ]
  },
  {
    id: '5',
    name: 'Prime/credit union guidelines',
    type: 'Credit Union',
    isActive: true,
    minCreditScore: 680,
    maxCreditScore: 850,
    minIncome: 40000,
    minLoanAmount: 10000,
    maxLoanAmount: 80000,
    minTerm: 36,
    maxTerm: 72,
    maxLTV: 115,
    maxPTI: 15,
    maxVehicleAge: 6,
    maxMileage: 100000,
    acquisitionFee: 0,
    baseRate: 5.5,
    programs: [
      {
        name: 'Prime Member Program',
        tier: 'Prime',
        ficoRange: '680-850',
        maxLTV: 115,
        maxTerm: 72,
        isActive: true
      }
    ]
  }
]

export default function LenderMatcher({ customerProfile, onLenderSelected }: LenderMatcherProps) {
  const [matchedLenders, setMatchedLenders] = useState<any[]>([])
  const [isMatching, setIsMatching] = useState(false)
  const [selectedLender, setSelectedLender] = useState<LenderProfile | null>(null)
  const [loanAmount, setLoanAmount] = useState<number>(25000)
  const [vehicleYear, setVehicleYear] = useState<number>(2020)
  const [vehicleValue, setVehicleValue] = useState<number>(30000)

  const matchLenders = async () => {
    if (!customerProfile?.creditScore) {
      alert('Customer profile with credit score required')
      return
    }

    setIsMatching(true)

    try {
      // Use MCP server to match lenders
      const matchingCriteria = {
        creditScore: customerProfile.creditScore,
        income: customerProfile.income || 0,
        loanAmount,
        vehicleYear,
        vehicleValue
      }

      // Filter and score lenders based on customer profile
      const scoredLenders = mockLenders
        .filter(lender => {
          // Basic eligibility checks
          const meetsCredit = customerProfile.creditScore >= (lender.minCreditScore || 0) && 
                             customerProfile.creditScore <= (lender.maxCreditScore || 850)
          const meetsIncome = (customerProfile.income || 0) >= (lender.minIncome || 0)
          const meetsLoanAmount = loanAmount >= (lender.minLoanAmount || 0) && 
                                 loanAmount <= (lender.maxLoanAmount || 999999)
          const meetsVehicleAge = (2024 - vehicleYear) <= (lender.maxVehicleAge || 20)

          return meetsCredit && meetsIncome && meetsLoanAmount && meetsVehicleAge && lender.isActive
        })
        .map(lender => {
          // Calculate approval probability and rates
          let approvalProbability = 50
          let estimatedRate = lender.baseRate || 10

          // Adjust probability based on credit score fit
          const creditScore = customerProfile.creditScore
          if (creditScore >= 750) {
            approvalProbability += 40
            estimatedRate -= 2
          } else if (creditScore >= 700) {
            approvalProbability += 30
            estimatedRate -= 1
          } else if (creditScore >= 650) {
            approvalProbability += 20
          } else if (creditScore >= 600) {
            approvalProbability += 10
            estimatedRate += 1
          } else {
            estimatedRate += 3
          }

          // Adjust for income
          const income = customerProfile.income || 0
          if (income > 75000) approvalProbability += 15
          else if (income > 50000) approvalProbability += 10
          else if (income > 30000) approvalProbability += 5

          // Adjust for down payment
          if (customerProfile.downPayment && customerProfile.downPayment > loanAmount * 0.2) {
            approvalProbability += 15
            estimatedRate -= 0.5
          }

          // Find best matching program
          const bestProgram = lender.programs?.find(program => {
            if (!program.ficoRange) return true
            const [minFico, maxFico] = program.ficoRange.split('-').map(Number)
            return creditScore >= minFico && creditScore <= maxFico
          })

          return {
            ...lender,
            approvalProbability: Math.min(Math.max(approvalProbability, 5), 95),
            estimatedRate: Math.max(estimatedRate, 3.5),
            bestProgram,
            matchScore: approvalProbability + (lender.type === 'Credit Union' ? 10 : 0)
          }
        })
        .sort((a, b) => b.matchScore - a.matchScore)

      setMatchedLenders(scoredLenders)

      // Process lender matching prompt for AI analysis
      const promptVariables = {
        creditScore: customerProfile.creditScore,
        income: customerProfile.income || 0,
        downPayment: customerProfile.downPayment || 0,
        loanAmount,
        vehicleYear,
        vehicleMileage: 50000, // Mock value
        lenderData: JSON.stringify(scoredLenders.slice(0, 5))
      }

      const analysisPrompt = mcpServer.processPrompt('lender_matching_analysis', promptVariables)
      console.log('Lender matching analysis prompt:', analysisPrompt)

    } catch (error) {
      console.error('Lender matching failed:', error)
      alert('Lender matching failed. Please try again.')
    } finally {
      setIsMatching(false)
    }
  }

  const selectLender = (lender: LenderProfile) => {
    setSelectedLender(lender)
    if (onLenderSelected) {
      onLenderSelected(lender)
    }
  }

  const calculateMonthlyPayment = (lender: any) => {
    const rate = lender.estimatedRate / 100 / 12
    const term = 60 // 5 years default
    const payment = loanAmount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)
    return Math.round(payment)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="glass-effect rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          🎯 Intelligent Lender Matcher
        </h2>

        {/* Customer Summary */}
        {customerProfile && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Customer Profile</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <div className="font-medium">{customerProfile.firstName} {customerProfile.lastName}</div>
              </div>
              <div>
                <span className="text-gray-600">Credit Score:</span>
                <div className="font-medium">{customerProfile.creditScore || 'Not provided'}</div>
              </div>
              <div>
                <span className="text-gray-600">Income:</span>
                <div className="font-medium">${(customerProfile.income || 0).toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Down Payment:</span>
                <div className="font-medium">${(customerProfile.downPayment || 0).toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        {/* Loan Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Amount
            </label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Year
            </label>
            <input
              type="number"
              value={vehicleYear}
              onChange={(e) => setVehicleYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Value
            </label>
            <input
              type="number"
              value={vehicleValue}
              onChange={(e) => setVehicleValue(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Match Button */}
        <div className="text-center mb-8">
          <button
            onClick={matchLenders}
            disabled={isMatching || !customerProfile?.creditScore}
            className="automotive-gradient text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isMatching ? '🤖 Matching Lenders...' : '🚀 Find Best Lenders'}
          </button>
        </div>

        {/* Matched Lenders */}
        {matchedLenders.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              🏆 Top Lender Matches
            </h3>
            
            <div className="space-y-4">
              {matchedLenders.map((lender, index) => (
                <div
                  key={lender.id}
                  className={`border rounded-xl p-6 cursor-pointer transition-all ${
                    selectedLender?.id === lender.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  onClick={() => selectLender(lender)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded mr-2">
                          #{index + 1}
                        </span>
                        <h4 className="text-lg font-semibold text-gray-900">{lender.name}</h4>
                        <span className="ml-2 text-sm text-gray-600">({lender.type})</span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Approval Probability:</span>
                          <div className="font-medium text-green-600">{lender.approvalProbability}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Estimated Rate:</span>
                          <div className="font-medium">{lender.estimatedRate.toFixed(2)}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Monthly Payment:</span>
                          <div className="font-medium">${calculateMonthlyPayment(lender).toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Max LTV:</span>
                          <div className="font-medium">{lender.maxLTV}%</div>
                        </div>
                      </div>

                      {lender.bestProgram && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">
                            Best Program: {lender.bestProgram.name}
                          </span>
                          <span className="text-sm text-gray-600 ml-2">
                            (FICO: {lender.bestProgram.ficoRange})
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Match Score</div>
                        <div className="text-2xl font-bold text-blue-600">{Math.round(lender.matchScore)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedLender && (
              <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  ✅ Selected Lender: {selectedLender.name}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Acquisition Fee:</span>
                    <div className="font-medium">${selectedLender.acquisitionFee}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Max Term:</span>
                    <div className="font-medium">{selectedLender.maxTerm} months</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Max Vehicle Age:</span>
                    <div className="font-medium">{selectedLender.maxVehicleAge} years</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button className="automotive-gradient text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                    Submit Application to {selectedLender.name}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {matchedLenders.length === 0 && !isMatching && customerProfile?.creditScore && (
          <div className="text-center text-gray-500">
            Click "Find Best Lenders" to see matching results
          </div>
        )}
      </div>
    </div>
  )
}