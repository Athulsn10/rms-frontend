import { useEffect, useState } from 'react';
import RestaurantCard from '@/components/restuarantCard/restuarantCard'
import { getRestuarents, getRestuarentsByCity } from './homeService.js';
import { Facebook, Instagram, Twitter, Linkedin, Utensils, Star, MapPin, Coffee } from 'lucide-react';

interface Restaurant {
  _id: string,
  name: string,
  rating: string,
  tableCount: string,
  area: string,
  images: string
}

function home() {
  const [location, setLocation] = useState('')
  const [restaurantList, setRestaurantList] = useState([]);
  const [allRestaurantList, setallRestaurantList] = useState([]);
  const base_url = import.meta.env.VITE_BASE_URL;

  const cards = [
    { value: '500+', label: 'Restaurants', icon: <Utensils className="text-blue-600" size={36} /> },
    { value: '12K+', label: 'Happy Customers', icon: <Star className="text-yellow-500" size={36} /> },
    { value: '25', label: 'Cities Covered', icon: <MapPin className="text-green-600" size={36} /> },
    { value: '24/7', label: 'Customer Support', icon: <Coffee className="text-purple-600" size={36} /> }
  ];

  const fetchRestuarants = async () => {
    const city = localStorage.getItem('city');
    if (city) {
      setLocation(city);
      const response = await getRestuarentsByCity(city);
      if (response) {
        setRestaurantList(response);
      }
    }
    const response = await getRestuarents();
    if (response) {
      setallRestaurantList(response);
    }
  };

  useEffect(() => {
    fetchRestuarants();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className='px-4 sm:px-6 lg:px-8 py-4 sm:py-6'>
          <div className='w-full bg-white rounded-xl shadow-sm'>
            <div className='relative'>
              <img
                src="https://images.pexels.com/photos/959922/pexels-photo-959922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Restaurant hero"
                className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover rounded-xl"
              />
              <div className='absolute bottom-8 sm:bottom-12 lg:bottom-16 left-4 sm:left-8 lg:left-10 p-4'>
                <h1 className='text-white text-2xl sm:text-3xl lg:text-4xl font-bold text-wrap max-w-[280px] sm:max-w-[350px] lg:max-w-[450px]'>
                  Restaurants Near Me For Dining Out
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map(({ value, label, icon }) => (
              <div key={label} className="flex items-center space-x-4 p-4 sm:p-6 bg-orange-50 hover:shadow-md rounded-lg">
                {icon}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">{value}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restaurant Lists */}
        <div className="space-y-8">
          {/* Local Restaurants */}
          <div>
            <h2 className="px-4 sm:px-6 lg:px-8 text-lg sm:text-xl font-bold">
              Top restaurant chains in {location ? location : "tavalo"}
            </h2>
            <div className='mt-4 px-4 sm:px-6 lg:px-8 overflow-x-auto custom-scroll-bar'>
              <div className='flex space-x-4 min-w-full pb-4 '>
                {restaurantList.map((restaurant: Restaurant) => (
                  <div key={restaurant._id} className="flex-none w-72 sm:w-80">
                    <RestaurantCard
                      id={restaurant._id}
                      title={restaurant.name}
                      rating={restaurant.rating}
                      category={restaurant.tableCount}
                      area={restaurant.area}
                      imgUrl={restaurant.images ? `${base_url}files/restaurants/${restaurant.images}` : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ_VOrKf8cjdbXzZHa-DDUtU0luArTacQhJg&s'}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All Restaurants */}
          <div>
            <h2 className="px-4 sm:px-6 lg:px-8 text-lg sm:text-xl font-bold">
              Top restaurant chains in Tavalo
            </h2>
            <div className='mt-4 px-4 sm:px-6 lg:px-8 overflow-x-auto'>
              <div className='flex space-x-4 min-w-full pb-4 custom-scroll-bar'>
                {allRestaurantList.map((restaurant: Restaurant) => (
                  <div key={restaurant._id} className="flex-none w-72 sm:w-80">
                    <RestaurantCard
                      id={restaurant._id}
                      title={restaurant.name}
                      rating={restaurant.rating}
                      category={restaurant.tableCount}
                      area={restaurant.area}
                      imgUrl={restaurant.images ? `${base_url}files/restaurants/${restaurant.images}` : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ_VOrKf8cjdbXzZHa-DDUtU0luArTacQhJg&s'}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 bg-gradient-to-r from-orange-100 to-orange-200 pt-12 pb-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Branding */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-orange-600">Tavalo</h2>
              <p className="text-orange-500 opacity-80">
                Restaurant management reimagined through intelligent technology.
              </p>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-8 sm:col-span-2">
              <div>
                <h4 className="font-semibold text-orange-600 mb-4">Product</h4>
                <ul className="space-y-2 text-orange-500">
                  {['Features', 'Pricing', 'Integrations', 'Demo'].map((item) => (
                    <li key={item}>
                      <a href="#" className="hover:text-orange-700 transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-600 mb-4">Company</h4>
                <ul className="space-y-2 text-orange-500">
                  {['About', 'Careers', 'Press', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href="#" className="hover:text-orange-700 transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter & Social */}
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-orange-600 mb-4">Stay Updated</h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full px-4 py-2 rounded-none bg-orange-50 border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                  <button className="w-full sm:w-auto bg-orange-500 text-white px-6 py-2 rounded-none hover:bg-orange-600 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                {[Facebook, Instagram, Twitter, Linkedin].map((Icon, index) => (
                  <a
                    key={index}
                    href="https://bit.ly/AthulSNair"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-700 transition-transform hover:scale-110"
                  >
                    <Icon size={24} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-orange-300 text-center text-orange-500">
            © 2025 Tavalo. All Rights Reserved.
          </div>
        </footer>
      </div>
    </>
  )
}

export default home