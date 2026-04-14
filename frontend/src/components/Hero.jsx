import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Server, Globe, Shield } from 'lucide-react';
import { useRef } from 'react';

const Hero = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);

    return (
        <section ref={containerRef} className="relative min-height-screen pt-24 pb-20 overflow-hidden bg-econe-white">
            {/* Abstract Background Elements */}
            <motion.div
                style={{ y: y1 }}
                className="absolute top-0 right-0 w-[600px] h-[600px] bg-econe-emerald/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"
            />
            <motion.div
                style={{ y: y1 }}
                className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-econe-forest/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4"
            />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-econe-forest/5 border border-econe-forest/10 text-econe-forest text-sm font-bold mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-econe-emerald opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-econe-emerald"></span>
                            </span>
                            V1.0 Live: Real-time Carbon Hashing
                        </span>

                        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-econe-dark leading-[0.95] mb-8">
                            Sustainable Future,<br />
                            <span className="text-gradient">Decoupled Carbon.</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-econe-dark/60 leading-relaxed mb-10 max-w-2xl mx-auto">
                            The world&apos;s first high-integrity marketplace connecting farmers, businesses, and regulators to power a carbon-neutral economy.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group px-8 py-4 bg-econe-forest text-white rounded-full text-lg font-bold shadow-2xl shadow-econe-forest/30 flex items-center gap-2"
                            >
                                Explore Marketplace
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(6, 78, 59, 0.05)' }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 border-2 border-econe-forest/20 rounded-full text-lg font-bold text-econe-forest flex items-center gap-2 transition-colors"
                            >
                                <Play className="w-5 h-5 fill-current" />
                                How it Works
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Floating Feature Cards */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Globe, title: "Global Reach", desc: "Access carbon credits from verified projects worldwide." },
                        { icon: Shield, title: "Hash Verified", desc: "Every ton of CO2 is cryptographically secured and traceable." },
                        { icon: Server, title: "Live Coordination", desc: "Seamless integration for businesses and regulators." }
                    ].map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
                            whileHover={{ y: -10 }}
                            className="p-8 glass rounded-3xl border border-econe-forest/5 hover:border-econe-forest/20 transition-colors"
                        >
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6">
                                <item.icon className="text-econe-emerald w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-econe-dark/60 leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
