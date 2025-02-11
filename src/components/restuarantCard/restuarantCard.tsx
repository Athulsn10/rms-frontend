import { Armchair, CircleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';


interface cardProps {
    id: string,
    title: string;
    rating: string;
    category: string;
    area: string;
    imgUrl?: string;
}

const RestaurantCard: React.FC<cardProps> = ({ id, title, rating, category, area, imgUrl }) => {
    const navigate = useNavigate();

    const handleNavigate = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        const user = localStorage.getItem('user');
        if (user) {
            navigate(`/restuarant?id=${id}`)
        } else {
            toast.error('Login To Continue!', {
                icon: <CircleAlert color="#fc3419" />,
            });
        }
    }

    return (
        <div onClick={handleNavigate} className="ms-5 me-3 w-[270px] overflow-hidden rounded-lg rounded-t-3xl hover:cursor-pointer bg-white hover:shadow-md">
            <div className="overflow-hidden">
                <div className="h-48 w-full">
                    <img
                        src={imgUrl}
                        alt="Restaurant"
                        className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </div>
            <div className="p-3 pt-1">
                <p className="font-bold text-lg text-gray-800">{title}</p>
                <div className="flex items-center gap-1">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" role="img" aria-hidden="true">
                        <circle cx="10" cy="10" r="9" fill="url(#StoreRatingGradient)"></circle>
                        <path d="M10.0816 12.865C10.0312 12.8353 9.96876 12.8353 9.91839 12.865L7.31647 14.3968C6.93482 14.6214 6.47106 14.2757 6.57745 13.8458L7.27568 11.0245C7.29055 10.9644 7.26965 10.9012 7.22195 10.8618L4.95521 8.99028C4.60833 8.70388 4.78653 8.14085 5.23502 8.10619L8.23448 7.87442C8.29403 7.86982 8.34612 7.83261 8.36979 7.77777L9.54092 5.06385C9.71462 4.66132 10.2854 4.66132 10.4591 5.06385L11.6302 7.77777C11.6539 7.83261 11.706 7.86982 11.7655 7.87442L14.765 8.10619C15.2135 8.14085 15.3917 8.70388 15.0448 8.99028L12.7781 10.8618C12.7303 10.9012 12.7095 10.9644 12.7243 11.0245L13.4225 13.8458C13.5289 14.2757 13.0652 14.6214 12.6835 14.3968L10.0816 12.865Z" fill="white"></path>
                        <defs>
                            <linearGradient id="StoreRatingGradient" x1="10" y1="1" x2="10" y2="19" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#21973B"></stop>
                                <stop offset="1" stopColor="#128540"></stop>
                            </linearGradient>
                        </defs>
                    </svg>
                    <p className="text-base font-medium">{rating || '0'}</p>
                </div>
                <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                    <Armchair size={20} />
                    {category}
                </p>
                <p className="text-sm text-gray-600">{area}</p>
            </div>
            <Toaster />
        </div>
    );
};

export default RestaurantCard;
