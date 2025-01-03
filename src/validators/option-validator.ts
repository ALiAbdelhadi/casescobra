// bg-zinc-950 border-zinc-950
// bg-blue-950 border-blue-950
// bg-rose-950 border-rose-950

import { PRODUCT_PRICES } from "@/config/products";
import { PhoneModel } from "@prisma/client";

export const COLORS = [
    { label: "Black", value: "black", tw: "zinc-950" },
    { label: "Blue", value: "blue", tw: "blue-950" },
    { label: "Rose", value: "rose", tw: "rose-950" },
] as const;

export const MODELS = {
    name: "models",
    options: [
        {
            label: "IPhone X",
            value: PhoneModel.iphonex,
        },
        {
            label: "IPhone 11",
            value: PhoneModel.iphone11,
        },
        {
            label: "IPhone 12",
            value: PhoneModel.iphone12,
        },
        {
            label: "IPhone 13",
            value: PhoneModel.iphone13,
        },
        {
            label: "IPhone 14",
            value: PhoneModel.iphone14,
        },
        {
            label: "IPhone 15",
            value: PhoneModel.iphone15,
        },
        {
            label: "IPhone 16",
            value: PhoneModel.iphone16,
        },
    ],
};
export const MATERIALS = {
    name: "material",
    options: [
        {
            label: "silicone",
            value: "silicone",
            description: undefined,
            price: PRODUCT_PRICES.material.silicone,
        },
        {
            label: "Soft Polycarbonate",
            value: "polycarbonate", 
            description: "Scratch-resistant coating",
            price: PRODUCT_PRICES.material.polycarbonate,
        },
    ],
} as const;

export const FINISHES = {
    name: "finish",
    options: [
        {
            label: "Smooth Finish",
            value: "smooth",
            description: "Scratch-resistant coating",
            price: PRODUCT_PRICES.finish.smooth,
        },
        {
            label: "Textured Finish",
            value: "textured",
            description: "Soft grippy texture",
            price: PRODUCT_PRICES.finish.textured,
        },
    ],
} as const;