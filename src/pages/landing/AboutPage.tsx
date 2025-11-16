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
        <div className="text-center py-12 backdrop-blur-sm bg-amber-900/20 rounded-lg border border-amber-500/30">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 mb-4">
            About SadhanaBoard
          </h1>
          <p className="text-xl text-amber-100 max-w-3xl mx-auto mb-8">
            A sacred space for spiritual practitioners to track their journey, connect with the divine, 
            and grow in their practice
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-500" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-100 mb-4">
                SadhanaBoard was created with a sacred purpose: to support spiritual practitioners 
                in their journey toward self-realization and divine connection.
              </p>
              <p className="text-amber-100 mb-4">
                We understand that consistent practice (sadhana) is the cornerstone of spiritual growth. 
                Our platform provides the tools and community needed to maintain and deepen your practice.
              </p>
              <p className="text-amber-100">
                Through divine themes, progress tracking, and community support, we aim to make your 
                spiritual journey both meaningful and joyful.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-amber-500" />
                Our Values
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-amber-900/20 border border-amber-500/20">
                    <div className="p-2 rounded-full bg-amber-500/20">
                      <IconComponent className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-amber-100">{value.title}</h3>
                      <p className="text-sm text-amber-200">{value.description}</p>
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
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-amber-500" />
              </div>
              <CardTitle className="text-amber-100">Sadhana Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-200">
                Comprehensive tools to track your daily spiritual practices and monitor your progress
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-amber-400" />
              </div>
              <CardTitle className="text-amber-100">Divine Themes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-200">
                Transform your experience with powerful divine themes inspired by Hindu deities
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-amber-400" />
              </div>
              <CardTitle className="text-amber-100">Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-200">
                Connect with fellow practitioners and share your spiritual journey with like-minded souls
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="backdrop-blur-sm bg-amber-900/20 p-8 rounded-lg border border-amber-500/30 text-center">
          <h2 className="text-2xl font-bold mb-4 text-amber-100">Join Our Spiritual Community</h2>
          <p className="text-amber-200 mb-6 max-w-2xl mx-auto">
            Begin your journey with SadhanaBoard today and experience the transformative power of 
            consistent spiritual practice
          </p>
          <Button size="lg" onClick={() => navigate("/signup")} className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600">
            Start Your Sadhana Journey
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;