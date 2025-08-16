import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  Users,
  BarChart3,
  Shield,
  Calendar,
  MessageSquare,
  FileText,
  Zap,
  Globe,
  Smartphone,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto max-w-6xl px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Product Features
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Everything You Need to Manage Tasks Effectively</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover the comprehensive suite of features that make TaskFlow the ultimate task management solution for
            teams of all sizes.
          </p>
        </div>

        {/* Feature Categories */}
        <Tabs defaultValue="core" className="mb-16">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="core">Core Features</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="core" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CheckCircle className="h-10 w-10 text-primary mb-3" />
                  <CardTitle>Smart Task Management</CardTitle>
                  <CardDescription>
                    Create, organize, and prioritize tasks with advanced filtering, sorting, and categorization options.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Calendar className="h-10 w-10 text-primary mb-3" />
                  <CardTitle>Calendar Integration</CardTitle>
                  <CardDescription>
                    Seamlessly sync with your calendar and never miss a deadline with smart scheduling features.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <FileText className="h-10 w-10 text-primary mb-3" />
                  <CardTitle>Project Templates</CardTitle>
                  <CardDescription>
                    Get started quickly with pre-built templates for common project types and workflows.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="collaboration" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Users className="h-10 w-10 text-primary mb-3" />
                  <CardTitle>Team Workspaces</CardTitle>
                  <CardDescription>
                    Create dedicated workspaces for different teams with customizable permissions and access controls.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <MessageSquare className="h-10 w-10 text-primary mb-3" />
                  <CardTitle>Real-time Comments</CardTitle>
                  <CardDescription>
                    Collaborate seamlessly with threaded comments, mentions, and real-time notifications.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Shield className="h-10 w-10 text-primary mb-3" />
                  <CardTitle>Role-based Access</CardTitle>
                  <CardDescription>
                    Control who can view, edit, and manage tasks with granular permission settings.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-primary mb-3" />
                  <CardTitle>Performance Dashboards</CardTitle>
                  <CardDescription>
                    Track team productivity with comprehensive dashboards and customizable metrics.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Zap className="h-10 w-10 text-primary mb-3" />
                  <CardTitle>Time Tracking</CardTitle>
                  <CardDescription>
                    Monitor time spent on tasks and projects with built-in time tracking and reporting tools.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <FileText className="h-10 w-10 text-primary mb-3" />
                  <CardTitle>Custom Reports</CardTitle>
                  <CardDescription>
                    Generate detailed reports with custom filters and export options for stakeholders.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Globe className="h-10 w-10 text-primary mb-3" />
                  <CardTitle>API & Webhooks</CardTitle>
                  <CardDescription>
                    Connect with any tool using our robust API and webhook system for custom integrations.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Smartphone className="h-10 w-10 text-primary mb-3" />
                  <CardTitle>Mobile Apps</CardTitle>
                  <CardDescription>
                    Stay productive on the go with native mobile apps for iOS and Android devices.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Zap className="h-10 w-10 text-primary mb-3" />
                  <CardTitle>Popular Tools</CardTitle>
                  <CardDescription>
                    Integrate with Slack, Google Workspace, Microsoft 365, and 100+ other popular business tools.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Pricing Preview */}
        <div className="bg-muted rounded-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-muted-foreground">Start free and scale as your team grows</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Free</CardTitle>
                <div className="text-3xl font-bold">$0</div>
                <CardDescription>Perfect for individuals</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Up to 5 projects
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Basic task management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Mobile apps
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader className="text-center">
                <Badge className="mb-2">Most Popular</Badge>
                <CardTitle>Pro</CardTitle>
                <div className="text-3xl font-bold">$12</div>
                <CardDescription>per user/month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Unlimited projects
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Advanced features
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Team collaboration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Analytics & reports
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle>Enterprise</CardTitle>
                <div className="text-3xl font-bold">Custom</div>
                <CardDescription>For large organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Everything in Pro
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Advanced security
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Custom integrations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Dedicated support
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of teams already using TaskFlow to boost their productivity.
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/login">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
