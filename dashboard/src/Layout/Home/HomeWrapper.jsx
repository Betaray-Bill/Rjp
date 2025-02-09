import React, { Fragment, useEffect } from 'react'
import RemainderSection from './Remainders/RemainderSection'
import Reports from '../Reports/Reports'
import axios from 'axios'
import api from '@/utils/api'
import OnGoingPoject from './OnGoingProjects'
import { userAccess } from '@/utils/CheckUserAccess'
import { RolesEnum } from '@/utils/constants'
import { useSelector } from 'react-redux'

function HomeWrapper() {
  const {currentUser} = useSelector(state => state.auth)

  return (
    <div>
      {/* Ongoing Projects */}
      {
              userAccess([RolesEnum.ADMIN, RolesEnum.KEY_ACCOUNT], currentUser?.employee.role) &&
      <Fragment>
        <OnGoingPoject />
        {/* Remainders */}
        <RemainderSection />
      </Fragment>
      }
      {/* Reports */}
      <Reports />
    </div>
  )
}

export default HomeWrapper
