import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {

  const secret = request.headers.get('x-revalidation-secret');
  if (secret !== process.env.REVALIDATION_SECRET_TOKEN) {
    return NextResponse.json({ message: 'Invalid revalidation secret' }, { status: 401 });
  }

  // 2. Get the path to revalidate from the request body
  //    Your Spring backend should send the slug of the updated article.
  let body;
  try {
    body = await request.json();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error:unknown) {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }
  const articleSlug = body.articleSlug;
  const username = body.username;

  if (!articleSlug || typeof articleSlug !== 'string') {
    return NextResponse.json({ message: 'Missing or invalid articleSlug' }, { status: 400 });
  }

  if (!username || typeof username !== 'string') {
    return NextResponse.json({ message: 'Missing or invalid username' }, { status: 400 });
  }


  try {
    const pathToRevalidate = `/${username}/${articleSlug}`; 

    console.log(`Attempting to revalidate path: ${pathToRevalidate}`);
    revalidatePath(pathToRevalidate);
    console.log(`Successfully revalidated path: ${pathToRevalidate}`);

    return NextResponse.json({ revalidated: true, path: pathToRevalidate, now: Date.now() });
  } catch (err: unknown) {
    console.error(`Error revalidating path for slug ${articleSlug}:`, err);
    // If there was an error, Next.js will continue to show the last successfully generated page.
    return NextResponse.json({ message: 'Error revalidating'}, { status: 500 });
  }
}
