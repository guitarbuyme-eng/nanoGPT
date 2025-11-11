'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShopifyProduct, getProduct } from '@/lib/shopify';
import { addToCart } from '@/lib/cart';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (params.handle) {
        const data = await getProduct(params.handle as string);
        setProduct(data);
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.handle]);

  const handleAddToCart = () => {
    if (!product) return;

    setAddingToCart(true);
    const variant = product.variants.edges[selectedVariant].node;
    const image = product.images.edges[0]?.node.url || '';

    addToCart({
      id: product.id,
      variantId: variant.id,
      title: product.title,
      price: variant.priceV2.amount,
      currencyCode: variant.priceV2.currencyCode,
      image,
      handle: product.handle,
    });

    window.dispatchEvent(new Event('cartUpdated'));

    setTimeout(() => {
      setAddingToCart(false);
      router.push('/cart');
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const variant = product.variants.edges[selectedVariant].node;
  const images = product.images.edges;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              <Image
                src={images[selectedImage]?.node.url || '/placeholder-guitar.jpg'}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-gray-900' : ''
                    }`}
                  >
                    <Image
                      src={image.node.url}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
              <p className="text-3xl font-bold text-gray-900">
                {variant.priceV2.currencyCode} ${parseFloat(variant.priceV2.amount).toFixed(2)}
              </p>
            </div>

            <div className="border-t border-b border-gray-200 py-6">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {product.variants.edges.length > 1 && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Select Variant
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.edges.map((v, index) => (
                    <button
                      key={v.node.id}
                      onClick={() => setSelectedVariant(index)}
                      disabled={!v.node.availableForSale}
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                        selectedVariant === index
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'
                      } ${!v.node.availableForSale ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {v.node.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!variant.availableForSale || addingToCart}
                className="w-full px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {addingToCart
                  ? 'Adding to Cart...'
                  : variant.availableForSale
                  ? 'Add to Cart'
                  : 'Out of Stock'}
              </button>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <svg
                    className="w-6 h-6 mx-auto mb-2 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-xs font-medium text-gray-900">Authentic</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <svg
                    className="w-6 h-6 mx-auto mb-2 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-xs font-medium text-gray-900">Fast Ship</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <svg
                    className="w-6 h-6 mx-auto mb-2 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <p className="text-xs font-medium text-gray-900">Secure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
