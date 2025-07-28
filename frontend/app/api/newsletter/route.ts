// /frontend/app/api/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const submittedEmail = body?.email || body?.email_address || body?.payload?.email_address;
    const consent = body?.consent;

    if (!submittedEmail || !submittedEmail.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json({ error: 'Consent is required to subscribe' }, { status: 400 });
    }

    const apiKey = process.env.BUTTONDOWN_API_KEY;
    if (!apiKey) {
      console.error('BUTTONDOWN_API_KEY is not set');
      return NextResponse.json({ error: 'Newsletter service is not configured correctly' }, { status: 500 });
    }

    console.log(`Subscribing email: ${submittedEmail} to Buttondown with consent: ${consent}`);

    const response = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email_address: submittedEmail }) // ✅ FIXED HERE
    });

    const responseData = await response.text();
    console.log(`Buttondown response status: ${response.status}`);
    console.log(`Buttondown response: ${responseData}`);

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = JSON.parse(responseData);
        errorMessage = errorData.detail || errorData.error || 'Subscription failed';
      } catch {
        errorMessage = responseData || 'Subscription failed';
      }
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
