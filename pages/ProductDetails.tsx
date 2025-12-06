import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Star, Truck, ShieldCheck, Heart, ShoppingCart, ArrowLeft, Plus, Minus, Zap, User as UserIcon } from 'lucide-react';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart, reviews, addReview, user } = useStore();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  
  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const product = products.find(p => p.id === id);

  if (!product) {
    return <div className="p-10 text-center">Product not found. <button onClick={() => navigate(-1)} className="text-blue-500">Go Back</button></div>;
  }

  const productReviews = reviews[product.id] || [];
  const averageRating = productReviews.length > 0 
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : product.rating; // Fallback to product default rating if no new reviews

  const handleQuantityChange = (val: number) => {
    if (val < 1) return;
    if (val > product.stock) return;
    setQuantity(val);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) {
          navigate('/login');
          return;
      }
      setIsSubmittingReview(true);
      
      // Simulate network delay
      setTimeout(() => {
          addReview(product.id, {
              userId: user.id,
              userName: user.name,
              rating: reviewRating,
              comment: reviewComment
          });
          setReviewComment("");
          setIsSubmittingReview(false);
      }, 500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="group flex items-center text-gray-500 hover:text-orange-600 mb-6 font-medium transition-colors"
      >
        <div className="bg-gray-100 p-2 rounded-full mr-3 group-hover:bg-orange-100 transition-colors">
          <ArrowLeft size={20} />
        </div>
        Back to Shop
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Section */}
          <div className="p-4 md:p-8 bg-gray-50 flex items-center justify-center">
            <img src={product.image} alt={product.name} className="max-w-full max-h-[400px] object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500" />
          </div>

          {/* Details Section */}
          <div className="p-6 md:p-10 flex flex-col">
            <div className="mb-1 text-orange-600 font-medium text-sm tracking-wide uppercase">{product.category}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-bold flex items-center gap-1">
                {averageRating} <Star size={12} fill="white" />
              </span>
              <span className="text-gray-500 text-sm">{product.reviews + productReviews.length} Ratings & Reviews</span>
            </div>

            <div className="text-4xl font-bold text-gray-900 mb-2">₹{product.price}</div>
            <div className="text-gray-500 mb-6 flex items-center gap-2">
              <span className="line-through">₹{product.originalPrice}</span>
              <span className="text-green-600 font-bold">{Math.round(((product.originalPrice - product.price)/product.originalPrice)*100)}% OFF</span>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description} Sold by <strong>{product.shopName}</strong>. 
              Top quality product assured. Support local businesses by buying this item.
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-8">
              <span className="font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                <button 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="p-3 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-l-lg transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-bold text-lg text-gray-900">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="p-3 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-r-lg transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              <span className="text-sm text-gray-500 ml-2">
                 {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={() => addToCart(product, quantity)}
                className="flex-1 bg-white border-2 border-orange-600 text-orange-600 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
              >
                <Zap size={20} fill="currentColor" /> Buy Now
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-auto">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Truck size={18} className="text-gray-800" />
                <span>Fast Delivery in 24hrs</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <ShieldCheck size={18} className="text-gray-800" />
                <span>100% Original Quality</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings & Reviews Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ratings & Reviews</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Existing Reviews List */}
              <div className="space-y-6">
                  {productReviews.length > 0 ? (
                      productReviews.map(review => (
                          <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                              <div className="flex items-center gap-2 mb-2">
                                  <div className="bg-green-600 text-white text-xs px-2 py-0.5 rounded font-bold flex items-center gap-1">
                                      {review.rating} <Star size={10} fill="white" />
                                  </div>
                                  <span className="font-semibold text-gray-800">{review.comment}</span>
                              </div>
                              <p className="text-gray-500 text-sm mb-2">by {review.userName}</p>
                              <div className="text-xs text-gray-400">{review.date}</div>
                          </div>
                      ))
                  ) : (
                      <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
                  )}
              </div>

              {/* Add Review Form */}
              <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-lg mb-4">Rate this product</h3>
                  {!user ? (
                      <div className="text-center py-6">
                          <p className="text-gray-600 mb-4">Please login to write a review.</p>
                          <button onClick={()=>navigate('/login')} className="text-orange-600 font-bold hover:underline">Login Now</button>
                      </div>
                  ) : (
                      <form onSubmit={handleSubmitReview}>
                          <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                              <div className="flex gap-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                      <button 
                                        key={star}
                                        type="button"
                                        onClick={() => setReviewRating(star)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                      >
                                          <Star 
                                            size={28} 
                                            className={star <= reviewRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                                          />
                                      </button>
                                  ))}
                              </div>
                          </div>
                          <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                              <textarea 
                                required
                                rows={4}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                placeholder="Describe your experience..."
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                              ></textarea>
                          </div>
                          <button 
                            type="submit" 
                            disabled={isSubmittingReview}
                            className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-700 transition-colors disabled:opacity-70"
                          >
                              {isSubmittingReview ? "Submitting..." : "Submit Review"}
                          </button>
                      </form>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};

export default ProductDetails;