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

    const { success, score, 'error-codes': errorCodes } = response.data;

    // 1. Google API itself failed (e.g. Invalid Secret Key, Timeout)
    if (!success) {
      console.error('reCAPTCHA Validation Failed:', errorCodes);
      return NextResponse.json(
        {
          success: false,
          message: `reCAPTCHA 설정 오류: ${errorCodes ? errorCodes.join(', ') : 'Unknown'}`,
          errorCodes,
        },
        { status: 500 },
      ); // Configuration error is a Server Error
    }

    // 2. Score is too low (Bot detected)
    // Lower threshold to 0.1 for initial rollout as v3 needs to learn traffic
    if (score < 0.1) {
      console.warn(`Bot detected. Score: ${score}`);
      return NextResponse.json(
        {
          success: false,
          message: `봇으로 감지되었습니다 (Score: ${score})`,
          score,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, score });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Verification failed' },
      { status: 500 },
    );
  }
}
