import { connectDB } from "@/lib/dbConnection";
import MediaModel from "@/Models/Media.model";
import { isAuthenticated } from "@/lib/authentication";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    // Get sample of media files
    const sampleMedia = await MediaModel.find({})
      .select("_id public_id filename title alt createdAt")
      .limit(50)
      .sort({ createdAt: -1 })
      .lean();

    // Check what would be extracted
    const analysis = sampleMedia.map(media => {
      const parts = media.public_id.split('/');
      const extractedFilename = decodeURIComponent(parts[parts.length - 1]);
      
      return {
        id: media._id,
        current_filename: media.filename || 'NOT SET',
        public_id: media.public_id,
        would_extract: extractedFilename,
        title: media.title || 'N/A',
        alt: media.alt || 'N/A',
      };
    });

    return Response.json({
      success: true,
      total_records: await MediaModel.countDocuments({}),
      sample_size: sampleMedia.length,
      analysis: analysis,
      instruction: "Run POST /api/media/migrate-filename to apply these changes",
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return Response.json({
      success: false,
      message: error.message,
    }, { status: 500 });
  }
}
