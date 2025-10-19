'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const STORAGE_KEY = 'ichidan_return_path'

export function RouteRestorer() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined' || !pathname) {
      return
    }

    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      const currentFullPath = `${window.location.pathname}${window.location.search}${window.location.hash}`

      if ((pathname === '/' || pathname === '') && stored && stored !== '/' && stored !== currentFullPath) {
        sessionStorage.removeItem(STORAGE_KEY)
        router.replace(stored)
        return
      }

      if (pathname !== '/') {
        sessionStorage.setItem(STORAGE_KEY, currentFullPath)
      }
    } catch {
      // セッションストレージが利用できない場合は何もしない
    }
  }, [pathname, router])

  return null
}
