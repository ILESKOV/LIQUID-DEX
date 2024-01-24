import { showConnect } from '@stacks/connect'
import ActionButton from '../components/ActionButton'
import SecondaryButton from '../components/SecondaryButton'
import { appDetails } from '../lib/constants'
import { useStacks } from '../providers/StacksProvider'

export default function Auth() {
  const { address, userSession } = useStacks()

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
      <div className="flex flex-row items-center gap-4 text-gray-300">
        <p>
          Logged in as: <b>{address}</b>
        </p>
        <ActionButton type="button" onClick={handleLogIn}>
          Change Account
        </ActionButton>
        <ActionButton type="button" onClick={logUserOut}>
          Log Out
        </ActionButton>
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
