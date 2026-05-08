import React from 'react'

export default function useIsClient() {
  const [isClient, setIsClient] = React.useState<boolean>(false)

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true)
  }, [])

  return isClient
}
