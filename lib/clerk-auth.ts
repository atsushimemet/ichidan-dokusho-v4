import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'

export async function getClerkUser(request: NextRequest) {
  try {
    console.log('Getting Clerk user...')
    const { userId } = await auth()
    console.log('Clerk userId:', userId)
    
    if (!userId) {
      console.log('No Clerk user found')
      return null
    }
    
    console.log('Clerk user found:', userId)
    return { id: userId }
  } catch (error) {
    console.error('Error getting Clerk user:', error)
    return null
  }
}

export async function requireClerkAuth(request: NextRequest) {
  const user = await getClerkUser(request)
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  return user
}
