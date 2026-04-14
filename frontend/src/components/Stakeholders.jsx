import { motion } from 'framer-motion';
import { Sprout, Building2, HeartHandshake, Gavel } from 'lucide-react';

const stakeholders = [
    {
        icon: Sprout,
        title: "For Farmers",
        benefit: "Monetize Practices",
        desc: "Monetize your sustainable soil practices and agroforestry with guaranteed transparency.",
        color: "bg-emerald-50 text-emerald-600",
        delay: 0.1
    },
    {
        icon: Building2,
        title: "For Businesses",
        benefit: "Offset Footprint",
        desc: "Offset your footprint with 100% verified, high-impact carbon credits from trusted sources.",
        color: "bg-blue-50 text-blue-600",
        delay: 0.2
    },
    {
        icon: HeartHandshake,
        title: "For NGOs",
        benefit: "Verification Partner",
        desc: "Join as a verification partner to maintain ecosystem integrity and support local projects.",
        color: "bg-rose-50 text-rose-600",
        delay: 0.3
    },
    {
        icon: Gavel,
        title: "For Government",
        benefit: "Regulatory Compliance",
        desc: "Transparent oversight and regulatory compliance dashboard for national carbon goals.",
        color: "bg-amber-50 text-amber-600",
        delay: 0.4
    }
];

const Stakeholders = () => {
    return (
        <section id="ecosystem" className="py-24 bg-econe-white relative">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-econe-dark">
                            Built for the Entire <span className="text-gradient">Ecosystem.</span>
                        </h2>
                        <p className="text-lg text-econe-dark/60 leading-relaxed">
                            Econe connects all participants in the carbon economy through a unified, high-integrity platform.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-12 h-1 bg-econe-forest rounded-full" />
                        <div className="w-4 h-1 bg-econe-forest/20 rounded-full" />
                        <div className="w-4 h-1 bg-econe-forest/20 rounded-full" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stakeholders.map((person) => (
                        <motion.div
                            key={person.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: person.delay, duration: 0.5 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            className="group p-8 bg-white border border-econe-forest/5 rounded-[2.5rem] shadow-xl shadow-econe-forest/[0.02] hover:shadow-2xl hover:shadow-econe-forest/10 transition-all"
                        >
                            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-8 ${person.color} group-hover:scale-110 transition-transform`}>
                                <person.icon className="w-8 h-8" />
                            </div>
                            <p className="text-sm font-bold tracking-widest uppercase text-econe-forest/55 mb-2">{person.benefit}</p>
                            <h3 className="text-2xl font-bold mb-4 text-econe-dark">{person.title}</h3>
                            <p className="text-econe-dark/60 leading-relaxed">{person.desc}</p>

                            <motion.div
                                className="mt-8 flex items-center gap-2 text-econe-forest font-bold cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Learn More <span className="text-xl">→</span>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stakeholders;
