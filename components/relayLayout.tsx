import {ReactNode} from "react";

export default function RelayLayout({children}: { children: ReactNode }) {
    return (
        <main className="relative min-h-screen bg-background text-foreground overflow-hidden">

            {/* Ambient background */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div
                    className="
    absolute inset-0
    opacity-[0.12] dark:opacity-[0.06]
    blur-[2px]
    mix-blend-multiply dark:mix-blend-screen
        [mask-image:radial-gradient(circle_at_50%_25%,black_0%,transparent_80%)]
    "
                    style={{
                        backgroundImage: `url("/images/BACKGROUND_IMAGE.PNG")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "min(1100px, 160vw)",
                    }}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background"/>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-10">
                {children}
            </div>
        </main>
    );
};