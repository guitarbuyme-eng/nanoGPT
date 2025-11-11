# Guitar Shop - Premium E-commerce Store

A modern, professional e-commerce website for selling guitars, built with Next.js 14, TypeScript, Tailwind CSS, and integrated with Shopify Storefront API.

## Features

- 🎸 Modern, clean design inspired by premium e-commerce sites
- 🛒 Full shopping cart functionality with local storage
- 🔄 Real-time product fetching from Shopify
- 📱 Fully responsive design (mobile, tablet, desktop)
- ⚡ Fast performance with Next.js App Router
- 🎨 Beautiful UI with Tailwind CSS
- 🔒 Secure checkout through Shopify

## Setup Instructions

### 1. Install Dependencies

```bash
cd guitar-shop
npm install
```

### 2. Configure Shopify Integration

You need to create a **Storefront API access token** (not the Admin API token you provided):

1. Go to your Shopify Admin panel
2. Navigate to **Apps** → **Develop apps**
3. Click **Create an app** (or select an existing app)
4. Go to **Configuration** → **Storefront API**
5. Enable the following scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_checkouts`
6. Click **Save**
7. Go to **API credentials** tab
8. Copy the **Storefront API access token**

### 3. Update Environment Variables

Edit the `.env.local` file in the project root:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token-here
```

Replace:
- `your-store.myshopify.com` with your actual Shopify store domain
- `your-storefront-access-token-here` with the Storefront API token from step 2

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
guitar-shop/
├── app/
│   ├── layout.tsx          # Root layout with Navbar & Footer
│   ├── page.tsx            # Homepage with hero & product grid
│   ├── product/[handle]/   # Dynamic product detail pages
│   └── cart/               # Shopping cart page
├── components/
│   ├── Navbar.tsx          # Navigation with cart counter
│   ├── Hero.tsx            # Hero section
│   ├── ProductCard.tsx     # Product card component
│   └── Footer.tsx          # Footer component
├── lib/
│   ├── shopify.ts          # Shopify API integration
│   └── cart.ts             # Cart management utilities
└── .env.local              # Environment variables
```

## Key Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shopify Storefront API** - Product data and checkout
- **Local Storage** - Client-side cart management

## Features Breakdown

### Homepage
- Eye-catching hero section with gradient background
- Featured product grid
- Feature highlights (quality, shipping, security)
- Smooth scroll navigation

### Product Pages
- Multiple product images with gallery
- Variant selection
- Add to cart functionality
- Product details and descriptions
- Availability status

### Shopping Cart
- View all cart items
- Update quantities
- Remove items
- Order summary with totals
- Proceed to Shopify checkout

## Customization

### Colors
The design uses a professional black/white/gray color scheme. To customize:
- Edit Tailwind classes in components
- Main accent: `bg-gray-900`, `text-gray-900`
- Hover states: `hover:bg-gray-800`

### Fonts
Currently using Inter font from Google Fonts. To change:
- Edit `app/layout.tsx`
- Import different font from `next/font/google`

## Important Notes

⚠️ **Admin API vs Storefront API**
- The Admin API token you provided (`shpat_...`) is for backend operations only
- This frontend app requires a **Storefront API token** for security
- Never expose Admin API tokens in frontend code

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Deploy to Other Platforms

Make sure to set the environment variables:
- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
- `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`

## Troubleshooting

### No products showing?
- Verify your Shopify store has published products
- Check that your Storefront API token has correct permissions
- Ensure `.env.local` is configured correctly
- Restart the dev server after changing environment variables

### Images not loading?
- Check that `next.config.ts` includes your Shopify CDN domain
- Verify products have images in Shopify admin

## License

MIT License - feel free to use this for your projects!

## Support

For issues or questions, please check:
- [Next.js Documentation](https://nextjs.org/docs)
- [Shopify Storefront API Docs](https://shopify.dev/docs/api/storefront)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
