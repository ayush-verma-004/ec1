import { motion } from 'framer-motion';
import { Shrub, Zap, Wind, Droplets } from 'lucide-react';

const stats = [
    { label: "Total Credits Generated", value: "1.2M+", delay: 0 },
    { label: "Active Verified Farmers", value: "48K", delay: 0.1 },
    { label: "CO2 Offset (Metric Tons)", value: "850K", delay: 0.2 }
];

const categories = [
    { icon: Shrub, name: "Soil Carbon", color: "from-emerald-400 to-emerald-600" },
    { icon: Wind, name: "Mass Biomass", color: "from-teal-400 to-teal-600" },
    { icon: Droplets, name: "Agroforestry", color: "from-blue-400 to-blue-600" },
    { icon: Zap, name: "Renewable Energy", color: "from-amber-400 to-amber-600" }
];

const MarketplaceHighlights = () => {
    return (
        <section id="marketplace" className="py-24 bg-econe-dark text-white relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-econe-emerald/20 blur-[150px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
                    {stats.map((stat) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: stat.delay }}
                            viewport={{ once: true }}
                            className="text-center lg:text-left"
                        >
                            <h4 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter">{stat.value}</h4>
                            <p className="text-econe-emerald font-medium uppercase tracking-[0.2em] text-sm">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="border-t border-white/10 pt-20">
                    <h3 className="text-3xl md:text-4xl font-bold mb-12 text-center">Featured Categories</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.map((cat, i) => (
                            <motion.div
                                key={cat.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10 }}
                                className="group relative h-48 rounded-[2rem] overflow-hidden glass-dark cursor-pointer"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-20 transition-opacity`} />
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <cat.icon className="w-7 h-7" />
                                    </div>
                                    <span className="font-bold text-lg">{cat.name}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MarketplaceHighlights;
