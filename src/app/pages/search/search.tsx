import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getRestuarents } from '../home/homeService';
import RestaurantCard from '@/components/restuarantCard/restuarantCard';

interface Restaurant {
    _id: string;
    name: string;
    averageRating: string;
    tableCount: string;
    address: { city: string };
    images: string;
};

function RestaurantSearch() {
    const base_url = import.meta.env.VITE_BASE_URL;
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [searchResults, setSearchResults] = useState<Restaurant[]>([]);
    const [allRestaurantList, setAllRestaurantList] = useState<Restaurant[]>([]);

    const fetchRestuarants = async () => {
        try {
            setIsLoading(true);
            const response = await getRestuarents();
            if (response) {
                setAllRestaurantList(response);
            }
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRestuarants();
    }, []);

    const handleSearch = () => {
        setIsLoading(true);
        setHasSearched(true);
        
        const filtered = allRestaurantList.filter(restaurant =>
            restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setSearchResults(filtered);
        setIsLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Search Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Find Your Restaurant</h1>
                    <div className="flex max-w-xl mx-auto gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                className="pl-10 h-10 w-full rounded-none border-gray-200 focus:ring-orange-500"
                                placeholder="Search restaurants by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                        </div>
                        <Button 
                            className="bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-none"
                            onClick={handleSearch}
                        >
                            Search
                        </Button>
                    </div>
                </div>

                {/* Results Section */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-4 text-gray-600">Searching restaurants...</p>
                    </div>
                ) : hasSearched && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {searchResults.length > 0 ? (
                            searchResults.map((restaurant) => (
                                <div key={restaurant._id} className='flex justify-center items-center'>
                                    <RestaurantCard
                                        id={restaurant._id}
                                        title={restaurant.name}
                                        rating={restaurant.averageRating}
                                        category={restaurant.tableCount}
                                        area={restaurant.address.city}
                                        imgUrl={restaurant.images 
                                            ? `${base_url}files/restaurants/${restaurant.images}`
                                            : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ_VOrKf8cjdbXzZHa-DDUtU0luArTacQhJg&s'
                                        }
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 text-lg">
                                    No restaurants found matching "{searchQuery}"
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RestaurantSearch;