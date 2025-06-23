import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Shield, Zap } from 'lucide-react';
import { usePaymentStore } from '../../store/paymentStore';
import { useAuthStore } from '../../store/authStore';
import { PricingPlan } from '../../types';
import PricingCard from './PricingCard';
import Button from '../ui/Button';
import Toast from '../ui/Toast';

interface PricingPageProps {
  onBack: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onBack }) => {
  const { plans, isLoading, fetchPlans, createCheckoutSession, createPortalSession } = usePaymentStore();
  const { user } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const handleSelectPlan = async (plan: PricingPlan) => {
    if (plan.price === 0) {
      showToast('Free plan is already active!', 'info');
      return;
    }

    if (!plan.stripePriceId) {
      showToast('This plan is not available yet. Please try again later.', 'error');
      return;
    }

    setSelectedPlan(plan.id);

    try {
      // In a real implementation, you would:
      // 1. Call your backend to create a Stripe checkout session
      // 2. Redirect to Stripe Checkout
      // 3. Handle the success/cancel callbacks
      
      showToast('Redirecting to Stripe Checkout...', 'info');
      
      // Mock implementation - replace with actual Stripe integration
      setTimeout(() => {
        showToast('Payment integration coming soon! This is a demo.', 'warning');
        setSelectedPlan(null);
      }, 2000);

    } catch (error) {
      showToast('Failed to start checkout process. Please try again.', 'error');
      setSelectedPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      showToast('Opening billing portal...', 'info');
      
      // Mock implementation - replace with actual Stripe portal
      setTimeout(() => {
        showToast('Billing portal coming soon! This is a demo.', 'warning');
      }, 1000);

    } catch (error) {
      showToast('Failed to open billing portal. Please try again.', 'error');
    }
  };

  const getCurrentPlan = () => {
    return user?.subscription?.plan || 'free';
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>

          {user?.subscription && user.subscription.plan !== 'free' && (
            <Button
              variant="outline"
              onClick={handleManageSubscription}
              className="flex items-center space-x-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Manage Billing</span>
            </Button>
          )}
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Unlock the full potential of VinStackCode with our flexible pricing plans.
            Start free and upgrade as you grow.
          </p>

          {/* Features Highlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="flex items-center space-x-3 text-gray-300">
              <Shield className="w-6 h-6 text-green-500" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <Zap className="w-6 h-6 text-yellow-500" />
              <span>Real-time Collaboration</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <CreditCard className="w-6 h-6 text-blue-500" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <PricingCard
                plan={plan}
                isCurrentPlan={getCurrentPlan() === plan.id}
                onSelectPlan={handleSelectPlan}
                isLoading={selectedPlan === plan.id}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-400">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                What happens to my data if I cancel?
              </h3>
              <p className="text-gray-400">
                Your data remains safe. You'll be moved to the free plan with access to your public snippets.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-400">
                We offer a 30-day money-back guarantee for all paid plans. No questions asked.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Is my payment information secure?
              </h3>
              <p className="text-gray-400">
                Absolutely. We use Stripe for payment processing, which is PCI DSS compliant and bank-level secure.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default PricingPage;