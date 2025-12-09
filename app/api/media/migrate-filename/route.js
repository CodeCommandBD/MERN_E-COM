import { connectDB } from "@/lib/dbConnection";
import MediaModel from "@/Models/Media.model";
import { isAuthenticated } from "@/lib/authentication";
import { res } from "@/lib/helper";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized");
    }

    await connectDB();

    // Find all media records (both with and without filename)
    const allMedia = await MediaModel.find({});

    console.log(`Found ${allMedia.length} total media records`);

    // Update them by extracting from public_id if filename is missing
    let updatedCount = 0;
    for (const media of allMedia) {
      // If filename already exists and is not empty, skip
      if (media.filename && media.filename.trim() !== '') {
        continue;
      }

      // Extract filename from public_id
      // public_id format: "folder/filename" or just "filename"
      const parts = media.public_id.split('/');
      const filenameWithoutExt = parts[parts.length - 1];
      
      // Also handle URL encoded characters
      const decodedFilename = decodeURIComponent(filenameWithoutExt);
      
      if (decodedFilename && decodedFilename.trim() !== '') {
        await MediaModel.updateOne(
          { _id: media._id },
          { $set: { filename: decodedFilename } }
        );
        updatedCount++;
        console.log(`Updated ${media._id}: ${decodedFilename}`);
      }
    }

    // Return summary
    const summary = {
      success: true,
      message: `Migration complete. Updated ${updatedCount} media records with filename from public_id`,
      updated: updatedCount,
      total: allMedia.length,
    };

    return Response.json(summary);
  } catch (error) {
    console.error('Migration error:', error);
    return Response.json({
      success: false,
      message: error.message,
      error: error.toString(),
    }, { status: 500 });
  }
}
