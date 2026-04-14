import { Leaf, Send } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-econe-white border-t border-econe-forest/10 pt-20 pb-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-econe-forest rounded-lg flex items-center justify-center">
                                <Leaf className="text-econe-emerald w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-econe-dark">Econe.</span>
                        </div>
                        <p className="text-econe-dark/60 leading-relaxed mb-8">
                            Decoupling carbon, fueling the future. The world&apos;s most trusted carbon marketplace.
                        </p>
                        <div className="flex gap-4">
                            {['Twitter', 'LinkedIn', 'Instagram'].map(social => (
                                <a key={social} href="#" className="w-10 h-10 rounded-full bg-econe-forest/5 flex items-center justify-center hover:bg-econe-forest hover:text-white transition-colors">
                                    <span className="sr-only">{social}</span>
                                    <div className="w-5 h-5 bg-current opacity-20" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Platform</h4>
                        <ul className="space-y-4 text-econe-dark/60">
                            <li><a href="#" className="hover:text-econe-forest transition-colors">Marketplace</a></li>
                            <li><a href="#" className="hover:text-econe-forest transition-colors">Project Submission</a></li>
                            <li><a href="#" className="hover:text-econe-forest transition-colors">Verification Nodes</a></li>
                            <li><a href="#" className="hover:text-econe-forest transition-colors">Live Dashboard</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Resources</h4>
                        <ul className="space-y-4 text-econe-dark/60">
                            <li><a href="#" className="hover:text-econe-forest transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-econe-forest transition-colors">Ecosystem Integrity</a></li>
                            <li><a href="#" className="hover:text-econe-forest transition-colors">Case Studies</a></li>
                            <li><a href="#" className="hover:text-econe-forest transition-colors">Contact Support</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Stay Updated</h4>
                        <p className="text-sm text-econe-dark/60 mb-6">Join our newsletter for the latest in carbon tech.</p>
                        <form className="relative">
                            <input
                                type="email"
                                placeholder="eco@econe.com"
                                className="w-full bg-econe-forest/5 border border-econe-forest/10 rounded-full py-3 px-6 focus:outline-none focus:border-econe-forest transition-colors"
                            />
                            <button className="absolute right-2 top-1.5 p-1.5 bg-econe-forest text-white rounded-full hover:bg-econe-dark transition-colors">
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                        <div className="mt-6 text-sm text-econe-dark/40">
                            Questions? <a href="mailto:ceo@econe.com" className="text-econe-forest underline">ceo@econe.com</a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-econe-forest/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-econe-dark/40">
                    <p>© 2026 Econe Carbon Marketplace. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-econe-forest transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-econe-forest transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
