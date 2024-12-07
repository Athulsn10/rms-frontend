import { Card, CardContent } from "@/components/ui/card"
import { Hotel, UserIcon } from "lucide-react"

function Authentication() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col sm:flex-row space-y-8 sm:space-y-0 sm:space-x-8">
        <Card className="w-80 h-96 shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Hotel size={48} className="text-blue-500" />
            </div>
            <p className="text-gray-700 mb-4">
              Access restaurant management tools and analytics
            </p>
          </CardContent>
        </Card>

        <Card className="w-80 h-96 shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <UserIcon size={48} className="text-green-500" />
            </div>
            <p className="text-gray-700 mb-4">
              Browse restaurants, place orders, and track deliveries
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Authentication