'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShopifyProduct } from '@/lib/shopify';

interface ProductCardProps {
  product: ShopifyProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const image = product.images.edges[0]?.node.url || '/placeholder-guitar.jpg';
  const price = product.priceRange.minVariantPrice.amount;
  const currencyCode = product.priceRange.minVariantPrice.currencyCode;

  return (
    <Link href={`/product/${product.handle}`}>
      <div className="group cursor-pointer">
        <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
          <Image
            src={image}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
            {product.title}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-gray-900">
              {currencyCode} ${parseFloat(price).toFixed(2)}
            </p>
            <span className="text-sm text-gray-500 group-hover:text-gray-900 transition-colors">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
