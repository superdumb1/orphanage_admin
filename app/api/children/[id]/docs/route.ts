import dbConnect from '@/lib/db';
import Child from '@/models/Child';
import { NextResponse } from 'next/server';
interface RouteContext {
  params: Promise<{ id: string }>;
}

// 📥 GET: Fetch all documents for this child
export async function GET(request: Request, context: RouteContext) {
  try {
    await dbConnect();
    const { id: childId } = await context.params;

    if (!childId) return NextResponse.json({ error: 'Child ID required' }, { status: 400 });

    const child = await Child.findById(childId).select('documents updatedAt');

    if (!child) return NextResponse.json({ error: 'Child not found' }, { status: 404 });

    const documents:any = [];

    // Map through the documents string array and format for the UI
    if (child.documents && child.documents.length > 0) {
      child.documents.forEach((url: string, index: number) => {
        
        // Attempt to extract a readable filename from the URL, otherwise fallback to generic name
        const urlParts = url.split('/');
        const possibleFilename = urlParts[urlParts.length - 1]?.split('?')[0]; 
        const name = possibleFilename && possibleFilename.length > 3 ? possibleFilename : `Document ${index + 1}`;

        documents.push({
          id: `doc-${child._id}-${index}`,
          name: decodeURIComponent(name), // Clean up URL encoding like %20
          type: 'SECURE_DOC',
          uploadedDate: child.updatedAt, 
          url: url,
        });
      });
    }

    return NextResponse.json(documents, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 🗑️ DELETE: Remove a specific document URL from the array
export async function DELETE(request: Request, context: RouteContext) {
  try {
    await dbConnect();
    const { id: childId } = await context.params;
    
    // Parse the URL to delete from the request body
    const body = await request.json();
    const { url } = body;

    if (!childId || !url) {
      return NextResponse.json({ error: 'Child ID and Document URL are required' }, { status: 400 });
    }

    // Use MongoDB $pull to remove the exact string match from the documents array
    const updatedChild = await Child.findByIdAndUpdate(
      childId,
      { $pull: { documents: url } },
      { new: true } // Returns the document AFTER the pull operation
    );

    if (!updatedChild) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Document removed from vault' }, { status: 200 });

  } catch (error: any) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}