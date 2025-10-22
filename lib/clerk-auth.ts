import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'

export async function getClerkUser(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return null
    }
    
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
