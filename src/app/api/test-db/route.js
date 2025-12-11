import { testConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const isConnected = await testConnection();
  
  if (isConnected) {
    return NextResponse.json({
      status: 'success',
      message: 'База данных подключена',
      timestamp: new Date().toISOString()
    });
  } else {
    return NextResponse.json({
      status: 'error',
      message: 'Ошибка подключения к базе данных'
    }, { status: 500 });
  }
}