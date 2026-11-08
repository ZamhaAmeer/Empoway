import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  MapPin,
  ShieldCheck,
  Compass,
  ArrowRight,
  CheckCircle,
  Building2,
  Users,
  AlertTriangle,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import {
  staggerContainer,
  cardReveal,
  fadeInUp,
  reducedMotionVariants
} from '../utils/animations';

export const AboutPilotPage = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={shouldReduceMotion ? reducedMotionVariants : fadeInUp}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-empoway-cream border border-empoway-champagne text-xs font-bold text-empoway-coffee shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-empoway-terracotta" />
          <span>Colombo Pilot Project • Baseline Assessment</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-empoway-coffee tracking-tight">
          Building the Accessibility Map of Sri Lanka
        </h1>

        <p className="text-sm sm:text-base text-empoway-muted max-w-2xl mx-auto leading-relaxed">
          EMPOWAY begins in the commercial and administrative capital of Sri Lanka—Colombo—evaluating public hospitals, higher education faculties, commercial banks and government secretariat offices.
        </p>
      </motion.div>

      {/* Main Philosophy Card */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={shouldReduceMotion ? reducedMotionVariants : fadeInUp}
        className="bg-white rounded-3xl p-8 sm:p-10 border border-empoway-blush/80 shadow-card hover:shadow-elevated transition-shadow duration-300 space-y-6"
      >
        <div className="border-b border-empoway-cream pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-empoway-terracotta">
            Core Philosophy
          </span>
          <h2 className="text-2xl font-extrabold text-empoway-coffee mt-1 tracking-tight">
            Transparent, Evidence-Based Accessibility
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-empoway-coffee leading-relaxed">
          Many people with mobility difficulties, particularly wheelchair users and senior citizens, face unpredictable barriers when visiting public buildings in Colombo. A hospital may have an elevator, but three steps at the main door block entry. A bank branch may have a ramp, but an angle so steep that it poses a safety hazard.
        </p>

        <div className="p-5 rounded-2xl bg-empoway-cream/70 border border-empoway-champagne text-xs text-empoway-coffee leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-extrabold text-empoway-terracotta">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>Important Product Standard</span>
          </div>
          <p className="leading-relaxed">
            EMPOWAY is not a platform that automatically certifies buildings as accessible. It provides transparent, evidence-based accessibility information and clearly distinguishes verified physical assessments from community crowdsourced submissions.
          </p>
        </div>
      </motion.div>

      {/* The Three Information Statuses Explained */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={staggerContainer}
        className="space-y-5"
      >
        <h2 className="text-xl sm:text-2xl font-extrabold text-empoway-coffee tracking-tight">
          Our Three Information Tiers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            variants={shouldReduceMotion ? reducedMotionVariants : cardReveal}
            className="group bg-white p-6 rounded-2xl sm:rounded-3xl border border-emerald-200/90 shadow-card hover:shadow-[0_18px_35px_-10px_rgba(16,185,129,0.18)] hover:-translate-y-2 hover:scale-[1.015] transition-all duration-300 ease-out space-y-3.5 select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shadow-2xs group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              ✓
            </div>
            <h3 className="text-base font-extrabold text-emerald-950 group-hover:text-emerald-700 transition-colors">
              1. VERIFIED
            </h3>
            <p className="text-xs text-empoway-muted leading-relaxed">
              Physically audited on-site or confirmed through an authorized verification process with photographic evidence, ramp angle measurement, and doorway clearance checks.
            </p>
          </motion.div>

          <motion.div
            variants={shouldReduceMotion ? reducedMotionVariants : cardReveal}
            className="group bg-white p-6 rounded-2xl sm:rounded-3xl border border-amber-200/90 shadow-card hover:shadow-[0_18px_35px_-10px_rgba(245,158,11,0.18)] hover:-translate-y-2 hover:scale-[1.015] transition-all duration-300 ease-out space-y-3.5 select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg shadow-2xs group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
              ★
            </div>
            <h3 className="text-base font-extrabold text-amber-950 group-hover:text-amber-700 transition-colors">
              2. COMMUNITY REPORTED
            </h3>
            <p className="text-xs text-empoway-muted leading-relaxed">
              Contributed by community members, visitors, and patients based on personal visits. Helpful for preliminary awareness, pending independent audit.
            </p>
          </motion.div>

          <motion.div
            variants={shouldReduceMotion ? reducedMotionVariants : cardReveal}
            className="group bg-white p-6 rounded-2xl sm:rounded-3xl border border-stone-200 shadow-card hover:shadow-[0_18px_35px_-10px_rgba(120,113,108,0.18)] hover:-translate-y-2 hover:scale-[1.015] transition-all duration-300 ease-out space-y-3.5 select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-lg shadow-2xs group-hover:scale-110 group-hover:bg-stone-600 group-hover:text-white transition-all duration-300">
              ?
            </div>
            <h3 className="text-base font-extrabold text-stone-900 group-hover:text-stone-700 transition-colors">
              3. UNKNOWN STATUS
            </h3>
            <p className="text-xs text-empoway-muted leading-relaxed">
              Insufficient information available. Never assumed to be accessible or inaccessible without data. Invites community members to submit on-site notes.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* 8 Core Criteria List */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={shouldReduceMotion ? reducedMotionVariants : fadeInUp}
        className="bg-white rounded-3xl p-8 sm:p-10 border border-empoway-blush/80 shadow-card space-y-6"
      >
        <h2 className="text-xl sm:text-2xl font-extrabold text-empoway-coffee tracking-tight">
          The 8 Core Assessment Checklist Criteria
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {[
            { title: 'Step-free entrance', desc: 'Flat ground level approach without curb barriers.' },
            { title: 'Wheelchair ramp', desc: 'Ramp with safe incline (1:12 or gentler) & dual safety handrails.' },
            { title: 'Operating elevator', desc: 'Working passenger lift to access multi-story service floors.' },
            { title: 'Accessible toilet', desc: 'Restroom with wide door, grab bars and wheelchair turn radius.' },
            { title: 'Accessible parking', desc: 'Designated wide parking bay near the ramped entrance.' },
            { title: 'Wide doorways & halls', desc: 'Passageways minimum 85+ cm wide for easy wheelchair transit.' },
            { title: 'Wheelchair-friendly pathways', desc: 'Smooth, paved, non-slip internal and courtyard corridors.' },
            { title: 'Accessible service counters', desc: 'Lowered reception or teller desk (75–80 cm height).' }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-empoway-ivory border border-empoway-blush/70 hover:border-empoway-terracotta/40 hover:bg-white hover:-translate-y-1 hover:shadow-xs transition-all duration-200 flex items-start gap-3.5 select-none"
            >
              <CheckCircle className="w-4 h-4 text-empoway-terracotta shrink-0 mt-0.5" />
              <div>
                <strong className="block text-empoway-coffee font-extrabold">{item.title}</strong>
                <span className="text-empoway-muted leading-relaxed block mt-0.5">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Roadmap for Sri Lanka */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={shouldReduceMotion ? reducedMotionVariants : fadeInUp}
        className="bg-gradient-to-br from-empoway-cream via-empoway-ivory to-empoway-cream/90 rounded-3xl p-8 sm:p-10 border border-empoway-blush shadow-card space-y-5"
      >
        <h2 className="text-xl sm:text-2xl font-extrabold text-empoway-coffee tracking-tight">
          Expansion Roadmap for Sri Lanka
        </h2>
        <p className="text-xs sm:text-sm text-empoway-coffee/90 leading-relaxed">
          The Colombo pilot establishes the methodology, community verification pipeline, and data standards. The platform is architected to scale into:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2 text-xs">
          <div className="p-5 rounded-2xl bg-white border border-empoway-blush/70 hover:border-empoway-terracotta/40 hover:-translate-y-1.5 hover:shadow-card transition-all duration-300">
            <span className="font-extrabold text-empoway-terracotta block mb-1">Phase 1 (Current)</span>
            <strong className="block text-empoway-coffee text-sm font-extrabold">Colombo District</strong>
            <span className="text-empoway-muted block mt-1 leading-relaxed">Hospitals, Universities, Banks, Government Offices in Colombo 01–15 & suburbs.</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-empoway-blush/70 hover:border-empoway-caramel/40 hover:-translate-y-1.5 hover:shadow-card transition-all duration-300">
            <span className="font-extrabold text-empoway-caramel block mb-1">Phase 2</span>
            <strong className="block text-empoway-coffee text-sm font-extrabold">Western Province</strong>
            <span className="text-empoway-muted block mt-1 leading-relaxed">Gampaha, Negombo, Kalutara transit hubs and healthcare facilities.</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-empoway-blush/70 hover:border-emerald-600/40 hover:-translate-y-1.5 hover:shadow-card transition-all duration-300">
            <span className="font-extrabold text-emerald-700 block mb-1">Phase 3</span>
            <strong className="block text-empoway-coffee text-sm font-extrabold">Island-wide Coverage</strong>
            <span className="text-empoway-muted block mt-1 leading-relaxed">Kandy, Galle, Jaffna, Anuradhapura and regional public transport nodes.</span>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white font-extrabold text-xs shadow-card hover:shadow-elevated hover:scale-105 active:scale-95 transition-all"
        >
          <Compass className="w-4 h-4" />
          <span>Explore Colombo Pilot Places</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default AboutPilotPage;
