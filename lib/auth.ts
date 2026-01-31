import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { signInSchema } from "./zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        console.error('Authentication error:', credentials);
        try {
    // Validate credentials with Zod
    const { email, password } = await signInSchema.parseAsync(credentials);
    
    // Call your API endpoint
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
 
    const data = await response.json();
    
    // Handle different response statuses
    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new Error(data.message || "Invalid request");
        case 401:
          throw new Error(data.message || "Invalid email or password");
        case 403:
          throw new Error(data.message || "Account disabled or not authorized");
        case 404:
          throw new Error("User not found");
        case 429:
          throw new Error("Too many attempts. Please try again later");
        case 500:
          throw new Error("Server error. Please try again later");
        default:
          throw new Error(data.message || "Authentication failed");
      }
    }
    
    // Check if user data is present
    if (!data.user) {
      throw new Error("No user data returned");
    }
    
    console.log("Authenticated user:", data);
    return data;
    
  } catch (error: any) {
    console.log('Authentication error:', error);
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      const messages = error.errors.map((err: any) => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      throw new Error(`Validation error: ${messages}`);
    }
    
    // Re-throw the error with proper message
    throw new Error(error.message || "Authentication failed");
  }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // This callback is called after authorize
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});