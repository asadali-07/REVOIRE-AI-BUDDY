import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";


const searchProduct = tool(
    async ({ query, token }) => {

        console.log("searchProduct called with data:", { query, token });

        const response = await axios.get(
            `https://revoire-product.onrender.com/api/products?q=${query}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return JSON.stringify(response.data);
    },
    {
        name: "searchProduct",
        description: "Search for products based on a query",
        schema: z.object({
            query: z.string().describe("The search query for products"),
        }),
    }
);

const addProductToCart = tool(
    async ({ productId, qty = 1, token }) => {
        const response = await axios.post(
            `https://revoire-cart.onrender.com/api/cart/items`,
            {
                productId,
                qty,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return `Added product with id ${productId} (qty: ${qty}) to cart`;
    },
    {
        name: "addProductToCart",
        description: "Add a product to the shopping cart",
        schema: z.object({
            productId: z.string().describe("The id of the product to add to the cart"),
            qty: z
                .number()
                .describe("The quantity of the product to add to the cart")
                .default(1),
        }),
    }
);

const addProductToWishlist = tool(
    async ({ productId, token }) => {
        const response = await axios.post(
            `https://revoire-wishlist.onrender.com/api/wishlist/items`,
            {
                productId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return `Added product with id ${productId} to wishlist`;
    },
    {
        name: "addProductToWishlist",
        description: "Add a product to the wishlist",
        schema: z.object({
            productId: z.string().describe("The id of the product to add to the wishlist")
        }),
    }
);

const getUserCart = tool(
    async ({ token }) => {
        const response = await axios.get(
            `https://revoire-cart.onrender.com/api/cart`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return JSON.stringify(response.data.cart.items);
    },
    {
        name: "getUserCart",
        description: "Get the current user's shopping cart",
        schema: z.object({}),
    }
);

const getUserWishlist = tool(
    async ({ token }) => {
        const response = await axios.get(
            `https://revoire-wishlist.onrender.com/api/wishlist`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return JSON.stringify(response.data.wishlist.items);
    },
    {
        name: "getUserWishlist",
        description: "Get the current user's shopping wishlist",
        schema: z.object({}),
    }
);

const getUserRecentOrders = tool(
    async ({ token }) => {
        const response = await axios.get(
            `https://revoire-order.onrender.com/api/orders/me`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return JSON.stringify(response.data.orders.splice(0, 5));
    },
    {
        name: "getUserRecentOrders",
        description: "Get the current user's recent orders",
        schema: z.object({}),
    }
);

const getSomeProducts = tool(
    async ({ token }) => {
        const response = await axios.get(
            `https://revoire-product.onrender.com/api/products?limit=5`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return JSON.stringify(response.data.products);
    },
    {
        name: "getSomeProducts",
        description: "Get a list of some products",
        schema: z.object({}),
    }
);

export default { searchProduct, addProductToCart, addProductToWishlist, getUserCart, getUserWishlist, getUserRecentOrders, getSomeProducts };
