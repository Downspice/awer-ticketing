import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  fallback: ["system-ui", "sans-serif"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  fallback: ["ui-monospace", "monospace"],
});

export const metadata: Metadata = {
  title: "Awer Ticketing - Support & Issue Tracker",
  description: "Modern, streamlined ticketing and project management system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex flex-col min-h-screen">
              <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md transition-all">
                <div className="flex items-center gap-2.5">
                  <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
                  <Separator
                    orientation="vertical"
                    className="mr-1 h-4 bg-border/60"
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm tracking-tight text-foreground">
                      Awer Ticketing
                    </span>
                    <span className="hidden sm:inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      Workspace
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ThemeToggle />
                </div>
              </header>

              <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto w-full">
                  {children}
                </div>
              </main>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
