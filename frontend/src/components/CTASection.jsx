import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
    return (
        <section className="py-24 bg-econe-white">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-econe-forest rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden"
                >
                    {/* Decorative Circle */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-econe-emerald/20 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-bold mb-8">
                            Ready to Power the <br />
                            <span className="text-econe-emerald">Carbon-Neutral</span> Economy?
                        </h2>
                        <p className="text-lg md:text-xl text-white/70 mb-12">
                            Join thousands of farmers and global businesses already making a difference on the Econe marketplace.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto px-10 py-5 bg-white text-econe-forest rounded-full text-lg font-bold shadow-xl flex items-center justify-center gap-2"
                            >
                                Start Your Corporate Offset Journey
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto px-10 py-5 bg-econe-dark text-white rounded-full text-lg font-bold border border-white/10"
                            >
                                Register as a Generator
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
