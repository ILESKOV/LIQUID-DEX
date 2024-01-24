import { AppConfig, showConnect, UserData, UserSession } from '@stacks/connect'
import { useEffect, useState } from 'react'
import SecondaryButton from '../components/SecondaryButton'
import { appDetails } from '../lib/constants'

export default function Auth() {
  const [userData, setUserData] = useState<UserData | undefined>(undefined)
  const address = userData?.profile?.stxAddress?.testnet

  const appConfig = new AppConfig(['store_write'])
  const userSession = new UserSession({ appConfig })

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData)
      })
    } else if (userSession.isUserSignedIn()) {
      // setLoggedIn(true);
      setUserData(userSession.loadUserData())
    }
  }, [])

  const handleLogIn = async () => {
    showConnect({
      appDetails,
      onFinish: () => window.location.reload(),
      userSession,
    })
  }

  const logUserOut = async () => {
    userSession.signUserOut()
    window.location.reload()
  }

  if (address) {
    return (
      <div className="flex flex-row items-center gap-4">
        <p>
          Logged in as: <b> {address}</b>
        </p>
        <SecondaryButton type="button" onClick={handleLogIn}>
          Change Account
        </SecondaryButton>
        <SecondaryButton type="button" onClick={logUserOut}>
          Log Out
        </SecondaryButton>
      </div>
    )
  } else {
    return (
      <SecondaryButton type="button" onClick={handleLogIn}>
        Connect Wallet
      </SecondaryButton>
    )
  }
}
