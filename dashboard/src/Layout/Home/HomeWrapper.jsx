import React from 'react'
import RemainderSection from './Remainders/RemainderSection'
import Reports from '../Reports/Reports'

function HomeWrapper() {
  return (
    <div>
      {/* Remainders */}
      <RemainderSection />

      {/* Reports */}
      <Reports />
    </div>
  )
}

export default HomeWrapper
