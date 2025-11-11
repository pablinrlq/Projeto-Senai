import { NextResponse } from 'next/server';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

export async function GET() {
  try {
    // Test connection by trying to read from users collection
    const usersCollection = collection(db, 'usuarios');
    const usersQuery = query(usersCollection, limit(1));

    const snapshot = await getDocs(usersQuery);
    const userCount = snapshot.size;

    // Test atestados collection
    const atestadosCollection = collection(db, 'atestados');
    const atestadosQuery = query(atestadosCollection, limit(1));

    const atestadosSnapshot = await getDocs(atestadosQuery);
    const atestadosCount = atestadosSnapshot.size;

    return NextResponse.json({
      success: true,
      message: 'Firebase connection successful',
      data: {
        timestamp: new Date().toISOString(),
        collections: {
          usuarios: userCount,
          atestados: atestadosCount
        }
      }
    });
  } catch (error: unknown) {
    console.error('Firebase connection test failed:', error);

    return NextResponse.json({
      success: false,
      message: 'Firebase connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
