import dbConnect from '@/lib/db';
import Child from '@/models/Child';
import { NextResponse } from 'next/server';

// 1. FIX: In Next.js 15+, params is a Promise!
interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    await dbConnect();
    const { id: childId } = await context.params;

    if (!childId) {
      return NextResponse.json({ error: 'Child ID is required' }, { status: 400 });
    }

    const child = await Child.findById(childId).select('profileImageUrl gallery createdAt updatedAt');

    if (!child) {
      return NextResponse.json({ error: 'Child record not found' }, { status: 404 });
    }

    const images = [];

    if (child.profileImageUrl) {
      images.push({
        id: `profile-${child._id}`,
        name: 'Profile Picture',
        type: 'PROFILE',
        uploadedDate: child.createdAt,
        url: child.profileImageUrl,
      });
    }

    if (child.gallery && child.gallery.length > 0) {
      child.gallery.forEach((url: string, index: number) => {
        images.push({
          id: `gallery-${child._id}-${index}`,
          name: `Gallery Photo ${index + 1}`,
          type: 'GALLERY',
          uploadedDate: child.updatedAt,
          url: url,
        });
      });
    }

    return NextResponse.json(images, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching child images from DB:', error);
    if (error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid Child ID format' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    await dbConnect();

    // 2. FIX: Await the params object first!
    const { id: childId } = await context.params;

    const body = await request.json();
    const { url } = body;

    if (!childId || !url) {
      return NextResponse.json({ error: 'Child ID and Image URL are required' }, { status: 400 });
    }

    // 3. FIX: Your schema uses 'gallery', not 'images'
    const updatedChild = await Child.findByIdAndUpdate(
      childId,
      { $pull: { gallery: url } },
      { new: true }
    );

    if (!updatedChild) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Image removed from gallery' }, { status: 200 });

  } catch (error: any) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}