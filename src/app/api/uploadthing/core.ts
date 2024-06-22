import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
import sharp from "sharp";
import { db } from "@/db";
const f = createUploadthing();

export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "4MB" } })
        .input(z.object({ configId: z.string().optional() }))
        .middleware(async ({ input }) => {
            return { input };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            try {
                const { configId } = metadata.input;
                const res = await fetch(file.url);
                const buffer = await res.arrayBuffer();
                const imgMetadata = await sharp(Buffer.from(buffer)).metadata();
                const { width, height } = imgMetadata;

                if (!configId) {
                    // Assuming default values for color, model, material, and finish
                    const defaultColor = 'black'; // Change this to a valid default color
                    const configuration = await db.configuration.create({
                        data: {
                            imageUrl: file.url,
                            height: height || 500,
                            width: width || 500,
                            color: defaultColor,
                            // Optionally add default values for other fields if required
                        },
                    });
                    return { configId: configuration.id };
                } else {
                    const updatedConfiguration = await db.configuration.update({
                        where: {
                            id: configId,
                        },
                        data: {
                            croppedImageUrl: file.url,
                        },
                    });
                    return { configId: updatedConfiguration.id };
                }
            } catch (error) {
                console.error("Error in onUploadComplete:", error);
                throw new Error("Failed to complete upload process.");
            }
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
