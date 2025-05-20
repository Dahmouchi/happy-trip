'use server'

import prisma  from '@/lib/prisma'


export async function saveLandingConfig(sections: Record<string, boolean>) {
  // First get the current landing page config
  const current = await prisma.landing.findFirst()
  
  if (!current) {
    // Create if doesn't exist
    await prisma.landing.create({
      data: sections
    })
  } else {
    // Update existing
    await prisma.landing.updateMany({
      data: sections
    })
  }
}

// lib/landing.ts or wherever you define helpers
import { Landing } from '@prisma/client' // Optional, if you want type support

export async function getLanding(): Promise<Landing | null> {
  try {
    const current = await prisma.landing.findFirst()
    return current
  } catch (error) {
    console.error('Error fetching landing config:', error)
    return null
  }
}
