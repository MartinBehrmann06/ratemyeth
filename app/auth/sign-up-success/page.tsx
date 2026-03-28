import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Thank you for signing up!
            </CardTitle>
            <CardDescription>Check your email to confirm</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              You&apos;ve successfully signed up. Please check your email to
              confirm your account before signing in.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/login">Go to login</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="relative">
          <div className="absolute inset-x-0 -top-3 flex justify-center">
            <span className="bg-background px-2 text-xs text-muted-foreground">
              After you confirm your email
            </span>
          </div>
          <LoginForm className="pt-2" />
        </div>
      </div>
    </div>
  );
}
