import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'your-store.myshopify.com',
  apiVersion: '2024-10',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
});

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        priceV2: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
      };
    }>;
  };
}

export interface ShopifyProductsResponse {
  data: {
    products: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
  };
}

export interface ShopifyProductResponse {
  data: {
    product: ShopifyProduct;
  };
}

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_QUERY = `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            priceV2 {
              amount
              currencyCode
            }
            availableForSale
          }
        }
      }
    }
  }
`;

export async function getProducts(count: number = 12) {
  try {
    const { data, errors } = await client.request(PRODUCTS_QUERY, {
      variables: { first: count },
    });

    if (errors) {
      console.error('Shopify API errors:', errors);
      return [];
    }

    return (data as ShopifyProductsResponse['data']).products.edges.map(edge => edge.node);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProduct(handle: string) {
  try {
    const { data, errors } = await client.request(PRODUCT_QUERY, {
      variables: { handle },
    });

    if (errors) {
      console.error('Shopify API errors:', errors);
      return null;
    }

    return (data as ShopifyProductResponse['data']).product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function createCheckout(variantId: string, quantity: number = 1) {
  const CHECKOUT_CREATE_MUTATION = `
    mutation CheckoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          message
          field
        }
      }
    }
  `;

  try {
    const { data, errors } = await client.request(CHECKOUT_CREATE_MUTATION, {
      variables: {
        input: {
          lineItems: [{ variantId, quantity }],
        },
      },
    });

    if (errors) {
      console.error('Checkout creation errors:', errors);
      return null;
    }

    return (data as any).checkoutCreate.checkout;
  } catch (error) {
    console.error('Error creating checkout:', error);
    return null;
  }
}
