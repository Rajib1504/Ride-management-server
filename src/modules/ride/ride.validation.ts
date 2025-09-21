import { z } from 'zod';

const geoJsonPointSchema = z.object({
  type: z.literal('Point', { message: 'Location type must be Point' }),
  coordinates: z.array(z.number()).length(2, { message: 'Coordinates must be an array of two numbers [longitude, latitude]' }),
});

export const requestRideZodSchema = z.object({
  pickupLocation: geoJsonPointSchema,
  destinationLocation: geoJsonPointSchema,
});