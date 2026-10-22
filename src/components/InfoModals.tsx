import React, { useState } from 'react';
import { X, CheckCircle2, Send, Mail, MapPin, Phone } from 'lucide-react';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
      <div className="relative w-full max-w-3xl bg-[#03151D] border border-[#073849] p-8 sm:p-10 shadow-2xl text-[#DCE3E8] z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="text-xs font-mono tracking-[0.25em] text-[#48B8CE] uppercase font-semibold">
            THE CHEM BROS CHRONICLE // EST. 2024
          </div>
          <button onClick={onClose} className="text-[#A9C2CE] hover:text-white p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 className="font-display font-light text-3xl sm:text-4xl text-white tracking-tight mb-6">
          Where Molecular Science Meets Olfactory Art.
        </h2>

        <div className="space-y-5 text-sm sm:text-base text-[#DCE3E8]/85 font-light leading-relaxed">
          <p>
            CHEM BROS was founded by two formulation chemists who refused to accept the artificial distinction between organic botanical purity and high-performance synthetic isolate chemistry.
          </p>
          <p>
            Traditional perfumery often celebrates romance while obscuring formulation realities. We believe true luxury lies in rigorous transparency, surgical extraction temperatures, and the uncompromising beauty of pure molecular balance.
          </p>
          <p>
            Operating out of our private research laboratory, every scent is designed from the molecular weight up. We utilize cryogenic CO2 extraction, cold fractional cuts, and oxygen-depleted nitrogen aging tanks to produce fragrances that are potent, non-irritating, and deeply evocative.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs text-[#A9C2CE]">
          <div>
            <span className="text-[#48B8CE] block mb-1">01. INDEPENDENT LAB</span>
            <span>Self-directed compounding with zero mass-market conglomerates.</span>
          </div>
          <div>
            <span className="text-[#48B8CE] block mb-1">02. 500-BOTTLE BATCHES</span>
            <span>Precision hand-poured flacons verified by batch gas chromatography.</span>
          </div>
          <div>
            <span className="text-[#48B8CE] block mb-1">03. CLEAN SCIENCE</span>
            <span>IFRA-certified, 100% cruelty-free, no phthalates or unnecessary dyes.</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-[#073849] hover:bg-[#087A91] text-white font-mono text-xs uppercase tracking-widest cursor-pointer transition-colors"
          >
            CLOSE STORY
          </button>
        </div>
      </div>
    </div>
  );
};

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'specimen', message: '' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
      <div className="relative w-full max-w-2xl bg-[#03151D] border border-[#073849] p-8 shadow-2xl text-[#DCE3E8] z-10">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="text-xs font-mono tracking-[0.25em] text-[#48B8CE] uppercase font-semibold">
            LABORATORY INQUIRY // CLIENT CONCIERGE
          </div>
          <button onClick={onClose} className="text-[#A9C2CE] hover:text-white p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[#48B8CE] mx-auto" />
            <h3 className="font-display text-2xl text-white">Inquiry Transmitted</h3>
            <p className="text-xs font-mono text-[#A9C2CE] max-w-md mx-auto leading-relaxed">
              Your inquiry has been logged with the CHEM BROS formulation desk. A lab specialist will respond within 24 operational hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-4 px-6 py-2.5 bg-[#48B8CE] text-[#03151D] font-mono text-xs uppercase tracking-widest font-semibold cursor-pointer"
            >
              DONE
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-[#A9C2CE] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                required
                type="text"
                placeholder="Dr. Jordan Mercer"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 bg-[#020E14] border border-white/15 focus:border-[#48B8CE] text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#A9C2CE] uppercase tracking-wider mb-1.5">
                Contact Email
              </label>
              <input
                required
                type="email"
                placeholder="mercer@specimen.org"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 bg-[#020E14] border border-white/15 focus:border-[#48B8CE] text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#A9C2CE] uppercase tracking-wider mb-1.5">
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full p-3 bg-[#020E14] border border-white/15 focus:border-[#48B8CE] text-white focus:outline-none"
              >
                <option value="specimen">Specimen & Formulation Inquiry</option>
                <option value="stockist">Retail / Stockist Application</option>
                <option value="press">Press & Editorial Archiving</option>
                <option value="custom">Custom Nitrogen Vault Compounding</option>
              </select>
            </div>

            <div>
              <label className="block text-[#A9C2CE] uppercase tracking-wider mb-1.5">
                Laboratory Message
              </label>
              <textarea
                required
                rows={4}
                placeholder="Detail your inquiry, requested formula samples, or boutique location..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-3 bg-[#020E14] border border-white/15 focus:border-[#48B8CE] text-white focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#F5F7F8] hover:bg-white text-[#03151D] font-mono text-xs uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer mt-4"
            >
              TRANSMIT INQUIRY
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

interface PolicyModalProps {
  type: 'shipping' | 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const content = {
    shipping: {
      title: "Complimentary Insured Shipping & Return Policies",
      eyebrow: "LOGISTICS & DISPATCH PROTOCOL",
      text: "Every CHEM BROS perfume flacon is cushioned inside our temperature-stabilized luxury specimen packaging. Orders are dispatched with end-to-end climate logging and courier insurance. Due to the high-concentration nature of our extrait extractions, unopened bottles in original nitrogen-sealed vacuum wrap may be returned within 14 days of delivery. Sample vials are non-refundable.",
    },
    privacy: {
      title: "Data Protection & Formulation Privacy",
      eyebrow: "DATA GOVERNANCE STANDARD",
      text: "CHEM BROS adheres to strict global data confidentiality guidelines. We never distribute client delivery information, olfactory preference questionnaires, or payment logs to unauthorized external brokers. Client records are encrypted with 256-bit AES protocols.",
    },
    terms: {
      title: "Terms of Service & Specimen Authenticity",
      eyebrow: "LEGAL & INTELLECTUAL PROPERTY",
      text: "All formula designations (CB-001 through CB-004), proprietary isolate ratios, and trademarked designations are the exclusive intellectual property of CHEM BROS Fragrance Laboratory. All products are compounding specimens for personal olfactory wear.",
    },
  }[type];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
      <div className="relative w-full max-w-xl bg-[#03151D] border border-[#073849] p-8 shadow-2xl text-[#DCE3E8] z-10">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="text-xs font-mono tracking-[0.25em] text-[#48B8CE] uppercase font-semibold">
            {content.eyebrow}
          </div>
          <button onClick={onClose} className="text-[#A9C2CE] hover:text-white p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="font-display font-light text-2xl text-white tracking-tight mb-4">
          {content.title}
        </h3>

        <p className="text-sm text-[#DCE3E8]/85 font-light leading-relaxed mb-8">
          {content.text}
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#073849] hover:bg-[#087A91] text-white font-mono text-xs uppercase tracking-widest cursor-pointer transition-colors"
        >
          ACKNOWLEDGE & CLOSE
        </button>
      </div>
    </div>
  );
};
