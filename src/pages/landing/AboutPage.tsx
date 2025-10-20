import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Target, 
  Calendar, 
  Users, 
  Star,
  Flame,
  TrendingUp,
  ChevronRight,
  Heart,
  Mountain,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

  const values = [
    {
      title: "Spiritual Growth",
      description: "We believe in fostering genuine spiritual development through consistent practice",
      icon: Mountain,
    },
    {
      title: "Community Connection",
      description: "Building bridges between practitioners to share wisdom and support",
      icon: Users,
    },
    {
      title: "Divine Inspiration",
      description: "Drawing strength and guidance from the divine energies that surround us",
      icon: Sparkles,
    },
    {
      title: "Authentic Practice",
      description: "Encouraging sincere and dedicated spiritual practices rooted in tradition",
      icon: Heart,
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12 backdrop-blur-sm bg-background/70 rounded-lg border border-purple-500/20">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600 mb-4">
            About SadhanaBoard
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            A sacred space for spiritual practitioners to track their journey, connect with the divine, 
            and grow in their practice
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                SadhanaBoard was created with a sacred purpose: to support spiritual practitioners 
                in their journey toward self-realization and divine connection.
              </p>
              <p className="text-muted-foreground mb-4">
                We understand that consistent practice (sadhana) is the cornerstone of spiritual growth. 
                Our platform provides the tools and community needed to maintain and deepen your practice.
              </p>
              <p className="text-muted-foreground">
                Through divine themes, progress tracking, and community support, we aim to make your 
                spiritual journey both meaningful and joyful.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-purple-500" />
                Our Values
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-full bg-purple-500/20">
                      <IconComponent className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-purple-500" />
              </div>
              <CardTitle>Sadhana Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Comprehensive tools to track your daily spiritual practices and monitor your progress
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 rounded-full bg-fuchsia-500/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-fuchsia-500" />
              </div>
              <CardTitle>Divine Themes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Transform your experience with powerful divine themes inspired by Hindu deities
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-500" />
              </div>
              <CardTitle>Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Connect with fellow practitioners and share your spiritual journey with like-minded souls
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="backdrop-blur-sm bg-background/70 p-8 rounded-lg border border-purple-500/20 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Spiritual Community</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Begin your journey with SadhanaBoard today and experience the transformative power of 
            consistent spiritual practice
          </p>
          <Button size="lg" onClick={() => navigate("/signup")} className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600">
            Start Your Sadhana Journey
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;