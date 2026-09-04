import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

/**
 * Entry Registration — Multi-step form flow.
 * Step 1: Identity (Name)
 * Step 2: Contact (Email, Phone)
 * Step 3: Affiliation (College)
 * Step 4: Success & QR Pass generation
 */
export default function EntryRegistration() {
  const { getToken } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
  })
  const [registrationId, setRegistrationId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = await getToken()
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      
      setRegistrationId(data.registrationId)
      
      // Persist the pass locally for the user
      localStorage.setItem('vectorsPass', JSON.stringify({
        registrationId: data.registrationId,
        name: formData.name,
        college: formData.college,
        status: 'VERIFIED'
      }))
      
      setStep(4)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClasses =
    'w-full bg-iron/50 border border-brass-dim/30 text-bone px-4 py-3 font-mono text-sm focus:outline-none focus:border-emerald transition-colors duration-300'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
      <div className="w-full max-w-md">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                s <= step ? 'bg-emerald' : 'bg-brass-dim/30'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Identity */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-2xl tracking-widest text-center">Identity</h2>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className={inputClasses}
              id="input-name"
            />
            <button
              onClick={() => setStep(2)}
              disabled={!formData.name.trim()}
              className="py-4 font-display tracking-widest uppercase bg-emerald text-charcoal disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-dim transition-colors duration-300"
              id="btn-next-step-1"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: Contact */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-2xl tracking-widest text-center">Contact</h2>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={inputClasses}
              id="input-email"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className={inputClasses}
              id="input-phone"
            />
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 font-display tracking-widest uppercase border border-brass-dim/30 text-steel hover:text-brass transition-colors duration-300"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.email.trim() || !formData.phone.trim()}
                className="flex-1 py-4 font-display tracking-widest uppercase bg-emerald text-charcoal disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-dim transition-colors duration-300"
                id="btn-next-step-2"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Affiliation */}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-2xl tracking-widest text-center">Affiliation</h2>
            <input
              type="text"
              placeholder="College / Institution"
              value={formData.college}
              onChange={(e) => updateField('college', e.target.value)}
              className={inputClasses}
              id="input-college"
            />
            {error && (
              <p className="text-crimson text-sm font-mono text-center">{error}</p>
            )}
            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-4 font-display tracking-widest uppercase border border-brass-dim/30 text-steel hover:text-brass transition-colors duration-300"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.college.trim() || loading}
                className="flex-1 py-4 font-display tracking-widest uppercase bg-emerald text-charcoal disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-dim transition-colors duration-300"
                id="btn-generate-pass"
              >
                {loading ? 'Generating...' : 'Generate Pass'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald/20 flex items-center justify-center">
              <span className="text-emerald text-3xl">✓</span>
            </div>
            <h2 className="font-display text-2xl tracking-widest">Pass Generated</h2>
            <p className="font-mono text-emerald text-lg">{registrationId}</p>
            <p className="font-mono text-steel text-sm">
              Your digital entry pass is ready. Show the QR code at the gate.
            </p>
            <a
              href="/my-pass"
              className="py-4 px-8 font-display tracking-widest uppercase bg-emerald text-charcoal hover:bg-emerald-dim transition-colors duration-300"
              id="btn-view-pass"
            >
              View My Pass
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
