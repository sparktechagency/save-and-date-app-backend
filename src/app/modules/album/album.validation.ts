import { z } from 'zod';
import { checkValidID } from '../../../shared/checkValidID';

export const albumZodValidationSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Name is required' }),
        package: checkValidID("Package is required")
    })
});
