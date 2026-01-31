"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAtom } from "jotai"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Github } from "lucide-react"
import { loginSchema, registerSchema, type LoginFormData, type RegisterFormData } from "@/lib/validations/auth"
import { userAtom, authLoadingAtom } from "@/lib/atoms"
import { useToast } from "@/hooks/use-toast"
import { signIn, SignInOptions } from "next-auth/react"
import { log } from 'console';
import { tr } from "date-fns/locale"

// Google Icon Component
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

interface SignInResponse {
  error?: string;
  status?: number;
  ok?: boolean;
  url?: string | null;
}

export default function LoginPage() {
    const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useAtom(userAtom)
  const [authLoading, setAuthLoading] = useAtom(authLoadingAtom)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [githubLoading, setGithubLoading] = useState(false)

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Register form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const handleLogin = async (data: LoginFormData) => {
    setAuthLoading(true)
    try {
      // Simulate API call
      const UserDatas = {
        email: data.email,
        password: data.password,
        redirect: false as const,
      }
      console.log("UserDatas:", UserDatas);

      const result = await signIn("credentials", UserDatas);
      console.log("SignIn Result:", result);
       if (result?.error) {
          // Handle login error (e.g., display error message to user)
          console.error("Login failed:", result.error);
          toast({
            title: "Login failed",
            description: result.error,
            variant: "destructive",
          })
          // You might set a state variable to show an error message
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          })
          console.log("Login successful:", result);
          // Login successful, now manually redirect
          console.log("Login successful, redirecting to dashboard...");
          router.push("/dashboard"); // <-- Explicitly push to the dashboard
        
        } 
    } catch (error) {
      console.log(error);
      
      toast({
        title: "Error",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAuthLoading(false)
    }
  }

  const handleRegister = async (data: RegisterFormData) => {
    setAuthLoading(true)
    try {
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1500))
      // Mock successful registration
        const response = await fetch('/api/auth/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                fullname: data.name,
                email: data.email,
                password: data.password,
              }),
            }); 
            const user = await response.json();
            if (response.ok && user.statusCode === '00') {
              // Return the user object if authentication was successful
              console.log("Authenticated user:", user);
              
              toast({
                title: user.status,
                description: user.message || "Registration failed. Please try again.",
              })
              return user;
            } else {
              // Return null if user data could not be retrieved 
              toast({
                title: user.status,
                description: user.message || "Registration failed. Please try again.",
              })
              console.error('Authentication failed:', user?.message);
              return null;
            }

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAuthLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setGoogleLoading(true)
    try {
      // Simulate OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockUser = {
        id: "google-1",
        name: "Google User",
        email: "user@gmail.com",
        role: "User",
      }

      setUser(mockUser)
      toast({
        title: "Welcome!",
        description: "Successfully signed in with Google.",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Google authentication failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleGithubAuth = async () => {
    setGithubLoading(true)
    try {
      // Simulate OAuth flow
      const resp = await signIn("github", {
        callbackUrl: "/dashboard",
      });
      console.log("GitHub SignIn Response:", resp);
      
      // await new Promise((resolve) => setTimeout(resolve, 2000))

      // const mockUser = {
      //   id: "github-1",
      //   name: "GitHub User",
      //   email: "user@github.com",
      //   role: "User",
      // }
      
      // setUser(mockUser)
      // toast({
      //   title: "Welcome!",
      //   description: "Successfully signed in with GitHub.",
      // })
      // router.push("/dashboard")
    } catch (error) {
      console.log(error);
      
      toast({
        title: "Error",
        description: "GitHub authentication failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGithubLoading(false)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome to TaskFlow</CardTitle>
          <CardDescription className="text-center">Sign in to your account or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    {...loginForm.register("email")}
                    disabled={authLoading}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...loginForm.register("password")}
                      disabled={authLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={authLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={authLoading}>
                  {authLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={handleGoogleAuth}
                  disabled={googleLoading || authLoading}
                  className="w-full bg-transparent"
                >
                  {googleLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                  ) : (
                    <GoogleIcon />
                  )}
                  <span className="ml-2">Google</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGithubAuth}
                  disabled={githubLoading || authLoading}
                  className="w-full bg-transparent"
                >
                  {githubLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                  ) : (
                    <Github className="h-4 w-4" />
                  )}
                  <span className="ml-2">GitHub</span>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    {...registerForm.register("name")}
                    disabled={authLoading}
                  />
                  {registerForm.formState.errors.name && (
                    <p className="text-sm text-red-500">{registerForm.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    {...registerForm.register("email")}
                    disabled={authLoading}
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      {...registerForm.register("password")}
                      disabled={authLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={authLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      {...registerForm.register("confirmPassword")}
                      disabled={authLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={authLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">{registerForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={authLoading}>
                  {authLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={handleGoogleAuth}
                  disabled={googleLoading || authLoading}
                  className="w-full bg-transparent"
                >
                  {googleLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                  ) : (
                    <GoogleIcon />
                  )}
                  <span className="ml-2">Google</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGithubAuth}
                  disabled={githubLoading || authLoading}
                  className="w-full bg-transparent"
                >
                  {githubLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                  ) : (
                    <Github className="h-4 w-4" />
                  )}
                  <span className="ml-2">GitHub</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
