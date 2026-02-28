// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import { weatherApi } from "./api/WeatherApi";
import { PricingSystemApi } from "./api/PricingSystem";
import { cropsApi } from "./api/CropsApi";
import { vegetableApi } from "./api/VegetableApi";
import { fruitsApi } from "./api/FruitsApi";
import { pulsesApi } from "./api/PulsesApi";
import { JwtAuth } from "./api/JwtAuth";
import authReducer from "./authSlice";
import { coldStorageApi } from "./api/ColdStorageApi";
import { productApi } from "./api/ProductApi";
import { rentalsApi } from "./api/RentalsApi";
import { paymentApi } from "./api/PaymentApi";
import { cartApi } from "./api/CartApi";
import { godownApi } from "./api/GodownApi";
import { openMeteo } from "./api/OpenMeteoApi";
import { aiApi } from "./api/CropAiApi";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
    [PricingSystemApi.reducerPath]: PricingSystemApi.reducer,
    [cropsApi.reducerPath]: cropsApi.reducer,
    [vegetableApi.reducerPath]: vegetableApi.reducer,
    [fruitsApi.reducerPath]: fruitsApi.reducer,
    [pulsesApi.reducerPath]: pulsesApi.reducer,
    [JwtAuth.reducerPath]: JwtAuth.reducer,
    [coldStorageApi.reducerPath]: coldStorageApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [rentalsApi.reducerPath]: rentalsApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [godownApi.reducerPath]: godownApi.reducer,
    [openMeteo.reducerPath]: openMeteo.reducer,
    [aiApi.reducerPath]: aiApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(weatherApi.middleware, PricingSystemApi.middleware, cropsApi.middleware, vegetableApi.middleware, fruitsApi.middleware, pulsesApi.middleware, JwtAuth.middleware, coldStorageApi.middleware, productApi.middleware, rentalsApi.middleware, paymentApi.middleware, cartApi.middleware, godownApi.middleware, openMeteo.middleware, aiApi.middleware),
});
