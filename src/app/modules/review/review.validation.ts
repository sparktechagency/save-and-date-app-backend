import { z } from "zod"
import { checkZodIDValidation } from "../../../shared/checkZodIDValidation"

const reviewZodSchema = z.object({
    body: z.object({
        vendor: checkZodIDValidation("Vendor Object ID is Required"),
        package: checkZodIDValidation("Package Object ID is Required"),
        rating: z.number({ required_error: 'Rating is required' }),
        comment: z.string({ required_error: 'Comment is required' }),
    })  
})

export const ReviewValidation = {reviewZodSchema}