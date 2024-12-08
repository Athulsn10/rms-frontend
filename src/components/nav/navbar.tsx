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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const pushToPath = (path: string) => {
        navigate(`/${path}`)
        setIsMenuOpen(false);
    }

    useEffect(()=>{
        if (restuarant && userName) {
            setIsRestuarant(true);
        }
    },[]);

    return (
        <>
            <nav className="bg-stone-50 shadow-sm sticky top-0 overflow-hidden">
                <div className="mx-0 md:px-16 py-3">
                    <div className="flex items-center justify-between mx-3">
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
                            <div className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
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
                            <Popover>
                                <PopoverTrigger className='flex items-center gap-2 cursor-pointer hover:text-swiggyOrange'>
                                    <MapPin className="w-4 h-4" />
                                    <span>Location</span>
                                </PopoverTrigger>
                                <PopoverContent className='mx-9 w-80'>
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
                            <div onClick={() => pushToPath("search")} className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
                                <Search className="w-5 h-5" />
                                <span>Search</span>
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer hover:text-swiggyOrange">
                                <LifeBuoy className="w-5 h-5" />
                                <span>Help</span>
                            </div>
                            {userName ? (
                                <>
                                    <div className='fixed bottom-0 left-0 m-4 pb-3'>
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