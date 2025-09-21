import z from "zod";

const vehicleDetailsZodSchema = z.object({
      type: z.enum(['bike', 'car']).nonoptional("vehicle types is required"),
      model: z.string().nonempty("Vehicle model is required"),
      color: z.string().nonempty('Vehicle color is required'),
      plateNumber: z.string().nonempty('Vehicle plate number is required'),
});

export const applyForDriverZodSchema = z.object({
      licenseNumber: z.string().nonempty("License number is required"),
      licenseImage: z.url('License image URL is required'),
      vehicleDetails: vehicleDetailsZodSchema,
});

export const updateAvailabilityZodSchema = z.object({
      isAvailable: z.boolean().nonoptional("Availability status is required")
})
const geoJsonPointSchema = z.object({
  type: z.literal('Point', { message: 'Location type must be Point' }),
  coordinates: z.array(z.number()).length(2, { message: 'Coordinates must be an array of two numbers [longitude, latitude]' }),
});

export const updateLocationZodSchema = z.object({
    currentLocation: geoJsonPointSchema,
})