'use client'
import { persistor, store } from '@/store/store'
import React, { Suspense, useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'
import Loading from './Loading'
import { QueryClient , QueryClientProvider } from '@tanstack/react-query'
import ClientOnly from './ClientOnly'

const queryClient = new QueryClient()

// Dynamic import for ReactQueryDevtools to prevent SSR issues
const ReactQueryDevtools = React.lazy(() => 
  import('@tanstack/react-query-devtools').then((d) => ({
    default: d.ReactQueryDevtools,
  }))
)

const GlobalProvider = ({ children }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={<Loading></Loading>}>
          <div suppressHydrationWarning={true}>
            {children}
          </div>
        </PersistGate>
      </Provider>
      {isClient && (
        <ClientOnly>
          <Suspense fallback={null}>
            <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
          </Suspense>
        </ClientOnly>
      )}
    </QueryClientProvider>
  )
}

export default GlobalProvider
