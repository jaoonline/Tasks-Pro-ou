// app/api/login/route.ts
import axios from 'axios';
import { log } from 'console';
import { NextResponse } from 'next/server';

// Define an interface for the expected request body
interface LoginRequestBody {
  email: string;
  password: string;
}

// Define an interface for the response body
export interface LoginResponse {
  statusCode: string;
  status: string;
  message: string;
  data: {
    user: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      phone_number: string;
      avatar: string | null;
      role_name: string | null;
      role_id: string;
      login_notification_status: number;
      sms_notification_status: number;
      email_notification_status: number;
      otp_status: number;
    };
    accessToken: string;
  };
  otp_enabled: boolean;
}


// This function handles POST requests to /api/login
export async function POST(request: Request) {
  let body: LoginRequestBody;

  try {
    // Attempt to parse the request body as JSON
    body = await request.json();
    const { email, password } = body;

    // 1. Basic Server-Side Validation (Crucial!)
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required', success: false },
        { status: 400 }
      );
    }
    const base_url =`${process?.env.SERVER_URL}/auth/login`;
    const loginResponse = await axios.post(base_url, {
      email: email,
      password: password
    });
    
    const loginData: LoginResponse = loginResponse?.data;
    // For this example, we'll simulate a simple authentication check.
    // In a real application, NEVER hardcode credentials or store passwords in plain text.
    if (email === loginData?.data?.user?.email && loginData?.statusCode === '00') {
      // Simulate a successful login
      return NextResponse.json(loginData.data,
        { status: 200 }
      );
    } else {
      // Simulate a failed login
      return NextResponse.json(
        { message: 'Invalid credentials', success: false },
        { status: 401 } // 401 Unauthorized
      );
    }
  } catch (error) {
    // If JSON parsing fails, return a 400 Bad Request
    return NextResponse.json(
      { message: 'Invalid JSON body', success: false },
      { status: 400 }
    );
  }

  // 2. Perform your authentication logic here
  // This is where you would typically:
  // - Query your database for a user with the given email
  // - Hash the provided password and compare it to the stored hash
  // - If using next-auth, you might call signIn() here directly if this was a Server Action
  //   but since this is a direct API route, you'd handle authentication manually or
  //   forward to an external auth service.


}

// You can also define other HTTP methods in the same file if needed
// export async function GET(request: Request) { ... }