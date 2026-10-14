import React from 'react';
import { DollarSign, Award, TrendingUp, Sparkles, CreditCard, Building2, Plus, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FundingComparisonView: React.FC = () => {
  const { schools, funding, settings, setActiveTab } = useApp();

  const totalAidOffered = funding.reduce((acc, f) => acc + (f.amountOffered || 0), 0);
  const totalApplicationFees = schools.reduce((acc, s) => acc + (s.applicationFee || 0), 0);
  const programsWithAid = funding.filter(f => f.amountOffered > 0).length;
  const averagePackage = funding.length > 0 ? Math.round(totalAidOffered / funding.length) : 0;

  const fundingData = schools.map(school => {
    const fund = funding.find(f => f.schoolId === school.id);
    const offered = fund?.amountOffered || 0;
    const tuition = fund?.tuitionCost || 0;
    const living = fund?.estimatedCostOfLiving || 0;
    const totalCost = tuition + living;
    const netCost = totalCost - offered;

    return {
      school,
      funding: fund,
      offered,
      tuition,
      living,
      totalCost,
      netCost,
    };
  });

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-7 max-w-[1700px] mx-auto w-full relative z-10">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-1.5 h-6 bg-amber-400 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
              <h1 className="text-2xl font-black text-white tracking-tight">Funding & Financial Comparison</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Compare financial packages, graduate assistantships, estimated living costs, and application fees.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-400/10 border border-amber-400/20 rounded-2xl text-amber-300 text-xs font-bold self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Workspace Currency: {settings.currency || '$'}</span>
          </div>
        </div>

        {/* 4 Overview Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-white/[0.06]">
          {/* Total Aid Offered */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-400 mb-1">
              <Award className="w-4 h-4" />
              <span>Total Aid Offered</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {settings.currency || '$'}{totalAidOffered.toLocaleString()}
            </div>
          </div>

          {/* Programs With Aid */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-blue-400 mb-1">
              <DollarSign className="w-4 h-4" />
              <span>Funded Programs</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {programsWithAid} of {schools.length}
            </div>
          </div>

          {/* Average Package */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-purple-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Average Package</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {settings.currency || '$'}{averagePackage.toLocaleString()}
            </div>
          </div>

          {/* Total Application Fees Invested */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-amber-400 mb-1">
              <CreditCard className="w-4 h-4" />
              <span>Application Fees Spent</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight">
              {settings.currency || '$'}{totalApplicationFees.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Empty State */}
      {schools.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 text-center border border-white/[0.08] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-4 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Programs Added Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
            Add universities and record their tuition, funding packages, or assistantships to generate financial comparisons.
          </p>
          <button
            onClick={() => setActiveTab('applications')}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#1a0f00] font-black rounded-full text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Your First University</span>
          </button>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-white/[0.08] overflow-hidden shadow-2xl flex flex-col">
          <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.01]">
            <h2 className="text-sm font-bold text-white tracking-wide">Program Cost & Financial Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-white/[0.02] text-slate-400 border-b border-white/[0.04] text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">University & Program</th>
                  <th className="px-4 py-4">Funding Type</th>
                  <th className="px-4 py-4">Application Fee</th>
                  <th className="px-4 py-4">Aid Offered</th>
                  <th className="px-4 py-4">Tuition Cost</th>
                  <th className="px-4 py-4">Estimated Living</th>
                  <th className="px-6 py-4 text-right">Net Out-of-Pocket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {fundingData.map(({ school, funding: fund, offered, tuition, living, netCost }) => (
                  <tr key={school.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-xs">{school.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{school.program}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium text-[11px]">
                        {fund?.fundingType || 'Self-funded'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-300 font-medium tabular-nums">
                      {settings.currency || '$'}{school.applicationFee || 0}
                    </td>
                    <td className="px-4 py-4 text-emerald-400 font-bold tabular-nums">
                      +{settings.currency || '$'}{offered.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-slate-300 tabular-nums">
                      {settings.currency || '$'}{tuition.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-slate-400 tabular-nums">
                      {settings.currency || '$'}{living.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-black tabular-nums text-sm ${netCost <= 0 ? 'text-emerald-400' : 'text-amber-300'}`}>
                        {settings.currency || '$'}{netCost.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundingComparisonView;
