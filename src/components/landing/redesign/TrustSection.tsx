import React from 'react';
import { Shield, Lock, Award } from "lucide-react";

const TrustSection = () => {
    return (
        <section className="py-20 px-4 relative overflow-hidden bg-cosmic border-t border-white/5">
            <div className="max-w-[1300px] mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {[
                        { icon: Shield, title: "Private by Design", desc: "Your spiritual data is sacred. We don't sell it." },
                        { icon: Lock, title: "Encrypted Journal", desc: "Your reflections are for your eyes only." },
                        { icon: Award, title: "Verified Lineage", desc: "Sadhanas sourced from authentic traditions." }
                    ].map((item, index) => (
                        <div key={index} className="p-6 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#FFD54A]/5 flex items-center justify-center group-hover:bg-[#FFD54A]/10 transition-colors">
                                <item.icon className="w-6 h-6 text-[#FFD54A]/60 group-hover:text-[#FFD54A] transition-colors" />
                            </div>
                            <h3 className="text-lg text-white mb-2">{item.title}</h3>
                            <p className="text-white/50 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
