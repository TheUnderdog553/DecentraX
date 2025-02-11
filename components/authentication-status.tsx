"use client"

import { useWeb3 } from "@/contexts/web3-context"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

type AuthLog = {
  device: string
  timestamp: string
  status: "Success" | "Pending" | "Failed"
}

type Props = {
  onNewDevice: (deviceId: string) => void
}

const SAMPLE_DEVICE_IDS = [
  "ESP32_SmartLock_001",
  "RaspberryPi_Camera_01",
  "Arduino_Thermostat_LR",
  "SmartLight_Bedroom_N",
  "EnvSensor_Kitchen_01",
  "PhilipsHue_Bedroom_03",
  "AtombergFan_Bedroom_05",
  "PhilipsBulb_LivingRoom_01",
  "PhilipsHue_LivingRoom_02",
  "Smartstrip3_LivingRoom_01",
  "Smartstrip2_Bedroom_01",
  "PhilipsFan_Bedroom_02",
]

const DEVICE_ID_REGEX = /^[a-zA-Z0-9_]{5,32}$/

export default function AuthenticationStatus({ onNewDevice }: Props) {
  const { contract, isConnected, connectWallet, maticBalance } = useWeb3()
  const [logs, setLogs] = useState<AuthLog[]>([])
  const [newDeviceId, setNewDeviceId] = useState("")
  const [loading, setLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(false)


  useEffect(() => {
    setLogs([])
  }, [])

  const handleConnect = async () => {
    try {
      await connectWallet()
      toast({ title: "Wallet connected successfully!" })
    } catch (error) {
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      })
    }
  }

  const handleExamples = (deviceId: string) => {
    setNewDeviceId(deviceId)
    toast({
      title: "Sample Loaded",
      description: `Testing device: ${deviceId}`,
      duration: 2000
    })
  }

  const validateDeviceId = (id: string) => {
    if (!DEVICE_ID_REGEX.test(id)) {
      toast({
        title: "Invalid Device ID",
        description: "Use 5-32 characters (letters, numbers, underscores)",
        variant: "destructive"
      })
      return false
    }
    return true
  }

  const registerDevice = async () => {
    if (!contract || !newDeviceId) return
    
    if (!validateDeviceId(newDeviceId)) return
    
    setLoading(true)
    try {
      const tx = await contract.registerDevice(newDeviceId)
      const receipt = await tx.wait()
      
      if (receipt.status === 1) {
        onNewDevice(newDeviceId)
        addLog(newDeviceId, "Success")
        toast({ title: "Device Registered Successfully" })
      } else {
        throw new Error("Transaction failed")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? 
        error.message.includes("revert") ? "Device already registered" : error.message :
        "Unknown error"
        
      addLog(newDeviceId, "Failed")
      toast({ 
        title: "Registration Failed", 
        description: errorMessage,
        variant: "destructive" 
      })
    } finally {
      setLoading(false)
      setNewDeviceId("")
    }
  }

  const checkAuth = async (deviceId: string) => {
    if (!contract || !deviceId) return
    
    setIsChecking(true)
    try {
      const isRegistered = await contract.isRegistered(deviceId)
      addLog(deviceId, isRegistered ? "Success" : "Failed")
    } catch (error) {
      addLog(deviceId, "Failed")
      toast({
        title: "Check Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      })
    } finally {
      setIsChecking(false)
    }
  }

  const addLog = (device: string, status: "Success" | "Pending" | "Failed") => {
    setLogs(prev => [{
      device,
      timestamp: new Date().toLocaleString(),
      status
    }, ...prev.slice(0, 9)])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Management</CardTitle>
        <CardDescription>
          {isConnected ? 
            `${maticBalance} MATIC available | Valid ID format: ABC123_Device_01` : 
            "Connect wallet to manage devices"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isConnected ? (
          <Button onClick={handleConnect}>Connect Wallet</Button>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Enter Device ID (e.g., ESP32_Lock_01)"
                value={newDeviceId}
                onChange={(e) => setNewDeviceId(e.target.value)}
                className="flex-1"
              />
              <div className="flex gap-4">
                <Button 
                  onClick={registerDevice}
                  disabled={loading || !newDeviceId}
                >
                  {loading ? "Registering..." : "Register Device"}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => checkAuth(newDeviceId)}
                  disabled={!newDeviceId || isChecking}
                >
                  {isChecking ? "Verifying..." : "Verify Device"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Test with sample IDs:
              </p>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_DEVICE_IDS.map((id) => (
                  <Button
                    key={id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleExamples(id)}
                  >
                    {id}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {logs.map((log, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{log.device}</p>
                    <p className="text-sm text-muted-foreground">{log.timestamp}</p>
                  </div>
                  <Badge variant={
                    log.status === "Success" ? "default" :
                    log.status === "Failed" ? "destructive" : "secondary"
                  }>
                    {log.status}
                  </Badge>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}