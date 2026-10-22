import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { ChemBrosLogo } from '../components/ChemBrosLogo';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-24 text-center bg-white text-[#0A2533]">
      <div className="w-16 h-16 rounded-full border border-[#0A2533]/15 flex items-center justify-center font-mono text-sm text-[#087A91] font-semibold mb-6">
        404
      </div>

      <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-[#087A91] uppercase font-semibold mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        <span>SPECIMEN NOT FOUND</span>
      </div>

      <h1 className="font-display font-light text-3xl sm:text-5xl text-[#0A2533] tracking-tight">
        Formula Absent from Archive.
      </h1>

      <p className="mt-4 text-sm sm:text-base text-[#5A7785] max-w-md mx-auto font-light leading-relaxed">
        The requested formulation dossier does not exist in our active batch ledger or has been archived into dark cold storage.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0A2533] hover:bg-[#087A91] text-white font-mono text-xs uppercase tracking-widest font-semibold transition-all shadow-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO HOME</span>
        </Link>

        <Link
          to="/product/molecule-j"
          className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#0A2533]/20 hover:border-[#0A2533] text-[#0A2533] font-mono text-xs uppercase tracking-wider transition-colors"
        >
          <span>EXPLORE ACTIVE FORMULAS</span>
        </Link>
      </div>
    </div>
  );
};
