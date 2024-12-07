import { Hotel, UserIcon } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card"

function Authentication() {
  const navigate = useNavigate();
  
  const handleClick = (key:number) => {
    if ( key === 2 ) {
      navigate('/register?type=customer');
    } else {
      navigate('/register?type=restaurant');
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col sm:flex-row space-y-8 sm:space-y-0 sm:space-x-8">
        <Card  onClick={() => handleClick(1)} className="w-80 h-96 shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Hotel size={48} className="text-blue-500" />
            </div>
            <p className="text-gray-700 mb-4">
              Access restaurant management tools
            </p>
          </CardContent>
        </Card>

        <Card  onClick={() => handleClick(2)} className="w-80 h-96 shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer">
          <CardContent className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <UserIcon size={48} className="text-green-500" />
            </div>
            <p className="text-gray-700 mb-4">
              Browse restaurants, place orders, and track orders
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Authentication