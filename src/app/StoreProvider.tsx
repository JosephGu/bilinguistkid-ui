'use client'
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '../lib/store';
import { setProfile } from './lib/profileSlice';


export default function StoreProvider({
    profile,
    children
}: {
  profile:ProfileState,
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
     storeRef.current.dispatch(setProfile(profile))
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}