"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DeviceList from "./device-list"
import AuthenticationStatus from "./authentication-status"
import FutureDevelopments from "./future-developments"
import { useWeb3 } from "@/contexts/web3-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { contract } = useWeb3()
  const [sensorData, setSensorData] = useState<number[]>([])
  const [systemHealth, setSystemHealth] = useState("Loading...")
  const [devices, setDevices] = useState<Array<{id: string, name: string, type: string}>>([
    { id: "ESP32_001", name: "Smart Lock", type: "Security" },
    { id: "ESP32_002", name: "Thermostat", type: "Climate" },
    { id: "ESP32_003", name: "Security Camera", type: "Security" },
  ])
  const [refreshCounter, setRefreshCounter] = useState(0)
  const resetStorage = () => {
    localStorage.removeItem("iotAuthLogs")
    localStorage.removeItem("registeredDevices")
    window.location.reload()
  }
  

  useEffect(() => {
    setDevices([
      { id: "ESP32_001", name: "Smart Lock", type: "Security" },
      { id: "ESP32_002", name: "Thermostat", type: "Climate" },
      { id: "ESP32_003", name: "Security Camera", type: "Security" },
    ])
  }, [])


  const handleNewDevice = (deviceId: string) => {
    setDevices(prev => [...prev, {
      id: deviceId,
      name: `Device ${deviceId}`,
      type: "Custom"
    }])
    setRefreshCounter(prev => prev + 1)
  }


  useEffect(() => {
    if (contract) {
      setSystemHealth("Operational")
      const interval = setInterval(() => {
        setSensorData(prev => [...prev.slice(-9), Math.floor(Math.random() * 100)])
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [contract])

  // Calculate metrics
  const totalDevices = devices.length
  const authenticatedDevices = devices.filter(d => 
    contract?.isRegistered(d.id)
  ).length

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="devices">Devices</TabsTrigger>
        <TabsTrigger value="authentication">Authentication</TabsTrigger>
        <TabsTrigger value="future">Future</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Real-time status of your IoT network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {contract ? totalDevices : <Skeleton className="h-8 w-12" />}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Authenticated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {contract ? authenticatedDevices : <Skeleton className="h-8 w-12" />}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {systemHealth}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Activity</CardTitle>
            <CardDescription>Blockchain transaction load simulation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end gap-1">
              {sensorData.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 bg-blue-600 rounded-t transition-all duration-500"
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="devices">
        <DeviceList devices={devices} refreshCounter={refreshCounter} />
      </TabsContent>

      <TabsContent value="authentication">
        <AuthenticationStatus onNewDevice={handleNewDevice} />
      </TabsContent>

      <TabsContent value="future">
        <FutureDevelopments />
      </TabsContent>
    </Tabs>
  )
}