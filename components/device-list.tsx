"use client"

import { useWeb3 } from "@/contexts/web3-context"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

type Device = {
  id: string
  name: string
  type: string
}

export default function DeviceList({ devices }: { devices: Array<Device> }) {
  const { contract } = useWeb3()
  const [deviceStatus, setDeviceStatus] = useState<Record<string, string>>({})

  useEffect(() => {
    const checkStatus = async () => {
      if (!contract) return
      
      const statusMap: Record<string, string> = {}
      for (const device of devices) {
        try {
          const isRegistered = await contract.isRegistered(device.id)
          statusMap[device.id] = isRegistered ? "Authenticated" : "Pending"
        } catch {
          statusMap[device.id] = "Error"
        }
      }
      setDeviceStatus(statusMap)
    }

    checkStatus()
  }, [contract, devices])

  return (
    <Table className="border border-border bg-background text-foreground">
      <TableHeader>
        <TableRow>
          <TableHead className="text-foreground">Device</TableHead>
          <TableHead className="text-foreground">Type</TableHead>
          <TableHead className="text-foreground">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {devices.map((device) => (
          <TableRow key={device.id}>
            <TableCell className="text-foreground">{device.name}</TableCell>
            <TableCell className="text-foreground">{device.type}</TableCell>
            <TableCell>
              <Badge variant={
                deviceStatus[device.id] === "Authenticated" ? "default" :
                deviceStatus[device.id] === "Error" ? "destructive" : "secondary"
              }>
                {deviceStatus[device.id] || "Checking..."}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}