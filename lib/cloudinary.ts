// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadFile(buffer: Buffer, folder: string) {
  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: `orphanage_erp/${folder}`, // Organized paths
        resource_type: "auto" // This allows PDFs and Images to be handled correctly
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    ).end(buffer);
  });
}
export async function uploadImage(buffer: Buffer, folder: string = "general") {
  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: `orphanage_erp/${folder}`,
        resource_type: "auto" // Auto-detects if it's an image or a PDF
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    ).end(buffer);
  });
}