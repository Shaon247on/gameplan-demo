import Navbar from "@/components/shared/Navbar";
import Sidebar from "@/components/shared/Sidebar";
import MainContent from "@/components/shared/MainContent";
import MobileBottomNav from "@/components/shared/MobileBottomNav";
import StoreProvider from "@/store/StoreProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { SidebarProvider } from "@/components/shared/SidebarContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <StoreProvider>
        <AuthProvider>
          <SidebarProvider>
            <div className="flex h-screen bg-gray-50">
              <Sidebar />
              <MainContent>
                <Navbar />
                <main className="flex-1 p-2 md:p-4 lg:p-6 overflow-auto">
                  {children}
                </main>
              </MainContent>
              <MobileBottomNav />
            </div>
          </SidebarProvider>
        </AuthProvider>
      </StoreProvider>
  );
}
