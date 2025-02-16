import Menu from "./menu";
import Orders from "./orders";
import Profile from "./profile";
import { useState } from "react";
import QRGenerator from "./QrGenerator";
import Analytics from "./analytics";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/app/context/provider";
import { User, ShoppingBag, LogOut, SquareMenu, QrCode, ChartPie } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarFooter, SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";


const items = [
    {
        title: "Menu",
        key: "menu",
        icon: SquareMenu,
    },
    {
        title: "Orders",
        key: "orders",
        icon: ShoppingBag,
    },
    {
        title: "Profile",
        key: "profile",
        icon: User,
    },
    {
        title:"Generate QR",
        key:'qr',
        icon: QrCode
    },
    {
        title:"AI Analytics",
        key:'analytics',
        icon: ChartPie
    },
    {
        title: "Logout",
        key: "logout",
        icon: LogOut,
    },
]

function Dashboard() {
    const navigate = useNavigate()
    const userName = localStorage.getItem('user');
    const base_url = import.meta.env.VITE_BASE_URL;
    const userEmail = localStorage.getItem('email');
    const [activeTab, setActiveTab] = useState("menu");
    const profileImage = localStorage.getItem('profile');
    const { setIsAuthenticated, setIsRestuarant } = useAppContext();
    const handleClick = (key: string, title: string) => {
        if (title === "Logout") {
            localStorage.clear();
            setIsAuthenticated(false);
            setIsRestuarant(false);
            navigate('/')
            return
        } else {
            activeTab === key;
        }
        setActiveTab(key)
    }

    return (
        <div className="flex">
            <SidebarProvider>
                <Sidebar variant="floating" collapsible="icon">
                    <SidebarHeader>
                    <SidebarTrigger className="md:flex sm:hidden ps-4" />
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Menu</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {items.map((item) => (
                                        <SidebarMenuItem key={item.title} className={`my-1 border-s-4 ps-1 ${activeTab == item.key ? 'border-orange-400' : 'border-transparent'}`}>
                                            <SidebarMenuButton
                                                className={`rounded-none py-6 hover:bg-orange-50 ${activeTab != item.key || 'bg-orange-100 hover:bg-orange-100'}`}
                                                onClick={() => handleClick(item.key, item.title)}
                                            >
                                                <item.icon />
                                                <span className={`${activeTab != item.key || 'font-bold'}`}>{item.title}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter className="gap-0 p-1 pb-2">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="py-6 px-0 p-0 items-center min-w-10">
                                    <Avatar className="rounded-lg w-8 h-8">
                                        <AvatarImage src={`${base_url}files/restaurants/${profileImage}`} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className='font-bold text-xs'>{userName}</p>
                                        <p className='font-medium text-xs'>{userEmail}</p>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>

                <main className="flex-1 p-4">
                    <SidebarTrigger className="lg:hidden" />
                    {activeTab === "menu" && <Menu />}
                    {activeTab === "profile" && <Profile />}
                    {activeTab === "orders" && <Orders />}
                    {activeTab === "qr" && <QRGenerator />}
                    {activeTab === "analytics" && <Analytics />}
                </main>
            </SidebarProvider>
        </div>
    )
}

export default Dashboard