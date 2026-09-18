import Sidebar from "./Sidebar";
import DashboardTopbar from "./DashboardTopbar";
import FloatingAI from "./FloatingAI";

function PageLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen bg-[#f4f8f6]">
      <Sidebar />

      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-5 lg:py-6">
        <div className="w-full max-w-[1380px] mx-auto">
          <DashboardTopbar />

          {/* PAGE HEADER */}

          <header className="mt-7 mb-7">
            <h1
              className="
                m-0
                text-[26px]
                sm:text-[29px]
                font-bold
                tracking-[-0.7px]
                text-[#102a2a]
              "
            >
              {title}
            </h1>

            {subtitle && (
              <p
                className="
                  m-0
                  mt-2
                  max-w-[760px]
                  text-[14px]
                  leading-6
                  text-[#71817e]
                "
              >
                {subtitle}
              </p>
            )}
          </header>

          {/* PAGE CONTENT */}

          <div className="w-full">
            {children}
          </div>
        </div>
      </main>

      <FloatingAI />
    </div>
  );
}

export default PageLayout;