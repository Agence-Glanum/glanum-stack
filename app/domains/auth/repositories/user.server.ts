import { makeDomainFunction } from "domain-functions";
import { z } from "zod";

export const checkIfEmailExists = makeDomainFunction(z.object({
    email: z.string().min(1),
}))(async ({email}) => {
    const exists = true

    if (exists) {
        throw new Error()
    }

    return email
})