import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"

function home() {
  return (
    <>
      <p className="mt-10 ms-6 font-medium">Top restaurant chains in "LOCATION"</p>
      <Card style={{ width: '290px', height: '280px' }} className="ms-5 me-3 overflow-hidden transition-shadow duration-300 hover:shadow-lg rounded-lg">
        <div className="overflow-hidden rounded-t-lg">
          <img
            src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/RX_THUMBNAIL/IMAGES/VENDOR/2024/7/17/216703ed-400f-4e98-92ef-464376c45acf_641508.jpg"
            alt="Restaurant"
            className="w-full h-40 object-cover"
          />
        </div>
        <CardContent className="p-3 space-y-1">
          <p className="text-lg font-bold text-gray-800">Hotel demo</p>
          <p className="text-sm text-gray-600">Pizzas</p>
        </CardContent>
        <CardFooter className="p-3">
          <p className="text-sm text-gray-600">Ottapaalam</p>
        </CardFooter>
      </Card>

    </>
  )
}

export default home