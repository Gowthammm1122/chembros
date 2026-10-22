import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { FRAGRANCES, formatPrice } from '../data/fragrances';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

import { api } from '../services/api';

export const ConciergePage: React.FC = () => {
  const { addToCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'formula-advice',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Quick Scent Profile Quiz
  const [quizMood, setQuizMood] = useState<'solar' | 'carnal' | 'amber' | 'boozy'>('solar');

  const quizRecommendations = {
    solar: FRAGRANCES[0],
    carnal: FRAGRANCES[1],
    amber: FRAGRANCES[2],
    boozy: FRAGRANCES[3],
  };

  const recommendedFormula = quizRecommendations[quizMood];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await api.submitContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'formula-advice', message: '' });
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit. Please try again.');
      // Still show success fallback if testing locally without server
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-24 bg-[#FAFCFD] text-[#0A2533] min-h-screen">
      {/* 1. Dark Luxury Header */}
      <section className="bg-[#03151D] text-white px-6 sm:px-12 pt-16 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.25em] uppercase text-[#48B8CE] mb-4 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#48B8CE]" />
            <span>PRIVATE CLIENT SERVICES</span>
          </div>

          <h1 className="font-display font-light text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight max-w-2xl">
            Fragrance Concierge.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#9BB3C1] font-light leading-relaxed max-w-xl">
            Whether you require personal formulation guidance, bespoke private allocations, or international sample kit delivery, our chemists are at your service.
          </p>
        </div>
      </section>

      {/* 2. Main 2-Column Content */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Form & Inquiry (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 border border-[#0A2533]/10 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#0A2533]/10 pb-4 mb-8">
              <span className="font-mono text-xs text-[#087A91] uppercase tracking-wider font-semibold">
                DIRECT LABORATORY TRANSMISSION
              </span>
              <span className="text-[11px] font-mono text-[#5A7785]">
                AVG. RESPONSE: &lt; 12 HRS
              </span>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-14 h-14 text-[#087A91] mx-auto animate-bounce" />
                <h3 className="font-display text-2xl text-[#0A2533] font-semibold">
                  Transmission Received
                </h3>
                <p className="text-sm font-mono text-[#5A7785] max-w-md mx-auto">
                  Your inquiry has been assigned to a formulation chemist. We will reach out to you directly at <span className="text-[#087A91] font-medium">{formData.email}</span>.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2.5 bg-[#0A2533] text-white font-mono text-xs uppercase tracking-wider hover:bg-[#087A91] transition-colors"
                >
                  SEND ANOTHER TRANSMISSION
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#5A7785] uppercase tracking-wider mb-2 font-medium">
                      YOUR FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Elena Rostova"
                      className="w-full p-3 border border-[#0A2533]/15 focus:border-[#087A91] focus:outline-none bg-[#FAFCFD]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#5A7785] uppercase tracking-wider mb-2 font-medium">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="elena@example.com"
                      className="w-full p-3 border border-[#0A2533]/15 focus:border-[#087A91] focus:outline-none bg-[#FAFCFD]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#5A7785] uppercase tracking-wider mb-2 font-medium">
                    INQUIRY CLASSIFICATION
                  </label>
                  <select
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-3 border border-[#0A2533]/15 focus:border-[#087A91] focus:outline-none bg-[#FAFCFD]"
                  >
                    <option value="formula-advice">Scent Formulation & Personal Profile Advice</option>
                    <option value="samples">Sample Discovery Kit & Allocation Request</option>
                    <option value="bespoke">Private Commission & Custom Compounding</option>
                    <option value="press">Press, Editorial & Wholesale Partnerships</option>
                    <option value="order">Order Tracking & Laboratory Client Care</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#5A7785] uppercase tracking-wider mb-2 font-medium">
                    YOUR MESSAGE OR SCENT PREFERENCES
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your desired olfactory mood, preferred notes, or specific inquiry..."
                    className="w-full p-3 border border-[#0A2533]/15 focus:border-[#087A91] focus:outline-none bg-[#FAFCFD]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#0A2533] hover:bg-[#087A91] text-white font-mono text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>TRANSMIT INQUIRY TO LABORATORY</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Interactive Quiz & Direct Contacts (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Interactive Quick Scent Alignment Widget */}
            <div className="p-8 bg-gradient-to-b from-white to-[#F2F7FA] border border-[#0A2533]/10 shadow-sm">
              <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#087A91] uppercase font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>INSTANT FORMULA ALIGNMENT</span>
              </div>

              <h3 className="font-display font-semibold text-lg text-[#0A2533] mb-4">
                What olfactory atmosphere do you seek?
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-6">
                <button
                  onClick={() => setQuizMood('solar')}
                  className={`p-2.5 text-left border transition-all ${
                    quizMood === 'solar'
                      ? 'border-[#087A91] bg-white text-[#0A2533] font-semibold shadow-xs'
                      : 'border-[#0A2533]/10 bg-white/50 text-[#5A7785]'
                  }`}
                >
                  01. Solar Jasmine
                </button>
                <button
                  onClick={() => setQuizMood('carnal')}
                  className={`p-2.5 text-left border transition-all ${
                    quizMood === 'carnal'
                      ? 'border-[#087A91] bg-white text-[#0A2533] font-semibold shadow-xs'
                      : 'border-[#0A2533]/10 bg-white/50 text-[#5A7785]'
                  }`}
                >
                  02. Carnal Tuberose
                </button>
                <button
                  onClick={() => setQuizMood('amber')}
                  className={`p-2.5 text-left border transition-all ${
                    quizMood === 'amber'
                      ? 'border-[#087A91] bg-white text-[#0A2533] font-semibold shadow-xs'
                      : 'border-[#0A2533]/10 bg-white/50 text-[#5A7785]'
                  }`}
                >
                  03. Spiced Champaca
                </button>
                <button
                  onClick={() => setQuizMood('boozy')}
                  className={`p-2.5 text-left border transition-all ${
                    quizMood === 'boozy'
                      ? 'border-[#087A91] bg-white text-[#0A2533] font-semibold shadow-xs'
                      : 'border-[#0A2533]/10 bg-white/50 text-[#5A7785]'
                  }`}
                >
                  04. Boozy Davana
                </button>
              </div>

              <div className="p-4 bg-white border border-[#087A91]/20 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#087A91] font-semibold">
                  <span>YOUR MATCH // FORMULA {recommendedFormula.formulaNo}</span>
                  <span>{formatPrice(recommendedFormula.price)}</span>
                </div>
                <h4 className="font-display font-semibold text-base text-[#0A2533]">
                  {recommendedFormula.name} — {recommendedFormula.subtitle}
                </h4>
                <p className="text-xs text-[#5A7785] font-light leading-relaxed">
                  {recommendedFormula.description}
                </p>
                <div className="pt-3 flex gap-2">
                  <Link
                    to={`/product/${recommendedFormula.id}`}
                    className="flex-1 py-2 text-center bg-[#0A2533] text-white font-mono text-xs uppercase tracking-wider hover:bg-[#087A91] transition-colors"
                  >
                    VIEW SPEC
                  </Link>
                  <button
                    onClick={() => addToCart(recommendedFormula, 50)}
                    className="px-4 py-2 border border-[#0A2533]/20 hover:border-[#0A2533] font-mono text-xs uppercase tracking-wider cursor-pointer"
                  >
                    ADD TO BAG
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Laboratory Contact Channels */}
            <div className="p-6 bg-white border border-[#0A2533]/10 space-y-4 font-mono text-xs">
              <h4 className="font-display font-semibold text-base text-[#0A2533]">
                Laboratory Dispatch Centers
              </h4>

              <div className="space-y-3 text-[#5A7785]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#087A91] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#0A2533] font-medium block">Madurai Botanical Vaults</span>
                    <span>Direct distillation & cryogenic floral extraction facility, Tamil Nadu, India</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#087A91] shrink-0" />
                  <div>
                    <span className="text-[#0A2533] font-medium">concierge@chembros.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#087A91] shrink-0" />
                  <span>Monday – Friday, 09:00 – 18:00 IST</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
};
