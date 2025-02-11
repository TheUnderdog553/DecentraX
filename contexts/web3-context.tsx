"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { BrowserProvider, Contract, ethers } from "ethers"
import { IoTRegistryABI } from "@/utils/contractABI"

type Web3ContextType = {
  contract: Contract | null
  isConnected: boolean
  connectWallet: () => Promise<void>
  maticBalance: string
  connectionError: string | null
}

const Web3Context = createContext<Web3ContextType>({} as Web3ContextType)

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [contract, setContract] = useState<Contract | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [maticBalance, setMaticBalance] = useState("0")
  const [connectionError, setConnectionError] = useState<string | null>(null)

  const checkNetwork = async () => {
    if (!window.ethereum) return false
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })
    return chainId === "0x13882" // Amoy chain ID
  }

  const connectWallet = async () => {
    try {
      setConnectionError(null)
      
      // 1. Check MetaMask installation
      if (!window.ethereum) {
        window.open("https://metamask.io/download/", "_blank")
        throw new Error("MetaMask extension not detected")
      }

      // 2. Force popup with account request
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }]
      })

      // 3. Check/switch network
      const isCorrectNetwork = await checkNetwork()
      if (!isCorrectNetwork) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13882" }]
        })
      }

      // 4. Initialize provider
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      // 5. Initialize contract
      const contract = new Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        IoTRegistryABI,
        signer
      )

      // 6. Update state
      const balance = await provider.getBalance(signer.address)
      setMaticBalance(ethers.formatEther(balance))
      setContract(contract)
      setIsConnected(true)

    } catch (error) {
      console.error("Connection error:", error)
      setConnectionError(error instanceof Error ? error.message : "Connection failed")
      setIsConnected(false)
      throw error
    }
  }

  return (
    <Web3Context.Provider value={{ 
      contract, 
      isConnected, 
      connectWallet, 
      maticBalance,
      connectionError 
    }}>
      {children}
    </Web3Context.Provider>
  )
}

export const useWeb3 = () => useContext(Web3Context)