import CrispProvider from "@/components/crisp-provider";
import MobileSidebar from "@/components/navigation/mobile-sidebar";
import Sidebar from "@/components/navigation/sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import UserButton from "@/components/userButton";
import ProModalProvider from "@/context/pro-modal-provider";
import ProModal from "@/components/pro-modal";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();

  return (
    <ProModalProvider>
      <ProModal />
      <div className="relative h-screen grid grid-rows-[auto_1fr] md:grid-rows-none md:grid-cols-[auto_1fr] overflow-hidden">
        <CrispProvider />
        <Sidebar apiLimitCount={apiLimitCount} isPro={isPro} />
        <MobileSidebar apiLimitCount={apiLimitCount} isPro={isPro} />
        <UserButton />
        <main className="h-full overflow-auto bg-slate-100/70 p-2 pt-5">
          <div className="max-w-5xl mx-auto h-full">{children}</div>
        </main>
      </div>
    </ProModalProvider>
  );
};
export default layout;
