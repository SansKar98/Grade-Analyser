import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, DEMO_USERS } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { GraduationCap, Key, User, Shield, Eye, Copy, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Login() {
  const [demoId, setDemoId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!demoId.trim()) {
      toast.error('Please enter a Demo ID');
      return;
    }

    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const success = login(demoId);
    
    if (success) {
      toast.success('Login successful! Welcome to the dashboard.');
      navigate('/', { replace: true });
    } else {
      toast.error('Invalid Demo ID. Please use one of the demo credentials below.');
    }
    
    setIsLoading(false);
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Demo ID copied to clipboard!');
  };

  const quickLogin = (id: string) => {
    setDemoId(id);
  };

  const roleIcons = {
    Administrator: Shield,
    Teacher: GraduationCap,
    Viewer: Eye,
  };

  const roleColors = {
    Administrator: 'bg-primary text-primary-foreground',
    Teacher: 'bg-accent text-accent-foreground',
    Viewer: 'bg-secondary text-secondary-foreground',
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Login Form */}
        <div className="order-2 lg:order-1">
          <Card className="border-2 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary">
                <GraduationCap className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold">Student Marks Analyzer</CardTitle>
              <CardDescription>
                Enter your Demo ID to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="demoId">Demo ID</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="demoId"
                      value={demoId}
                      onChange={(e) => setDemoId(e.target.value.toUpperCase())}
                      placeholder="Enter Demo ID (e.g., DEMO-ADMIN-001)"
                      className="pl-10 font-mono uppercase"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Demo Credentials */}
        <div className="order-1 lg:order-2 space-y-6">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-foreground">Demo Access</h1>
            <p className="text-muted-foreground mt-2">
              Use any of the following demo credentials to explore the system
            </p>
          </div>

          <div className="space-y-3">
            {DEMO_USERS.map((user) => {
              const Icon = roleIcons[user.role as keyof typeof roleIcons] || User;
              const colorClass = roleColors[user.role as keyof typeof roleColors] || roleColors.Viewer;
              
              return (
                <Card 
                  key={user.id} 
                  className="hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => quickLogin(user.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', colorClass)}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{user.name}</p>
                          <span className={cn(
                            'text-xs px-2 py-0.5 rounded-full',
                            colorClass
                          )}>
                            {user.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-sm font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                            {user.id}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(user.id);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          quickLogin(user.id);
                        }}
                      >
                        Use
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground text-center lg:text-left">
            Click on any credential card to auto-fill, or copy the ID manually
          </p>
        </div>
      </div>
    </div>
  );
}
