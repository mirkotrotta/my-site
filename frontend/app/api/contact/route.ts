import { NextRequest, NextResponse } from 'next/server';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactFormData = await req.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get Formspree endpoint from environment
    const formspreeEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
    
    if (!formspreeEndpoint) {
      console.error('NEXT_PUBLIC_FORMSPREE_ENDPOINT is not configured');
      return NextResponse.json(
        { error: 'Contact service is not configured' },
        { status: 500 }
      );
    }

    // Prepare data for Formspree
    const formspreeData = {
      name,
      email,
      subject,
      message,
      _replyto: email, // Formspree will use this as reply-to address
    };

    console.log('Submitting to Formspree:', {
      endpoint: formspreeEndpoint,
      submittedBy: email,
      subject,
      timestamp: new Date().toISOString()
    });

    // Submit to Formspree
    const formspreeResponse = await fetch(formspreeEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(formspreeData),
    });

    const responseData = await formspreeResponse.json();

    if (!formspreeResponse.ok) {
      console.error('Formspree error:', responseData);
      return NextResponse.json(
        { error: responseData.error || 'Failed to send message' },
        { status: formspreeResponse.status }
      );
    }

    console.log('Formspree success:', responseData);

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 