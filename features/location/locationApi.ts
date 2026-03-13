import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ServiceableLocation {
  id: number;
  name: string;
  city: string;
  state: string;
  pincode: string;
  deliveryDays: number;
  codAvailable: boolean;
}

export const locationApi = createApi({
  reducerPath: "locationApi",
  tagTypes: ["Locations"],
  baseQuery: fetchBaseQuery({
    baseUrl: (process.env.NEXT_PUBLIC_API_URL || "https://project-fnwy.onrender.com")
      .trim()
      .replace(/\/$/, ""),
    credentials: "include",
    prepareHeaders: (headers) => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;
        const tokenType =
          typeof window !== "undefined"
            ? localStorage.getItem("tokenType") || "Bearer"
            : "Bearer";
        if (token) headers.set("Authorization", `${tokenType} ${token}`);
      } catch {
        // ignore on server
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getLocations: builder.query<ServiceableLocation[], void>({
      query: () => ({
        url: "api/locations",
        method: "GET",
      }),
      providesTags: ["Locations"],
    }),

    checkLocationServiceability: builder.query<ServiceableLocation, string>({
      query: (pincode) => ({
        url: "api/locations/serviceable",
        method: "GET",
        params: { pincode },
      }),
    }),
  }),
});

export const {
  useGetLocationsQuery,
  useLazyCheckLocationServiceabilityQuery,
} = locationApi;
