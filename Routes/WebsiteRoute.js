export const WEBSITE_HOME = "/";
export const WEBSITE_LOGIN = "/auth/login";
export const WEBSITE_REGISTER = "/auth/register";
export const WEBSITE_RESETPASSWORD = "/auth/reset-password";

// user route
export const USER_DASHBOARD = "/my-account";

// shop route
export const WEBSITE_SHOP = "/shop";

// product route
export const WEBSITE_PRODUCT_DETAILS = (slug) => slug ? `/product/${slug}` : "/product";

// cart route
export const WEBSITE_CART = "/cart";
