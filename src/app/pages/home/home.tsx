import { useEffect, useState } from 'react';
import RestaurantCard from '@/components/restuarantCard/restuarantCard'
import { getRestuarents, getRestuarentsByCity } from './homeService.js';

interface Restaurant {
  id: number,
  name: string,
  rating: string,
  tableCount: string,
  area: string,
  imgUrl: string
}

function home() {
  const [location, setLocation] = useState('')
  const [restaurantList, setRestaurantList] = useState([]);

  const fetchRestuarants = async () => {
    const city = localStorage.getItem('city') || 'chelakkara';
    if (city) {
      setLocation(city);
      const response = await getRestuarentsByCity(city);
      if (response) {
        setRestaurantList(response);
        console.log(response)
      }
    }
  }

  useEffect(() => {
    fetchRestuarants();
  }, []);

  return (
    <>
      <div className='md:mx-24 md:py-5 mx-4 my-4 h-fit'>
        <div className='h-auto w-full bg-white rounded-xl'>
          <img
            src="/banner.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div>
        <p className="md:mx-28 ms-6 pb-5 font-bold md:text-xl">Top restaurant chains in {location}</p>
        <div className='flex w-[full] h-fit overflow-x-scroll custom-scroll-bar md:mx-24 md:py-5'>
          {restaurantList.map((restaurant: Restaurant) => (
            <div key={restaurant.id}>
              <RestaurantCard
                title={restaurant.name}
                rating={restaurant.rating}
                category={restaurant.tableCount}
                area={restaurant.area}
                imgUrl='https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/86f52324ecee5fc94cbf63c4a568b672'
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default home