import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Missing token' },
        { status: 400 },
      );
    }

    if (!secretKey) {
      // If no secret key is configured (development without keys), we might want to fail or bypass.
      // For security, we should fail, but for this demo, if user hasn't set keys yet, we might want to warn.
      return NextResponse.json(
        {
          success: false,
          message: 'Server configuration error: Missing Secret Key',
        },
        { status: 500 },
      );
    }

    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
    );

    if (response.data.success && response.data.score >= 0.5) {
      return NextResponse.json({ success: true, score: response.data.score });
    } else {
      return NextResponse.json(
        { success: false, message: 'Bot detected', score: response.data.score },
        { status: 400 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Verification failed' },
      { status: 500 },
    );
  }
}
