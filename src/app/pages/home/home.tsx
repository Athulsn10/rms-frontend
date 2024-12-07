import RestaurantCard from '@/components/restuarantCard/restuarantCard'
import restaurant from './mockCard.js';

interface Restaurant {
  id: number,
  title: string,
  rating: string,
  category: string,
  area: string,
  imgUrl: string
}

function home() {
  return (
    <>
      <p className="mt-10 md:mx-28 ms-6 pb-5 font-bold md:text-xl">Top restaurant chains in "LOCATION"</p>
      <div className='flex w-[full] h-fit overflow-x-scroll custom-scroll-bar md:mx-24 md:py-5'>
        {restaurant.map((restaurant: Restaurant) => (
         <div key={restaurant.id}>
            <RestaurantCard
              title={restaurant.title}
              rating={restaurant.rating}
              category={restaurant.category}
              area={restaurant.area}
              imgUrl={restaurant.imgUrl}
            />
         </div>
        ))}
      </div>
    </>
  )
}

export default home