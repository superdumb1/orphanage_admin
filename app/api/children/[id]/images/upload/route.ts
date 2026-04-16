import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Child from '@/models/Child';
import { uploadFile } from '@/lib/cloudinary';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  try {
    await dbConnect();
    const { id: childId } = await context.params;

    // 1. Parse Form Data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const targetField = formData.get('field') as 'gallery' | 'documents' | 'profileImageUrl';

    if (!file || !targetField) {
      return NextResponse.json({ error: 'Missing file or target field' }, { status: 400 });
    }

    // 2. Convert File to Buffer for Cloudinary stream
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Upload to Cloudinary (using your existing utility)
    const folder = targetField === 'documents' ? 'legal_docs' : 'child_gallery';
    const secureUrl = await uploadFile(buffer, folder);

    // 4. Update MongoDB
    let updateQuery = {};
    if (targetField === 'profileImageUrl') {
      updateQuery = { $set: { profileImageUrl: secureUrl } };
    } else {
      // Use $push for arrays (gallery/documents)
      updateQuery = { $push: { [targetField]: secureUrl } };
    }

    const updatedChild = await Child.findByIdAndUpdate(
      childId,
      updateQuery,
      { new: true }
    );

    if (!updatedChild) {
      return NextResponse.json({ error: 'Child record not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      url: secureUrl,
      message: `${targetField} updated successfully` 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Uplink Failed: ' + error.message }, { status: 500 });
  }
}