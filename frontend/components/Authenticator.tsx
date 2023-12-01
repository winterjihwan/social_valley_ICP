// import { authenticator } from "otplib"
import { authenticator } from "@otplib/preset-browser"
import React, { useEffect, useState } from "react"
import qrcode from "qrcode"
import { useCanister } from "@connect2ic/react"

// II DEV
import { AuthClient } from "@dfinity/auth-client"
import { HttpAgent } from "@dfinity/agent"

interface AuthenticatorProps {
  TFAuthed: boolean
  setTFAAuthed: (value: boolean) => void
}

const Authenticator = ({ TFAuthed, setTFAAuthed }: AuthenticatorProps) => {
  const [qr, setQr] = useState(null)
  const [secret, setSecret] = useState(null)
  const [token, setToken] = useState("")
  const [authentication] = useCanister("authentication")
  const [principal, setPrincipal] = useState("")

  // II
  const [isConnected, setIsConnected] = React.useState(false)
  // const [principal, setPrincipal] = React.useState(null)

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

  // Authenticator
  const authenticatorInitialize = async (principal) => {
    console.log("Query secret provided")
    const res = await authentication.query_secretProvided(principal)
    if (res) {
      console.log("Secret already provided", res)
      // return
    }
    console.log("Secret not provided", res)

    console.log("Start google authenticator")
    const user = "username"
    const service = "Purify"
    const secret = authenticator.generateSecret()
    console.log("secret", secret)
    setSecret(secret)

    const otpauth = authenticator.keyuri(user, service, secret)

    const token = authenticator.generate(secret)
    console.log("token", token)

    qrcode.toDataURL(otpauth, (err, imageUrl) => {
      if (err) {
        console.log("Error with QR")
        return
      }
      console.log(imageUrl)
      setQr(imageUrl)
    })

    let updateRes = await authentication.update_secretProvided(principal, true)
    console.log("secretProvided updated", updateRes)
  }

  const verifyAuthenticator = (token) => {
    console.log("verifyAuthenticator")
    try {
      console.log(token)
      const isValid = authenticator.verify({ token, secret })
      console.log(isValid)
      setTFAAuthed(isValid)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
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
        <button onClick={() => authenticatorInitialize(principal)}>
          Initialize
        </button>
        <input
          type="text"
          placeholder="Enter Principal"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
        />
      </div>
      <div>
        <img src={qr} />
      </div>
      <div>
        <button onClick={() => verifyAuthenticator(token)}>Verify</button>
      </div>
      <input
        type="number"
        placeholder="Enter Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
    </div>
  )
}

export { Authenticator }
