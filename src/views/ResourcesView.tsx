import React, { useState } from 'react';
import { 
  BookOpen, 
  Mail, 
  FileText, 
  DollarSign, 
  Globe, 
  Copy, 
  Check, 
  ExternalLink,
  Sparkles,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import { useApp } from '../context/AppContext';

type ResourceTab = 'emails' | 'sop' | 'waivers' | 'scholarships';

export const ResourcesView: React.FC = () => {
  const { settings } = useApp();
  const [activeTab, setActiveTab] = useState<ResourceTab>('emails');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const emailTemplates = [
    {
      id: 'email-ra',
      title: 'Inquiring About Research Assistantships (RA) / Faculty Openings',
      recipient: 'Prospective Professor / Lab Director',
      subject: `Prospective ${settings.targetDegree || "Master's"} Student — Research Inquiry in [Lab/Research Topic]`,
      body: `Dear Professor [Last Name],

I hope this email finds you well.

My name is ${settings.applicantName || '[Your Name]'}, and I recently completed my undergraduate degree in [Your Major] at [Your University]. I am writing to express my strong interest in joining your research group for the upcoming ${settings.targetIntake || 'Fall 2026'} academic term.

I have closely followed your recent publication titled "[Paper Title]" and was particularly intrigued by your approach to [mention a specific finding or methodology]. During my previous research on [your project], I developed [key technical skill or algorithm] which aligns closely with your lab's focus on [research topic].

I have attached my CV and transcript for your review. Would you have 10-15 minutes in the coming weeks for a brief conversation regarding potential openings in your lab?

Thank you for your time and consideration.

Sincerely,
${settings.applicantName || '[Your Name]'}
[Your Phone Number]
[Your LinkedIn / Personal Website]`,
    },
    {
      id: 'email-waiver',
      title: 'Application Fee Waiver Request',
      recipient: 'Department Admissions Coordinator / Graduate Office',
      subject: `Application Fee Waiver Request — ${settings.targetDegree || "Master's"} in [Program Name] — [Your Full Name]`,
      body: `Dear Admissions Committee,

I am applying to the ${settings.targetDegree || "Master's"} in [Program Name] for the ${settings.targetIntake || 'Fall 2026'} intake. 

I am writing to inquire if fee waiver consideration is available for international applicants experiencing currency devaluation and financial constraints. An application fee waiver would significantly support my ability to complete my submission without financial hardship.

I have prepared my complete application, including letters of recommendation, statement of purpose, and academic transcripts. Please let me know if any supporting financial documentation is needed to verify this request.

Thank you very much for your time and guidance.

Warm regards,
${settings.applicantName || '[Your Name]'}
Application ID / Reference: [If applicable]`,
    },
    {
      id: 'email-lor-followup',
      title: 'Polite Recommendation Letter Follow-Up',
      recipient: 'Your Recommender (Professor or Supervisor)',
      subject: `Friendly Reminder: Recommendation Letter for [University Name] (Deadline: [Date])`,
      body: `Dear Professor [Last Name],

I hope you are having a wonderful week.

I am writing to send a gentle reminder regarding the letter of recommendation for my application to [University Name] ([Program Name]). The submission deadline is approaching on [Deadline Date].

The university should have sent a link directly to your email from "[Sender Email/Portal]". Please let me know if you need me to resend the recommendation link or provide updated drafts of my Statement of Purpose or resume.

Thank you once again for your generous support of my graduate school journey.

Best regards,
${settings.applicantName || '[Your Name]'}`,
    },
  ];

  const sopFramework = [
    {
      step: '01',
      title: 'The Hook & Central Motivation (15% of SOP)',
      description: 'Hook the committee with the specific intellectual question or problem that drives you. Avoid generic childhood stories ("Since I was five years old..."). Jump straight into the problem you want to solve in your graduate studies.',
      tips: ['Focus on an intellectual turning point during university or work.', 'Connect your curiosity directly to current industry or research challenges.'],
    },
    {
      step: '02',
      title: 'Academic Foundation & Research Proof (35% of SOP)',
      description: 'Demonstrate that you possess the rigorous technical foundation to excel. Discuss 1-2 major projects, publications, or thesis work in depth—explaining your hypothesis, methodology, results, and what you learned from failures.',
      tips: ['Use numbers and metrics where possible (e.g. "improved inference speed by 28%").', 'Showcase independent problem-solving skills rather than routine course assignments.'],
    },
    {
      step: '03',
      title: 'Why This Specific University & Faculty (30% of SOP)',
      description: 'This is the most critical section. Name 2-3 specific professors whose research papers you have read, specific lab facilities, or unique curriculum electives that make this university the singular best fit.',
      tips: ['Never copy-paste the exact same "Why University" paragraph across schools.', 'Explain how your background fills a complementary need in their ongoing lab projects.'],
    },
    {
      step: '04',
      title: 'Long-Term Vision & Impact (20% of SOP)',
      description: 'Clearly articulate your 5-year post-graduation trajectory. Will you pursue a PhD, lead R&D in industry, or launch a tech startup? Connect your graduate degree to the tangible impact you plan to make.',
      tips: ['Be realistic and specific about target roles or research fields.', 'End with a confident, forward-looking sentence emphasizing readiness to contribute to the university community.'],
    },
  ];

  const scholarships = [
    {
      name: 'Fulbright Foreign Student Program',
      coverage: 'Full tuition, monthly living stipend, health insurance & airfare',
      regions: 'United States',
      link: 'https://foreign.fulbrightonline.org/',
      highlight: 'Prestigious flagship U.S. government scholarship covering full Masters/PhD.',
    },
    {
      name: 'DAAD Scholarships (Germany)',
      coverage: 'Full tuition exemption, €934+/month stipend, travel allowances',
      regions: 'Germany & EU',
      link: 'https://www.daad.de/en/',
      highlight: 'The premier funding agency for international graduate studies across German universities.',
    },
    {
      name: 'Erasmus Mundus Joint Masters',
      coverage: 'Full scholarship (€1,400/month stipend, 100% tuition, travel costs)',
      regions: 'Multiple European Countries',
      link: 'https://erasmus-plus.ec.europa.eu/',
      highlight: 'Study across 2-3 top European countries in a collaborative dual-degree Masters program.',
    },
    {
      name: 'Chevening Scholarships (UK)',
      coverage: 'Full university tuition, monthly living allowance, return economy flights',
      regions: 'United Kingdom',
      link: 'https://www.chevening.org/',
      highlight: 'UK government global awards for outstanding future leaders pursuing a 1-year Masters.',
    },
    {
      name: 'Swiss Government Excellence Scholarships',
      coverage: 'Full monthly stipend, health insurance, housing subsidy',
      regions: 'Switzerland (ETH Zurich, EPFL, etc.)',
      link: 'https://www.sbfi.admin.ch/scholarships_eng',
      highlight: 'Supports exceptional international students at Switzerland top research universities.',
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-7 max-w-[1700px] mx-auto w-full relative z-10">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-1.5 h-6 bg-amber-400 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
              <h1 className="text-2xl font-black text-white tracking-tight">Admissions Resources & Toolkits</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Curated blueprints, copy-ready email templates, fee waiver guides, and global scholarship registries.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#091122] p-1.5 rounded-2xl border border-white/10 shrink-0">
            <button
              onClick={() => setActiveTab('emails')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'emails' 
                  ? 'bg-amber-400 text-[#1a0f00] shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Email Templates
            </button>
            <button
              onClick={() => setActiveTab('sop')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'sop' 
                  ? 'bg-amber-400 text-[#1a0f00] shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SOP Blueprint
            </button>
            <button
              onClick={() => setActiveTab('scholarships')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'scholarships' 
                  ? 'bg-amber-400 text-[#1a0f00] shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Scholarships
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Email Templates */}
      {activeTab === 'emails' && (
        <div className="grid grid-cols-1 gap-5">
          {emailTemplates.map(tmpl => (
            <div key={tmpl.id} className="glass-panel rounded-3xl p-6 border border-white/[0.08] shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06] mb-4">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white">{tmpl.title}</h3>
                    <p className="text-xs text-amber-400/90 mt-0.5">Target: {tmpl.recipient}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(tmpl.id, `Subject: ${tmpl.subject}\n\n${tmpl.body}`)}
                    className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition-all self-start sm:self-auto"
                  >
                    {copiedId === tmpl.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Copy Template</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mb-3 text-xs">
                  <span className="font-bold text-slate-400">Subject: </span>
                  <span className="text-slate-200 font-mono">{tmpl.subject}</span>
                </div>

                <pre className="p-4 rounded-2xl bg-[#070d1c] border border-white/[0.06] text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed select-text">
                  {tmpl.body}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Statement of Purpose Framework */}
      {activeTab === 'sop' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sopFramework.map(item => (
            <div key={item.step} className="glass-panel rounded-3xl p-6 border border-white/[0.08] shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl font-black text-amber-400/40 font-mono">{item.step}</span>
                  <h3 className="font-bold text-sm text-white">{item.title}</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {item.description}
                </p>
                <div className="space-y-1.5 pt-3 border-t border-white/[0.05]">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Key Takeaways:</div>
                  {item.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                      <ChevronRight className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Global Scholarships Directory */}
      {activeTab === 'scholarships' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {scholarships.map(item => (
            <div key={item.name} className="glass-panel rounded-3xl p-6 border border-white/[0.08] shadow-2xl flex flex-col justify-between hover:border-amber-400/30 transition-all">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                    {item.regions}
                  </span>
                  <Globe className="w-4 h-4 text-slate-500" />
                </div>
                <h3 className="font-bold text-sm text-white mb-1.5">{item.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.highlight}</p>
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-xs text-emerald-300 font-medium mb-4">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">Coverage:</span>
                  {item.coverage}
                </div>
              </div>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourcesView;
