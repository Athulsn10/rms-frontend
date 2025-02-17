import { useState, useEffect } from 'react';
import Login from '@/app/auth/login/login';
import BrandLogo from '@/assets/brandlogo';
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, LifeBuoy, User, ChevronDown, Menu, X, MapPin, ScanQrCode } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isRestuarant, setIsRestuarant] = useState(false);

    const userName = localStorage.getItem('user');
    const restuarant = localStorage.getItem('restuarant');
    const location = localStorage.getItem('city');

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const pushToPath = (path: string) => {
        navigate(`/${path}`)
        setIsMenuOpen(false);
    }

    useEffect(() => {
        if (restuarant && userName) {
            setIsRestuarant(true);
        }
    }, []);

    return (
        <>
            <nav className="bg-stone-50 shadow-sm sticky top-0 pt-2 overflow-hidden z-20">
                <div className="mx-0 md:px-16 py-3">
                    <div className="flex items-center justify-between mx-5 md:mx-1">
                        <div className="flex items-center gap-4 md:gap-6">
                            <div onClick={() => pushToPath("")} className="flex-shrink-0 cursor-pointer">
                                <BrandLogo />
                            </div>
                            {location &&
                                <div className="hidden md:flex items-center">
                                    <p className='flex items-center gap-2'><MapPin className="w-5 h-5" />{location}</p>
                                </div>
                            }
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            {userName && (
                                <div onClick={() => pushToPath("qrscanner")} className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
                                    <ScanQrCode className="w-5 h-5" />
                                    <span>Scan Qr</span>
                                </div>
                            )}
                            <div onClick={() => pushToPath("search")} className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
                                <Search className="w-5 h-5" />
                                <span>Search</span>
                            </div>
                            <div onClick={() => pushToPath("help")} className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
                                <LifeBuoy className="w-5 h-5" />
                                <span>Help</span>
                            </div>
                            {userName ? (
                                <>
                                    <div onClick={() => pushToPath(isRestuarant ? 'dashboard' : 'profile')} className='flex items-center gap-2 cursor-pointer'>
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <p className='font-bold'>{userName}</p>
                                    </div>
                                </>
                            ) : (
                                <Sheet>
                                    <SheetTrigger>
                                        <div className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
                                            <User className="w-5 h-5" />
                                            <span>Sign In</span>
                                        </div>
                                    </SheetTrigger>
                                    <SheetContent>
                                        <Login />
                                    </SheetContent>
                                </Sheet>
                            )}
                        </div>
                        <div className="md:hidden">
                            <button onClick={toggleMenu} className="p-2 rounded-md hover:bg-gray-100 focus:outline-none">
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
                    <div className="md:hidden border-t border-gray-200 h-screen  overflow-hidden" >
                        <div className="px-4 py-3 space-y-6 text-xl font-semibold  overflow-hidden ">
                            {userName && (
                                <div onClick={() => pushToPath("qrscanner")} className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
                                    <ScanQrCode className="w-5 h-5" />
                                    <span>Scan Qr</span>
                                </div>
                            )}
                            <div onClick={() => pushToPath("search")} className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
                                <Search className="w-5 h-5" />
                                <span>Search</span>
                            </div>
                            <div onClick={() => pushToPath("help")} className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
                                <LifeBuoy className="w-5 h-5" />
                                <span>Help</span>
                            </div>
                            {userName ? (
                                <>
                                    <div className='fixed bottom-14 left-0 m-4 pb-3'>
                                        <div onClick={() => pushToPath("profile")} className='flex items-center gap-2 cursor-pointer'>
                                            <Avatar>
                                                <AvatarImage src="https://github.com/shadcn.png" />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            <p className='font-bold'>{userName}</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Sheet>
                                    <SheetTrigger>
                                        <div className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
                                            <User className="w-5 h-5" />
                                            <span>Sign In</span>
                                        </div>
                                    </SheetTrigger>
                                    <SheetContent>
                                        <Login />
                                    </SheetContent>
                                </Sheet>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;