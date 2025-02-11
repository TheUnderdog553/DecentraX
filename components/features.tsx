import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Zap } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Blockchain Security",
    description: "Leverage the power of blockchain for unparalleled security in your smart home.",
  },
  {
    icon: Lock,
    title: "IoT Authentication",
    description: "Ensure only authorized devices can access your smart home network.",
  },
  {
    icon: Zap,
    title: "Real-time Monitoring",
    description: "Monitor and manage your smart home security in real-time from anywhere.",
  },
]

export default function Features() {
  return (
    <section className="py-24 bg-black">
      <h2 className="text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
        Why Choose Our Solution
      </h2>
      <div className="grid md:grid-cols-3 gap-8 container mx-auto px-4">
        {features.map((feature, index) => (
          <Card key={index} className="bg-neutral-800/50 border-neutral-700 backdrop-blur-sm hover:border-neutral-600 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 mb-4 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 rounded-lg p-2.5">
                <feature.icon className="w-full h-full text-neutral-900" />
              </div>
              <CardTitle className="text-neutral-200">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-400">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

