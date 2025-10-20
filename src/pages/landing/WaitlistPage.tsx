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
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, User, Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import apiService from "@/services/api.js";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  reason: z.string().optional(),
});

const WaitlistPage = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      reason: "",
    },
  });

  // Check if Shiva theme is active
  const isShivaTheme = settings?.appearance?.colorScheme === 'shiva';

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.post('/auth/waitlist', {
        name: values.name,
        email: values.email,
        reason: values.reason || null
      });
      
      setSuccess(true);
  // success handled via UI state/toast
    } catch (err: any) {
  // error shown to user via setError()
      setError(err.response?.data?.error || "Failed to join waiting list. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`min-h-screen flex flex-col ${isShivaTheme ? '' : 'cosmic-nebula-bg'}`}>
        {/* Fixed Back Button */}
        <div className="fixed top-4 left-4 z-50">
          <Button 
            onClick={() => navigate('/landingpage')}
            variant="ghost"
            className="flex items-center text-muted-foreground hover:text-foreground bg-background/80 backdrop-blur-sm border border-purple-500/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Homepage
          </Button>
        </div>

        {/* Success Content - Centered */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-lg animate-fade-in text-center">
            <div className="flex flex-col items-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-400 to-green-600">
                You're on the list!
              </h1>
              <p className="text-base text-muted-foreground mt-3 max-w-md">
                Thank you for your interest in SadhanaBoard. We'll be in touch soon with details about early access.
              </p>
            </div>
            
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/landingpage')}
                className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 max-w-sm mx-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Homepage
              </Button>
              
              <p className="text-sm text-muted-foreground">
                In the meantime, follow us on social media for updates and spiritual content.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Main Content - Centered without scrolling */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg animate-fade-in">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-3">
              <img 
                src="/lovable-uploads/sadhanaboard_logo.png" 
                alt="SadhanaBoard Logo" 
                className="h-16 w-16 rounded-full relative z-10" 
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
            <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
              Join the Waitlist
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Be among the first to experience spiritual transformation
            </p>
          </div>

          <div className="bg-background/80 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-purple-500" />
              Request Early Access
            </h2>

            <div className="mb-4 p-3 bg-purple-500/10 text-purple-300 text-xs rounded-md border border-purple-500/20">
              <p>
                🙏 SadhanaBoard is currently in private beta. Join our waitlist to get early access to the most comprehensive spiritual practice platform.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-destructive/20 text-destructive text-sm rounded-md">
                {error}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Enter your full name"
                            className="pl-10 h-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Enter your email address"
                            className="pl-10 h-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Why are you interested? (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your spiritual journey..."
                          className="resize-none text-sm"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 h-10"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Joining waitlist...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Join Waitlist
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>
                Already have access?{" "}
                <Link
                  to="/login"
                  className="text-purple-500 hover:text-purple-700 hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground/70 mt-4">
            <p>
              By joining the waitlist, you'll receive updates about our launch and early access opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistPage;