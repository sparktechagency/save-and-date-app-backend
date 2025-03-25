import { z } from 'zod';
import { checkZodIDValidation } from '../../../shared/checkZodIDValidation';

export const createReservationZodSchema = z.object({
    body: z.object({
        barber : checkZodIDValidation("Package Object Id")
    })
})
