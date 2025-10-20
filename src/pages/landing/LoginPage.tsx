import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { LogIn, User, Key, Loader2, ArrowLeft } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { settings } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Check if Shiva theme is active
  const isShivaTheme = settings?.appearance?.colorScheme === 'shiva';

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await login(values.email, values.password);
      
      // Check if there was an error in the result
      if (result && result.error) {
        // Show more specific error messages
        if (result.error.message) {
          setError(result.error.message);
        } else if (typeof result.error === 'string') {
          setError(result.error);
        } else {
          setError("Invalid email or password. Please try again.");
        }
        return;
      }
      
      navigate("/dashboard");
    } catch (err: any) {
      console.error('Login error:', err);
      // Show more specific error message if available
      if (err && err.message) {
        setError(err.message);
      } else if (err && typeof err === 'string') {
        setError(err);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isShivaTheme ? '' : 'cosmic-nebula-bg'}`}>
      {/* Fixed Back Button - Top Left Corner */}
      <div className="fixed top-4 left-4 z-50">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/landingpage')}
          className="flex items-center text-muted-foreground hover:text-foreground bg-background/80 backdrop-blur-sm border border-purple-500/20"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Homepage
        </Button>
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <img 
              src="/lovable-uploads/sadhanaboard_logo.png" 
              alt="Saadhana Board Logo" 
              className="h-20 w-20 rounded-full relative z-10" 
              style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))'
              }}
            />
            {/* Constant glowing ring around logo */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, rgba(255, 215, 0, 0.3), rgba(138, 43, 226, 0.3), rgba(255, 215, 0, 0.3))',
                padding: '2px'
              }}
            >
              <div className="w-full h-full rounded-full bg-background/20" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">Saadhana Board</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Access your spiritual journey
          </p>
        </div>

        <div className="bg-background/80 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <LogIn className="h-5 w-5 text-purple-500" />
            Welcome Back
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-destructive/20 text-destructive text-sm rounded-md">
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Enter your email" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="password" placeholder="Enter your password" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="text-purple-500 hover:text-purple-700 hover:underline">
                Join waitlist
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>Create an account to begin your spiritual journey</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;