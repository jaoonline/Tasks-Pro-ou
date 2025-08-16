import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Users, BarChart3, Shield, ArrowRight, Star } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Orbs */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-secondary/30 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-accent/20 rounded-full blur-2xl animate-ping"></div>

          {/* Gradient Waves */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 animate-gradient-x"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-accent/10 via-transparent to-primary/5 animate-gradient-y"></div>

          {/* Floating Particles */}
          <div className="absolute top-10 left-10 w-2 h-2 bg-primary/40 rounded-full animate-float"></div>
          <div className="absolute top-20 right-20 w-3 h-3 bg-secondary/40 rounded-full animate-float-delayed"></div>
          <div className="absolute bottom-20 left-20 w-2 h-2 bg-accent/40 rounded-full animate-float-slow"></div>
          <div className="absolute bottom-10 right-10 w-1 h-1 bg-primary/60 rounded-full animate-float"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Streamline Your Workflow with <span className="text-primary">TaskFlow</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              The ultimate task management platform that helps teams collaborate, organize, and achieve their goals
              efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/login">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                <Link href="/features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose TaskFlow?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to boost your productivity and streamline your workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Smart Task Organization</CardTitle>
                <CardDescription>
                  Organize tasks with projects, labels, and priorities. Never lose track of what needs to be done.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Work together seamlessly with real-time updates, comments, and file sharing capabilities.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Track progress with detailed reports and insights to optimize your team's performance.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>
                  Bank-level security with encryption, SSO, and compliance features to protect your data.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Star className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Custom Workflows</CardTitle>
                <CardDescription>
                  Create custom workflows and automation rules that match your team's unique processes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <ArrowRight className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Seamless Integration</CardTitle>
                <CardDescription>
                  Connect with your favorite tools and services for a unified workflow experience.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Productivity?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of teams already using TaskFlow to achieve their goals.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link href="/login">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
