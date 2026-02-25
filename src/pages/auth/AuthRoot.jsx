import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSmartphone } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function AuthRoot() {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <FiSmartphone className="text-white text-2xl" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-foreground">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-sm text-muted mt-2">
            {isLogin
              ? 'Sign in to access your account'
              : 'Join Mohsin Mobiles today'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl p-8">
          {/* Tabs */}
          <div className="flex bg-background rounded-xl p-1 mb-8">
            {['Login', 'Sign Up'].map((tab) => {
              const active = tab === 'Login' ? isLogin : !isLogin;
              return (
                <button
                  key={tab}
                  onClick={() => setIsLogin(tab === 'Login')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Forms */}
          {isLogin ? <LoginForm /> : <SignupForm />}
        </div>

        {/* Bottom link */}
        <p className="text-center text-sm text-muted mt-6">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-semibold hover:underline cursor-pointer"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}