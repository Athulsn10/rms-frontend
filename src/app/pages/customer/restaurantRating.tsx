import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import toast, { Toaster } from 'react-hot-toast';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { CircleAlert, CircleCheck, Star, Edit2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { customerRating, editCustomerRating, rateRestuarant, restaurantRating } from './customerService';

interface RestuarantProps {
    idFromParams: string | null
};

interface Rating {
  _id: string;
  rating: string;
  comment: string;
  userId: { name: string };
  updatedAt: string;
};

const RestaurantRating: React.FC<RestuarantProps> = ({idFromParams}) => {
  
  const [rating, setRating] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [description, setDescription] = useState('');
  const [customerRatings, setCustomerRatings] = useState<Rating[]>([]);
  const [currentCustomerRating, setCurrentCustomerRating] = useState<Rating | null>(null);
 

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleMouseEnter = (starIndex: number) => {
    setHoverRating(starIndex);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const resetForm = () => {
    setRating(0);
    setDescription('');
    setIsEditing(false);
  };

  const handleReviewSubmit = async () => {
    let id;
    const resturant = localStorage.getItem('restaurantOrder');

    if (resturant) {
      const parsedRestuarant = JSON.parse(resturant);
      id = parsedRestuarant.restaurantId;
    } else if (idFromParams) {
      id = String(idFromParams);
    } else {
      toast.error('Something went wrong!', {
        icon: <CircleAlert color="#fc3419" />,
      });
      return;
    };

    const ratingObject = {
        restaurantId: id,
        rating: String(rating),
        comment: description
    };

    try {
      if (isEditing && currentCustomerRating) {
        const response = await editCustomerRating(currentCustomerRating._id, ratingObject);
        if (response) {
          toast.success('Review updated successfully', {
            icon: <CircleCheck color="#1ce867" />,
          });
          await getRestuarantReviews();
          await getUserRating();
          resetForm();
        }
      } else {
        const response = await rateRestuarant(ratingObject);
        if (response) {
          toast.success('Review submitted successfully', {
            icon: <CircleCheck color="#1ce867" />,
          });
          await getRestuarantReviews();
          await getUserRating();
          resetForm();
        }
      }
    } catch (error) {
      toast.error('Failed to submit review. Please try again!', {
        icon: <CircleAlert color="#fc3419" />,
      });
    }
  };

  const getRestuarantReviews = async () => {
    let id;
    const resturant = localStorage.getItem('restaurantOrder');
    if (idFromParams) {
      id = idFromParams;
    } else if (resturant) {
      const parsedRestuarant = JSON.parse(resturant);
      const restaurantId = parsedRestuarant.restaurantId;
      id = restaurantId;
    } else {
      toast.error('Failed to fetch reviews. Please try again!', {
        icon: <CircleAlert color="#fc3419" />,
      });
      return;
    }

    const response = await restaurantRating(id);
    if (response) {
      setCustomerRatings(response.reverse());
    } else {
      toast.error('Failed to fetch reviews. Please try again!', {
        icon: <CircleAlert color="#fc3419" />,
      });
    }
  };

  const getUserRating = async () => {
    let id;
    const customerId = localStorage.getItem('id');
    const resturant = localStorage.getItem('restaurantOrder');
    if (idFromParams) {
      id = idFromParams;
    } else if (resturant) {
      const parsedRestuarant = JSON.parse(resturant);
      const restaurantId = parsedRestuarant.restaurantId;
      id = restaurantId;
    } else {
      toast.error('Failed to fetch reviews. Please try again!', {
        icon: <CircleAlert color="#fc3419" />,
      });
      return;
    }
    if (!customerId) {
      toast.error('Customer ID not found. Please login again!', {
        icon: <CircleAlert color="#fc3419" />,
      });
      return;
    }
    const response = await customerRating(customerId, id);
    if (response) {
      setCurrentCustomerRating(response);
      if (response.rating) {
        setRating(parseInt(response.rating));
        setDescription(response.comment);
      }
    }
  };

  const handleEditClick = () => {
    if (currentCustomerRating) {
      setRating(parseInt(currentCustomerRating.rating));
      setDescription(currentCustomerRating.comment);
      setIsEditing(true);
    }
  };

  useEffect(() => {
    getUserRating();
    getRestuarantReviews();
  }, []);

  const ReviewStars = ({ rating }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={`${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex ml-2 md:ml-4 items-center bg-orange-200 rounded-none hover:bg-orange-200 px-5 py-5">
            <Star size={28} className="text-orange-500" />
            <p className="font-bold text-orange-500 text-xl hidden md:inline">
              {currentCustomerRating ? 'Edit Review' : 'Rate Restaurant'}
            </p>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl min-h-[70vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Restaurant Reviews</DialogTitle>
          </DialogHeader>
          
          <div className='max-h-[70vh] min-h-[70vh]'>
            <Tabs defaultValue="write" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="write">
                  {currentCustomerRating ? 'Edit Review' : 'Write a Review'}
                </TabsTrigger>
                <TabsTrigger value="reviews">View Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="write" className="mt-4 space-y-6">
                <div className="flex flex-col items-center">
                  {currentCustomerRating && !isEditing && (
                    <div className="mb-4 w-full">
                      <Card className="w-full">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold">Your Review</h3>
                             <div className='flex items-center space-x-2'>
                                <ReviewStars rating={parseInt(currentCustomerRating.rating)} />
                                <span className="text-sm text-gray-500">
                                  {new Date(currentCustomerRating.updatedAt).toLocaleDateString()}
                                </span>
                             </div>
                              <p className="text-gray-600 mt-2">{currentCustomerRating.comment}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleEditClick}
                              className="flex items-center gap-2"
                            >
                              <Edit2 size={16} />
                              Edit
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
  
                  {(!currentCustomerRating || isEditing) && (
                    <>
                      <div className="flex space-x-2 mb-2">
                        {[1, 2, 3, 4, 5].map((starIndex) => (
                          <Star
                            key={starIndex}
                            size={60}
                            className={`cursor-pointer transition-colors ${
                              (hoverRating || rating) >= starIndex
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            onClick={() => handleStarClick(starIndex)}
                            onMouseEnter={() => handleMouseEnter(starIndex)}
                            onMouseLeave={handleMouseLeave}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        {rating ? `You rated: ${rating} star${rating !== 1 ? 's' : ''}` : 'Select your rating'}
                      </p>
  
                      <div className="space-y-2 w-full">
                        <label htmlFor="description" className="text-sm font-medium">
                          Share your experience
                        </label>
                        <Textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Tell us what you liked or didn't like..."
                          className="min-h-52 max-h-52"
                        />
                      </div>
  
                      <div className="flex gap-4 w-full">
                        <Button 
                          className="w-full bg-orange-500 hover:bg-orange-600 rounded-none"
                          onClick={handleReviewSubmit}
                          disabled={!rating || !description.trim()}
                        >
                          {isEditing ? 'Update Review' : 'Submit Review'}
                        </Button>
                        {isEditing && (
                          <Button 
                            variant="outline"
                            className="w-full rounded-none"
                            onClick={resetForm}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
    
              <TabsContent value="reviews" className="mt-4">
                <ScrollArea className="h-96">
                  {customerRatings.length > 0 ? (
                    <div className="space-y-4">
                      {customerRatings.map((review) => (
                        <Card key={review._id} className="w-full">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold">{review.userId.name}</h3>
                                <div className="flex items-center space-x-2">
                                  <ReviewStars rating={parseInt(review.rating)} />
                                  <span className="text-sm text-gray-500">
                                    {new Date(review.updatedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-600 mt-2">{review.comment}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[455px] flex items-center justify-center">
                      <p className="text-gray-700">
                        No reviews yet. Be the first one to review!
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
};

export default RestaurantRating;