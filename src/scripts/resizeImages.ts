import fs from "fs";
import path from "path";
import { getPayload } from "payload";
import { fileURLToPath } from "url";
import config from "../payload.config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function resizeExistingImages() {
  // Initialize Payload
  const payload = await getPayload({
    config,
  });

  try {
    // Get all media documents
    const mediaResponse = await payload.find({
      collection: "media",
      limit: 1000, // Adjust limit as needed
    });

    const mediaItems = mediaResponse.docs;

    payload.logger.info(`Found ${mediaItems.length} media items to process`);

    // Process each media item
    for (let i = 0; i < mediaItems.length; i++) {
      const media = mediaItems[i];
      payload.logger.info(`Processing image ${i + 1}/${mediaItems.length}: ${media.filename}`);

      try {
        // Regenerate sizes by resaving the media
        if (media.url) {
          // Extract filename from URL
          const filename = media.url.split("/").pop();

          // Check if filename is defined
          if (filename) {
            // Check if file exists in the local media directory
            const localPath = path.join(process.cwd(), "media", filename);

            if (fs.existsSync(localPath)) {
              await payload.update({
                collection: "media",
                id: media.id,
                data: {}, // No need to change data, just resave to trigger resize
                filePath: localPath, // Use local file path
              });
              payload.logger.info(
                `Successfully processed ${media.filename} from local path ${localPath}`,
              );
            } else {
              payload.logger.info(`Skipping ${media.filename} - file not found at ${localPath}`);
            }
          } else {
            payload.logger.info(
              `Skipping ${media.filename} - could not extract filename from URL ${media.url}`,
            );
          }
        } else {
          payload.logger.info(`Skipping ${media.filename} - no URL found`);
        }
      } catch (error) {
        payload.logger.error(`Error processing ${media.filename}: ${error}`);
      }
    }

    payload.logger.info("Image resizing complete!");
    process.exit(0);
  } catch (error) {
    payload.logger.error(`Error resizing images: ${error}`);
    process.exit(1);
  }
}

resizeExistingImages();
