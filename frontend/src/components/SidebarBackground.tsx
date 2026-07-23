export function SidebarBackground() {
    return (
        <>
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-red-600 rounded-full filter blur-[90px] opacity-80 z-[-1] animate-pulse"></div>
            <div className="absolute top-1/2 -translate-y-1/2 -left-10 w-64 h-64 bg-red-500 rounded-full filter blur-[80px] opacity-60 z-[-1]"></div>
            <div className="absolute -bottom-10 -right-20 w-80 h-80 bg-red-700 rounded-full filter blur-[100px] opacity-70 z-[-1]"></div>
        </>
    );
}