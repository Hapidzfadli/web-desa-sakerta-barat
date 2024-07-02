import Sidebar from "@/components/shared/Sidebar"

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    const loggedIn = {
      id : "1",
      email: "hapidzfadli@gmail.com",
      userId: "1",
      firstName : "Hapid",
      lastName : "Fadli",
      name: "hapidzfadli",
    }
    return (
        <main className="flex h-screen w-full font-inter">
        <Sidebar user={loggedIn} />
  
        <div className="flex size-full flex-col">
          <div className="root-layout">
            {/* <Image src="/icons/logo.svg" width={30} height={30} alt="logo" /> */}
            <div>
              {/* <MobileNav user={loggedIn} /> */}
            </div>
          </div>
          {children}
        </div>
      </main>
    )
  }
  