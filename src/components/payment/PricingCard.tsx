import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Users } from 'lucide-react';
import { PricingPlan } from '../../types';
import Button from '../ui/Button';

interface PricingCardProps {
  plan: PricingPlan;
  isCurrentPlan?: boolean;
  onSelectPlan: (plan: PricingPlan) => void;
  isLoading?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  isCurrentPlan = false,
  onSelectPlan,
  isLoading = false
}) => {
  const getPlanIcon = () => {
    switch (plan.id) {
      case 'pro':
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 'team':
        return <Users className="w-6 h-6 text-purple-500" />;
      default:
        return null;
    }
  };

  const formatPrice = () => {
    if (plan.price === 0) return 'Free';
    return `$${plan.price}/${plan.interval}`;
  };

  const formatSnippets = () => {
    if (plan.maxSnippets === -1) return 'Unlimited';
    return plan.maxSnippets.toString();
  };

  const formatCollaborators = () => {
    if (plan.maxCollaborators === -1) return 'Unlimited';
    if (plan.maxCollaborators === 0) return 'None';
    return plan.maxCollaborators.toString();
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`
        relative bg-gray-800 border rounded-xl p-6 h-full flex flex-col
        ${plan.isPopular 
          ? 'border-primary-500 ring-2 ring-primary-500 ring-opacity-50' 
          : 'border-gray-700'
        }
        ${isCurrentPlan ? 'ring-2 ring-green-500 ring-opacity-50' : ''}
      `}
    >
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Current Plan
          </span>
        </div>
      )}

      <div className="flex items-center space-x-3 mb-4">
        {getPlanIcon()}
        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-white">{formatPrice()}</span>
          {plan.price > 0 && (
            <span className="text-gray-400 ml-1">/{plan.interval}</span>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-6 flex-1">
        <div className="text-sm text-gray-300">
          <span className="font-medium">Snippets:</span> {formatSnippets()}
        </div>
        <div className="text-sm text-gray-300">
          <span className="font-medium">Collaborators:</span> {formatCollaborators()}
        </div>
        
        <div className="pt-2">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Features:</h4>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start space-x-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Button
        variant={plan.isPopular ? 'primary' : 'outline'}
        size="lg"
        className="w-full"
        onClick={() => onSelectPlan(plan)}
        disabled={isCurrentPlan || isLoading}
        isLoading={isLoading}
      >
        {isCurrentPlan ? 'Current Plan' : plan.price === 0 ? 'Get Started' : 'Upgrade'}
      </Button>
    </motion.div>
  );
};

export default PricingCard;