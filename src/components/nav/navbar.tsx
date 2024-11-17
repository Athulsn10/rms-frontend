import { useState } from 'react';
import BrandLogo from '@/assets/brandlogo';
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, LifeBuoy, User, ChevronDown, Menu, X, MapPin, ScanQrCode } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const pushToPath = (path: string) => {
        navigate(`/${path}`)
    }

    return (
        <>
            <nav className="bg-stone-50 shadow-sm sticky top-0">
                <div className="px-4 md:px-9 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 md:gap-6">
                            <div onClick={() => pushToPath("")} className="flex-shrink-0 cursor-pointer">
                                <BrandLogo />
                            </div>
                            <div className="hidden md:flex items-center">
                                <Popover>
                                    <PopoverTrigger className='md:flex items-center gap-1 cursor-pointer hover:text-swiggyOrange'>
                                        <span>Location</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </PopoverTrigger>
                                    <PopoverContent className='ms-16 mt-10 w-96'>
                                        {/* search Bar */}
                                        <div className='relative'>
                                            <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500' />
                                            <Input className='p-8 pt-0 pb-0 pr-0 font-medium' placeholder='Search Location' />
                                        </div>
                                        {/* Search Result */}
                                        <div className='h-64 flex items-center justify-center'>
                                            <p>Nothing yet.. under dev..</p>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <div onClick={() => pushToPath("qrscanner")} className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
                                <ScanQrCode className="w-5 h-5" />
                                <span>Scan Qr</span>
                            </div>
                            <div onClick={() => pushToPath("search")} className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
                                <Search className="w-5 h-5" />
                                <span>Search</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
                                <LifeBuoy className="w-5 h-5" />
                                <span>Help</span>
                            </div>
                            <div onClick={() => pushToPath("auth")} className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
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
                            <div onClick={() => pushToPath("qrscanner")} className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
                                <ScanQrCode className="w-4 h-4" />
                                <span>Scan Qr</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
                                <MapPin  className="w-4 h-4" />
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