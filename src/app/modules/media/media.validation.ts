import { z } from 'zod';

export const mediaZodValidationSchema = z.object({
    body: z.object({
        image: z.string({ required_error: 'Image is required' })
    })
});