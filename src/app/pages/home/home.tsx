import { useEffect, useState } from 'react';
import RestaurantCard from '@/components/restuarantCard/restuarantCard'
import { getRestuarents, getRestuarentsByCity } from './homeService.js';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

interface Restaurant {
  id: number,
  name: string,
  rating: string,
  tableCount: string,
  area: string,
  images: string
}

function home() {
  const [location, setLocation] = useState('')
  const [restaurantList, setRestaurantList] = useState([]);
  const base_url = import.meta.env.VITE_BASE_URL;

  const fetchRestuarants = async () => {
    const city = localStorage.getItem('city');
    if (city) {
      setLocation(city);
      const response = await getRestuarentsByCity(city);
      if (response) {
        setRestaurantList(response);
      }
    } else {
      const response = await getRestuarents();
      console.log('response:',response)
      if (response) {
        setRestaurantList(response);
      }
    }
  };

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
        <p className="md:mx-28 ms-6 pb-5 font-bold md:text-xl">Top restaurant chains in { location ? location : "tavalo"}</p>
        <div className='flex w-[full] h-fit overflow-x-scroll custom-scroll-bar md:mx-24 md:py-5'>
          {restaurantList.map((restaurant: Restaurant) => (
            <div key={restaurant.id}>
              <RestaurantCard
                title={restaurant.name}
                rating={restaurant.rating}
                category={restaurant.tableCount}
                area={restaurant.area}
                imgUrl={`${restaurant.images ? `${base_url}files/restaurants/${restaurant.images}` : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ_VOrKf8cjdbXzZHa-DDUtU0luArTacQhJg&s'}`}
              />
            </div>
          ))}
        </div>
      </div>
      <footer className="bg-gradient-to-r from-orange-100 to-orange-200 py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          {/* Logo & Branding */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-3xl font-bold text-orange-600 mb-4">Tavalo</h2>
            <p className="text-orange-500 opacity-80">Restaurant management reimagined through intelligent technology.</p>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 col-span-2 gap-4">
            <div>
              <h4 className="font-semibold text-orange-600 mb-3">Product</h4>
              <ul className="space-y-2 text-orange-500">
                {['Features', 'Pricing', 'Integrations', 'Demo'].map((item) => (
                  <li key={item} className="hover:text-orange-700 transition-colors">
                    <a href="#">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-orange-600 mb-3">Company</h4>
              <ul className="space-y-2 text-orange-500">
                {['About', 'Careers', 'Press', 'Contact'].map((item) => (
                  <li key={item} className="hover:text-orange-700 transition-colors">
                    <a href="#">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter & Social */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div>
              <h4 className="font-semibold text-orange-600 mb-3">Stay Updated</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2 rounded-none bg-orange-50 border focus:outline-none focus:ring-2 focus:ring-transparent"
                />
                <button className="bg-orange-500 text-white px-4 rounded-none hover:bg-orange-600 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  target='_blank'
                  href="https://bit.ly/AthulSNair"
                  className="text-orange-500 hover:text-orange-700 transition-transform hover:scale-110"
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-orange-300 text-center text-orange-500">
          © 2025 Tavalo. All Rights Reserved.
        </div>
      </footer>
    </>
  )
}

export default home