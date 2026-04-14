import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Database, RefreshCw } from 'lucide-react';

const techFeatures = [
    {
        icon: ShieldCheck,
        title: "Hashing on EosCarbon",
        desc: "Every transaction is cryptographically hashed, ensuring immutable proof of carbon sequestration.",
    },
    {
        icon: Cpu,
        title: "Spring Boot Security",
        desc: "Enterprise-grade security architecture with real-time threat monitoring and encryption.",
    },
    {
        icon: Database,
        title: "MongoDB Persistence",
        desc: "High-performance data storage for real-time coordination across global stakeholders.",
    },
    {
        icon: RefreshCw,
        title: "Real-time Sync",
        desc: "Automatic synchronization between field sensors, farmers, and the EosCarbon registry.",
    }
];

const TechnicalExcellence = () => {
    return (
        <section id="tech" className="py-24 bg-econe-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-econe-dark">
                                Technical <span className="text-gradient">Excellence</span> at Scale.
                            </h2>
                            <p className="text-lg text-econe-dark/60 leading-relaxed mb-12">
                                We&apos;ve built a robust infrastructure to ensure that every carbon credit is high-integrity, verified, and permanent. Our tech stack is designed for absolute transparency.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {techFeatures.map((item) => (
                                    <div key={item.title} className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-econe-forest/5 rounded-2xl flex items-center justify-center">
                                            <item.icon className="text-econe-forest w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-econe-dark mb-2">{item.title}</h4>
                                            <p className="text-sm text-econe-dark/60">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex-1 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                            className="relative aspect-square w-full max-w-lg mx-auto"
                        >
                            {/* Abstract Tech Visual */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-econe-forest/10 to-transparent rounded-[3rem] -rotate-6" />
                            <div className="absolute inset-0 glass rounded-[3rem] p-4 shadow-2xl overflow-hidden">
                                <div className="w-full h-full bg-econe-dark rounded-[2.5rem] relative overflow-hidden flex items-center justify-center">
                                    <div className="absolute inset-0 opacity-20">
                                        <div className="grid grid-cols-8 gap-4 p-4">
                                            {Array.from({ length: 64 }).map((_, i) => (
                                                <div key={i} className="h-4 bg-econe-emerald rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-center relative z-10">
                                        <div className="text-econe-emerald text-4xl font-mono mb-4 animate-pulse">#E3F9_X01</div>
                                        <div className="text-white/40 font-mono text-sm tracking-widest uppercase">Verified Block Hash</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TechnicalExcellence;
