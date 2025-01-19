import React, { useEffect } from 'react'
import RemainderSection from './Remainders/RemainderSection'
import Reports from '../Reports/Reports'
import axios from 'axios'
import api from '@/utils/api'
import OnGoingPoject from './OnGoingProjects'

function HomeWrapper() {

  return (
    <div>
      {/* Ongoing Projects */}
      <OnGoingPoject />
      {/* Remainders */}
      <RemainderSection />

      {/* Reports */}
      <Reports />
    </div>
  )
}

export default HomeWrapper
