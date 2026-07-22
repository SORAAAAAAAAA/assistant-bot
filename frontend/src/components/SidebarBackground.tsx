export function SidebarBackground() {
    return (
        <>
            {/* 1. Permanent Dark Red Base to decouple it from the main page background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#4a0808] via-[#2d0404] to-[#170000] z-[-2]"></div>

            {/* 2. Red Glowing Blobs (mix-blend-multiply removed, opacity adjusted for the dark base) */}
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-red-600 rounded-full filter blur-[90px] opacity-40 z-[-1] animate-pulse"></div>
            <div className="absolute top-1/2 -translate-y-1/2 -left-10 w-64 h-64 bg-red-500 rounded-full filter blur-[80px] opacity-30 z-[-1]"></div>
            <div className="absolute -bottom-10 -right-20 w-80 h-80 bg-red-700 rounded-full filter blur-[100px] opacity-40 z-[-1]"></div>
        </>
    );
}