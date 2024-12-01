import { useState } from "react"
import Orders from "../orders/orders"
import { useNavigate } from "react-router-dom"
import ProfileContent from "./profileContent"
import { User, ShoppingBag, LogOut } from "lucide-react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"


const items = [
  {
    title: "Profile",
    key: "profile",
    icon: User,
  },
  {
    title: "My Orders",
    key: "orders",
    icon: ShoppingBag,
  },
  {
    title: "Logout",
    key: "logout",
    icon: LogOut,
  },
]

function Profile() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("profile")

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
        <Sidebar variant="floating" collapsible="icon" className="mt-20">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        onClick={() => handleClick(item.key, item.title)}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-6">
          <SidebarTrigger />
          {activeTab === "profile" && <ProfileContent />}
          {activeTab === "orders" && <Orders />}
        </main>
      </SidebarProvider>
    </div>
  )
}

export default Profile