'use client';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FlexoraaTraderOSLogo } from "@/components/icons"
import Link from 'next/link'
import { cn } from "@/lib/utils"
import { useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { useEffect } from "react";

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };
  
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen flex items-center justify-center animated-background", "p-4")}>
      <Card className="mx-auto max-w-sm w-full bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
                <FlexoraaTraderOSLogo className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl text-gradient">Flexoraa TraderOS</CardTitle>
            </div>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button useAnimation className="w-full">
                Login
            </Button>
            <Button variant="secondary" className="w-full" onClick={handleGoogleSignIn}>
                Login with Google
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard">Go to Dashboard (Dev)</Link>
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
