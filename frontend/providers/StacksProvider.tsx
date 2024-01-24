import { AppConfig, UserData, UserSession } from '@stacks/connect'
import { StacksNetwork, StacksMocknet } from '@stacks/network'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'

interface StacksContextValue {
  network: StacksNetwork
  address?: string
  userSession: UserSession
}

const AuthContext = createContext<StacksContextValue | undefined>(undefined)

export default function StacksProvider({ children }: PropsWithChildren<{}>) {
  const [userData, setUserData] = useState<UserData | undefined>(undefined)

  const network = new StacksMocknet()
  const appConfig = new AppConfig(['store_write'])
  const userSession = new UserSession({ appConfig })
  const address: string | undefined = userData?.profile?.stxAddress?.testnet

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData)
      })
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData())
    }
  }, [])

  const value: StacksContextValue = { network, address, userSession }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useStacks() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}
