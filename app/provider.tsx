'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from '@clerk/nextjs';
import {UserDetailContext} from '@/context/UserDetailContext'
import { OnSaveContext } from '@/context/OnSaveContext';

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This is a client component — console.log outputs will appear in the browser DevTools console.
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState<any>('');
  const [onSaveData, setOnSaveData] = useState<any>(null)

  useEffect(() => {
    console.log('AppProvider mounted')
    if (user) createNewUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const createNewUser = async () => {
    console.log('createNewUser starting')
    try {
      const result = await axios.post('/api/users', {})
      setUserDetail(result.data?.user)
      console.log('createNewUser result', result.data)
    } catch (err) {
      console.error('createNewUser error', err)
    }
  }

  return (
    <div>
      <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
        <OnSaveContext.Provider value = {{onSaveData, setOnSaveData}}>
          {children}
        </OnSaveContext.Provider>
      </UserDetailContext.Provider>
    </div>
  )
}

export default Provider