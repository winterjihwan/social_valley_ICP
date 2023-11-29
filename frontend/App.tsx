import React from "react"
import logo from "./assets/dfinity.svg"
import { createClient } from "@connect2ic/core"
import { defaultProviders } from "@connect2ic/core/providers"
import {
  ConnectButton,
  ConnectDialog,
  Connect2ICProvider,
  useConnect,
} from "@connect2ic/react"
// import "@connect2ic/core/style.css"
import * as backend from "../.dfx/local/canisters/backend"
import { Backend } from "./components/Backend"

// II DEV
import { AuthClient } from "@dfinity/auth-client"
import { HttpAgent } from "@dfinity/agent"

function App() {
  // const { isConnected, principal } = useConnect()
  const [isConnected, setIsConnected] = React.useState(false)
  const [principal, setPrincipal] = React.useState(null)

  const login = async () => {
    const authClient = await AuthClient.create()
    authClient.login({
      identityProvider: `http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai`,
      onSuccess: () => {
        console.log("Logged in")
        setIsConnected(true)
      },
    })

    const identity = await authClient.getIdentity()
    setPrincipal(identity.getPrincipal().toString())
    const agent = new HttpAgent({ identity })
  }

  return (
    <div>
      {/* {isConnected && (
        <div>
          <div>Connected</div>
          <div>{principal}</div>
        </div>
      )} */}
      {/* <div>
        <ConnectButton />
      </div> */}
      {/* <ConnectDialog /> */}
      <div>
        <button onClick={login}>Login</button>

        <div>
          {isConnected && (
            <div>
              <div>Connected</div>
              <div>{principal}</div>
            </div>
          )}
        </div>
      </div>
      <div>
        <Backend />
      </div>
    </div>
  )
}

const client = createClient({
  canisters: {
    backend,
  },
  providers: defaultProviders,
  globalProviderConfig: {
    dev: import.meta.env.DEV,
  },
})

export default () => (
  <Connect2ICProvider client={client}>
    <App />
  </Connect2ICProvider>
)
