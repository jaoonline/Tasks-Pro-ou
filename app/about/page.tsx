import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Lightbulb, Heart } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto max-w-6xl px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            About TaskFlow
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Empowering Teams to Achieve More</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Founded in 2020, TaskFlow has been at the forefront of task management innovation, helping over 50,000 teams
            worldwide streamline their workflows and boost productivity.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-2">
            <CardHeader>
              <Target className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">Our Mission</CardTitle>
              <CardDescription className="text-base">
                To democratize productivity by providing intuitive, powerful task management tools that help teams of
                all sizes achieve their goals efficiently and effectively.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <Lightbulb className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">Our Vision</CardTitle>
              <CardDescription className="text-base">
                To become the world's most trusted task management platform, enabling seamless collaboration and driving
                innovation in workplace productivity.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-10 w-10 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg">Collaboration</CardTitle>
                <CardDescription>We believe great things happen when teams work together seamlessly.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Heart className="h-10 w-10 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg">User-Centric</CardTitle>
                <CardDescription>
                  Every feature we build is designed with our users' needs at the center.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Target className="h-10 w-10 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg">Excellence</CardTitle>
                <CardDescription>
                  We strive for excellence in everything we do, from code to customer service.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Lightbulb className="h-10 w-10 text-primary mx-auto mb-3" />
                <CardTitle className="text-lg">Innovation</CardTitle>
                <CardDescription>We continuously innovate to stay ahead of evolving workplace needs.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4"></div>
                <CardTitle>Sarah Johnson</CardTitle>
                <CardDescription>CEO & Co-Founder</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Former VP of Product at TechCorp with 15+ years of experience in building scalable productivity
                  solutions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-secondary to-primary rounded-full mx-auto mb-4"></div>
                <CardTitle>Michael Chen</CardTitle>
                <CardDescription>CTO & Co-Founder</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Software architect with expertise in distributed systems and a passion for creating elegant,
                  user-friendly interfaces.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/70 to-secondary/70 rounded-full mx-auto mb-4"></div>
                <CardTitle>Emily Rodriguez</CardTitle>
                <CardDescription>Head of Design</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Award-winning UX designer focused on creating intuitive experiences that make complex workflows simple
                  and enjoyable.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-muted rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">TaskFlow by the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Active Teams</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">2M+</div>
              <div className="text-muted-foreground">Tasks Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">150+</div>
              <div className="text-muted-foreground">Countries</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
