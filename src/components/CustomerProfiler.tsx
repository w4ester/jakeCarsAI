'use client'

import { useState } from 'react'
import { CustomerProfile } from '@/types'
import { mcpServer } from '@/mcp/server'

interface CustomerProfilerProps {
  onProfileComplete?: (profile: CustomerProfile) => void
}

export default function CustomerProfiler({ onProfileComplete }: CustomerProfilerProps) {
  const [profile, setProfile] = useState<CustomerProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    income: undefined,
    creditScore: undefined,
    downPayment: undefined,
    currentVehicle: '',
    tradeInValue: undefined,
    vehiclePreferences: ''
  })

  const [analysis, setAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleInputChange = (field: keyof CustomerProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const analyzeProfile = async () => {
    if (!profile.firstName || !profile.lastName || !profile.email) {
      alert('Please fill in required fields')
      return
    }

    setIsAnalyzing(true)
    
    try {
      // Use MCP server to analyze customer profile
      const creditAnalysis = await mcpServer.executeTool('credit_analyzer', {
        creditScore: profile.creditScore || 650,
        income: profile.income || 0,
        debtToIncome: 25 // Mock DTI for now
      })

      // Process customer profile prompt
      const promptVariables = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        income: profile.income || 'Not provided',
        creditScore: profile.creditScore || 'Not provided',
        downPayment: profile.downPayment || 0,
        currentVehicle: profile.currentVehicle || 'None',
        tradeValue: profile.tradeInValue || 0,
        preferences: profile.vehiclePreferences || 'None specified'
      }

      const analysisPrompt = mcpServer.processPrompt('customer_profile_analysis', promptVariables)
      
      // Simulate AI analysis response (in production, this would call actual AI service)
      const mockAnalysis = {
        creditTier: creditAnalysis.tier,
        approvalProbability: creditAnalysis.approvalProbability,
        estimatedRate: creditAnalysis.estimatedRate,
        recommendedVehicleRange: {
          min: (profile.income || 30000) * 0.15 / 12 * 60, // 15% of income for 5 years
          max: (profile.income || 30000) * 0.25 / 12 * 72  // 25% of income for 6 years
        },
        optimalDownPayment: Math.max((profile.income || 30000) * 0.05, 2000),
        monthlyPaymentCapacity: (profile.income || 30000) * 0.20 / 12,
        riskFactors: creditAnalysis.recommendations,
        lenderRecommendations: [
          creditAnalysis.tier === 'Super Prime' ? 'Credit Unions, Banks' : 
          creditAnalysis.tier === 'Prime' ? 'Banks, Captive Finance' :
          creditAnalysis.tier === 'Near Prime' ? 'Captive Finance, Regional Banks' :
          'Subprime Lenders, Buy Here Pay Here'
        ]
      }

      setAnalysis(mockAnalysis)
      
      if (onProfileComplete) {
        onProfileComplete(profile)
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="glass-effect rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          🤖 AI Customer Profiler
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter first name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter last name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Financial Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Income
              </label>
              <input
                type="number"
                value={profile.income || ''}
                onChange={(e) => handleInputChange('income', parseInt(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter annual income"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credit Score
              </label>
              <input
                type="number"
                min="300"
                max="850"
                value={profile.creditScore || ''}
                onChange={(e) => handleInputChange('creditScore', parseInt(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter credit score (300-850)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Down Payment Available
              </label>
              <input
                type="number"
                value={profile.downPayment || ''}
                onChange={(e) => handleInputChange('downPayment', parseFloat(e.target.value) || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter down payment amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Vehicle
              </label>
              <input
                type="text"
                value={profile.currentVehicle}
                onChange={(e) => handleInputChange('currentVehicle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2014 GMC Yukon"
              />
            </div>
          </div>
        </div>

        {/* Trade-in and Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trade-in Value
            </label>
            <input
              type="number"
              value={profile.tradeInValue || ''}
              onChange={(e) => handleInputChange('tradeInValue', parseFloat(e.target.value) || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Estimated trade-in value"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Preferences
            </label>
            <textarea
              value={profile.vehiclePreferences}
              onChange={(e) => handleInputChange('vehiclePreferences', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Looking for an SUV with apple car play, sunroof and leather"
              rows={3}
            />
          </div>
        </div>

        {/* Analyze Button */}
        <div className="text-center mb-8">
          <button
            onClick={analyzeProfile}
            disabled={isAnalyzing}
            className="automotive-gradient text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isAnalyzing ? '🤖 Analyzing Profile...' : '🚀 Analyze Customer Profile'}
          </button>
        </div>

        {/* AI Analysis Results */}
        {analysis && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              🎯 AI Analysis Results
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Credit Assessment</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Credit Tier:</span>
                    <span className="font-medium">{analysis.creditTier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approval Probability:</span>
                    <span className="font-medium text-green-600">{analysis.approvalProbability}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Rate:</span>
                    <span className="font-medium">{analysis.estimatedRate}%</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Financial Recommendations</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Vehicle Range:</span>
                    <span className="font-medium">
                      ${Math.round(analysis.recommendedVehicleRange.min).toLocaleString()} - 
                      ${Math.round(analysis.recommendedVehicleRange.max).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Optimal Down Payment:</span>
                    <span className="font-medium text-blue-600">
                      ${Math.round(analysis.optimalDownPayment).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Capacity:</span>
                    <span className="font-medium">
                      ${Math.round(analysis.monthlyPaymentCapacity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-2">AI Recommendations</h4>
              <div className="bg-white rounded-lg p-4">
                <ul className="space-y-1 text-sm">
                  {analysis.riskFactors.map((factor: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">Recommended Lenders</h4>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm">{analysis.lenderRecommendations[0]}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}