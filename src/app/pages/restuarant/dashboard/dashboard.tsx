import Menu from "./menu"
import Orders from "./orders"
import Profile from "./profile"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { User, ShoppingBag, LogOut, SquareMenu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarFooter, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"


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
        title: "Logout",
        key: "logout",
        icon: LogOut,
    },
]

function Dashboard() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("profile")
    const userName = localStorage.getItem('user');
    const userEmail = localStorage.getItem('email');
    const handleClick = (key: string, title: string) => {
        if (title === "Logout") {
            localStorage.clear()
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
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Menu</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {items.map((item) => (
                                        <SidebarMenuItem key={item.title} className="py-1">
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
                                        <AvatarImage src="https://github.com/shadcn.png" />
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
                    <SidebarTrigger />
                    {activeTab === "menu" && <Menu />}
                    {activeTab === "profile" && <Profile />}
                    {activeTab === "orders" && <Orders />}
                </main>
            </SidebarProvider>
        </div>
    )
}

export default Dashboard