'use client'
import { useEffect, useState } from 'react'

const ClientOnly = ({ children, fallback = null }) => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return fallback
  }

  return children
}

// Alternative component for suppressing hydration warnings
const NoSSR = ({ children }) => {
  return (
    <div suppressHydrationWarning={true}>
      {children}
    </div>
  )
}

export default ClientOnly
export { NoSSR }
