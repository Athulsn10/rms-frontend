import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { Star, Clock, MessageSquare, CircleAlert, Loader2 } from "lucide-react";
import { restaurantRating } from "../../customer/customerService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Rating {
    _id: string;
    rating: string;
    comment: string;
    userId: { name: string };
    updatedAt: string;
}

function customerRatings() {
    const [isLoading, setIsLoading] = useState(false);
    const [customerRatings, setCustomerRatings] = useState<Rating[]>([]);

    const getCustomerRatings = async () => {
        const restaurantId = localStorage.getItem('id');
        if (restaurantId) {
            const response = await restaurantRating(restaurantId);
            if (response) {
                setCustomerRatings(response.reverse());
                setIsLoading(false);
            } else {
                setIsLoading(false);
                toast.error('Failed to load reviews!', {
                    icon: <CircleAlert color="#fc3419" />,
                });
            }
        }
    };

    useEffect(() => {
        setIsLoading(true);
        getCustomerRatings();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <>
            {
                isLoading ? (
                    <div className='flex items-center justify-center h-full text-orange-600'>
                        <Loader2 className="w-9 h-9 animate-spin" />
                    </div>
                ) :
                    (
                        <div className="w-full max-w-4xl mx-auto p-4">
                            <Card className="w-full">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                        <MessageSquare className="w-6 h-6" />
                                        Customer Reviews
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {customerRatings.length > 0 ? (
                                        <div className="space-y-4">
                                            {customerRatings.map((rating) => (
                                                <div
                                                    key={rating._id}
                                                    className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <div className="font-semibold text-lg">
                                                                    {rating.userId.name}
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    {[...Array(5)].map((_, index) => (
                                                                        <Star
                                                                            key={index}
                                                                            className={`w-4 h-4 ${index < parseInt(rating.rating)
                                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                                : 'text-gray-300'
                                                                                }`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <p className="text-gray-600">{rating.comment}</p>
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Clock className="w-4 h-4 mr-1" />
                                                            {formatDate(rating.updatedAt)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                            <p className="text-lg">No reviews yet</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )
            }
            <Toaster />
        </>
    );
}

export default customerRatings;