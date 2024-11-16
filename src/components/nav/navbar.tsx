import { useState } from 'react';
import { Search, LifeBuoy, User, ChevronDown, Menu, X } from 'lucide-react';
import BrandLogo from '@/assets/brandlogo';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <nav className="bg-stone-50 shadow-sm">
                <div className="px-4 md:px-9 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="flex-shrink-0">
                                <BrandLogo />
                            </div>
                            <div className="hidden md:flex items-center gap-1 cursor-pointer hover:text-swiggyOrange">
                                <span>Location</span>
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <div className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
                                <Search className="w-5 h-5" />
                                <span>Search</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
                                <LifeBuoy className="w-5 h-5" />
                                <span>Help</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
                                <User className="w-5 h-5" />
                                <span>Sign In</span>
                            </div>
                        </div>
                        <div className="md:hidden">
                            <button
                                onClick={toggleMenu}
                                className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
                            >
                                {isMenuOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200">
                        <div className="px-4 py-3 space-y-3">
                            <div className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
                                <ChevronDown className="w-4 h-4" />
                                <span>Location</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
                                <Search className="w-5 h-5" />
                                <span>Search</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
                                <LifeBuoy className="w-5 h-5" />
                                <span>Help</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
                                <User className="w-5 h-5" />
                                <span>Sign In</span>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;