import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { useStore } from '../context/StoreContext';
import { Star, ArrowRight, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { ProductCard, QuickViewModal } from '../components/ProductCard';
import { Product } from '../types';

const Home: React.FC = () => {
  const { products, ads } = useStore();
  const featuredProducts = products.slice(0, 4);
  const heroAds = ads.filter(ad => ad.placement === 'hero');
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // Auto-rotate ads
  useEffect(() => {
    if (heroAds.length <= 1) return;
    const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % heroAds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroAds.length]);

  const nextAd = () => setCurrentAdIndex((prev) => (prev + 1) % heroAds.length);
  const prevAd = () => setCurrentAdIndex((prev) => (prev - 1 + heroAds.length) % heroAds.length);

  return (
    <div className="space-y-8">
      {/* Sponsored Ad Slider (Replacing Hero) */}
      <section className="relative bg-gray-100 h-[250px] md:h-[450px] overflow-hidden group">
        {heroAds.length > 0 ? (
            <div className="relative w-full h-full">
                {heroAds.map((ad, index) => (
                    <div 
                        key={ad.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentAdIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                         <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                         {/* Gradient Overlay for Text Readability */}
                         <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent flex flex-col justify-end p-6 md:p-16 pb-12">
                            <div className="container mx-auto">
                                <span className="bg-orange-500 text-white px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider mb-4 inline-block shadow-sm">Sponsored</span>
                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg leading-tight max-w-2xl">{ad.title}</h2>
                                <Link 
                                    to={ad.link} 
                                    className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-orange-50 transition-colors shadow-lg"
                                >
                                    Shop Now <ArrowRight size={20} />
                                </Link>
                            </div>
                         </div>
                    </div>
                ))}
                
                {/* Slider Controls */}
                {heroAds.length > 1 && (
                    <>
                        <button 
                            onClick={prevAd} 
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 p-3 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <button 
                            onClick={nextAd} 
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 p-3 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight size={32} />
                        </button>
                        
                        {/* Dots */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                            {heroAds.map((_, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => setCurrentAdIndex(idx)}
                                    className={`h-2 rounded-full transition-all duration-300 shadow-sm ${idx === currentAdIndex ? 'bg-orange-500 w-8' : 'bg-white/50 w-2 hover:bg-white'}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-200">
                <ImageOff size={48} className="mb-2 opacity-50"/>
                <span className="text-lg font-medium">No advertisements available</span>
            </div>
        )}
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, idx) => (
            <Link to={`/shop?cat=${cat}`} key={idx} className="group bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center justify-center hover:shadow-md transition-all hover:border-orange-200">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors text-orange-600 font-bold text-xl">
                 {cat[0]}
              </div>
              <span className="text-sm font-medium text-gray-700 text-center group-hover:text-orange-600">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-8">
         <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Trending Near You</h2>
          <Link to="/shop" className="text-orange-600 font-medium hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard 
                key={product.id} 
                product={product} 
                onQuickView={setViewingProduct}
            />
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-orange-50 py-12">
         <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-4">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow text-3xl">🇮🇳</div>
               <h3 className="font-bold text-lg mb-2">Vocal for Local</h3>
               <p className="text-sm text-gray-600">Supporting thousands of local shopkeepers and artisans.</p>
            </div>
            <div className="p-4">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow text-3xl">🚀</div>
               <h3 className="font-bold text-lg mb-2">Superfast Delivery</h3>
               <p className="text-sm text-gray-600">Get your daily needs delivered in minutes by our rider partners.</p>
            </div>
             <div className="p-4">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow text-3xl">🛡️</div>
               <h3 className="font-bold text-lg mb-2">Secure Payments</h3>
               <p className="text-sm text-gray-600">Pay via UPI, Cards, or Netbanking with 100% security.</p>
            </div>
         </div>
      </section>

      {viewingProduct && (
        <QuickViewModal 
            product={viewingProduct} 
            onClose={() => setViewingProduct(null)} 
        />
      )}
    </div>
  );
};

export default Home;