import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import loginBg from '@/assets/login-bg.jpg';

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  
  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(value)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError('Password is required');
      return false;
    }
    if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const isFormValid = email && password && !emailError && !passwordError && !isLocked;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast({
        title: "Account Locked",
        description: "Too many attempts. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) return;

    setIsLoading(true);

    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock authentication logic
    if (email === 'admin@crypto.com' && password === 'admin123456') {
      toast({
        title: "Authentication Successful",
        description: "Redirecting to dashboard...",
      });
      setTimeout(() => navigate('/'), 500);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        setIsLocked(true);
        toast({
          title: "Account Locked",
          description: "Too many failed attempts. Please contact system administrator.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Authentication Failed",
          description: `Invalid credentials. ${5 - newAttempts} attempts remaining.`,
          variant: "destructive",
        });
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Immersive Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden animate-fade-in">
        <img
          src={loginBg}
          alt="Blockchain Network"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-primary/10" />
        
        {/* Subtle animated glow effect */}
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-success/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Admin Console
            </h1>
            <p className="text-muted-foreground text-sm">
              Secure administrative access
            </p>
          </div>

          {/* Theme Toggle */}
          <div className="flex justify-center">
            <button
              onClick={toggleTheme}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (e.target.value) validateEmail(e.target.value);
                  }}
                  onBlur={() => validateEmail(email)}
                  placeholder="admin@company.com"
                  className={`h-12 bg-surface border-border/50 focus:border-primary transition-all duration-200 ${
                    emailError ? 'border-destructive focus:border-destructive' : ''
                  }`}
                  disabled={isLoading || isLocked}
                />
              </div>
              {emailError && (
                <p className="text-xs text-destructive animate-fade-in">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (e.target.value) validatePassword(e.target.value);
                  }}
                  onBlur={() => validatePassword(password)}
                  placeholder="••••••••"
                  className={`h-12 pr-12 bg-surface border-border/50 focus:border-primary transition-all duration-200 ${
                    passwordError ? 'border-destructive focus:border-destructive' : ''
                  }`}
                  disabled={isLoading || isLocked}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-xs text-destructive animate-fade-in">{passwordError}</p>
              )}
            </div>

            {/* Lock Warning */}
            {isLocked && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 animate-fade-in">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Account Locked</p>
                    <p className="text-xs text-destructive/80">Too many failed attempts. Contact administrator.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Authenticating...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Secondary Options */}
          <div className="flex flex-col items-center gap-3 pt-4">
            <button
              type="button"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </button>
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact system administrator
            </button>
          </div>

          {/* Security Footer */}
          <div className="pt-8 border-t border-border/30">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Protected by enterprise-grade security</span>
            </div>
          </div>

          {/* Demo Credentials (remove in production) */}
          <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
            <p className="text-xs text-muted-foreground text-center">
              Demo: admin@crypto.com / admin123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
