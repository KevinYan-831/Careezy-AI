
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const PricingCard = ({ tier, price, description, features, recommended, buttonText, buttonClass }: any) => (
  <div className={`relative bg-white rounded-2xl p-8 ${recommended ? 'border-2 border-teal-500 shadow-xl scale-105 z-10' : 'border border-slate-200 shadow-sm hover:shadow-md'} transition-all duration-300`}>
    {recommended && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-teal-600 text-white text-sm font-bold px-4 py-1 rounded-full">
        Most Popular
      </div>
    )}
    <div className="mb-6">
      <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">{tier}</h3>
      <div className="mt-4 flex items-baseline">
        <span className="text-4xl font-extrabold text-slate-900">${price}</span>
        <span className="ml-1 text-xl text-slate-500">/mo</span>
      </div>
      <p className="mt-4 text-slate-500 text-sm">{description}</p>
    </div>
    <ul className="space-y-4 mb-8">
      {features.map((feature: string, i: number) => (
        <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
          <Check className="w-5 h-5 text-teal-500 shrink-0" />
          {feature}
        </li>
      ))}
    </ul>
    <Link 
      to="/dashboard" 
      className={`block w-full text-center py-3 rounded-xl font-bold transition-all ${buttonClass}`}
    >
      {buttonText}
    </Link>
  </div>
);

export const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      
      <div className="bg-slate-50 pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-slate-600 mb-12">
            Invest in your future for less than the price of a coffee.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
            
            {/* Free Tier */}
            <PricingCard 
              tier="Student"
              price="0"
              description="Perfect for getting started with your first resume."
              features={[
                "1 Resume Template",
                "Basic PDF Export",
                "Limited Internship Searches",
                "Community Support"
              ]}
              buttonText="Start for Free"
              buttonClass="bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            />

            {/* Pro Tier */}
            <PricingCard 
              tier="Pro"
              price="12"
              description="Everything you need to land your dream job."
              recommended={true}
              features={[
                "Unlimited Resumes",
                "All Premium Templates",
                "AI Content Improvements",
                "Advanced Job Matching",
                "Unlimited PDF Exports",
                "Priority Support"
              ]}
              buttonText="Get Pro"
              buttonClass="bg-teal-600 text-white hover:bg-teal-700 shadow-lg hover:shadow-teal-500/25"
            />

            {/* Career+ Tier */}
            <PricingCard 
              tier="Career+"
              price="29"
              description="Full AI coaching and personalized mentorship."
              features={[
                "Everything in Pro",
                "Unlimited AI Career Coach",
                "Mock Interview Simulator",
                "Salary Negotiation Tools",
                "LinkedIn Profile Audit",
                "1-on-1 Human Review (1/mo)"
              ]}
              buttonText="Get Career+"
              buttonClass="bg-slate-900 text-white hover:bg-slate-800"
            />

          </div>
        </div>
      </div>

      <div className="py-20 px-4 text-center">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Trusted by students from</h3>
        <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale">
           {/* Mock Logos */}
           <span className="text-xl font-bold text-slate-400">Stanford</span>
           <span className="text-xl font-bold text-slate-400">MIT</span>
           <span className="text-xl font-bold text-slate-400">Berkeley</span>
           <span className="text-xl font-bold text-slate-400">UCLA</span>
        </div>
      </div>
    </div>
  );
};
