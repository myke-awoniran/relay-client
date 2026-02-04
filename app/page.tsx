"use client";
import {useState} from "react";
import Input from "@/components/input";

type Outcome =
    | "Not Started"
    | "Dialing"
    | "Connected"
    | "Voicemail"
    | "No Answer"
    | "Qualified";

export default function Page() {
    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState<any>(null);

    async function startCall(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const form = new FormData(e.currentTarget);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/call`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: form.get("name"),
                company: form.get("company"),
                signal: form.get("signal"),
                context: form.get("context"),
                phone: form.get("phone"),
            }),
        });
        console.log(res);

        setSession(await res.json());
        setLoading(false);
    }

    const intentLabel = mapIntent(session?.intent_score);
    const outcome = mapOutcome(session?.status);
    const nextStep = generateNextStep(intentLabel, outcome);

    return (
        <>
            <header className="space-y-1">
                <h1 className="text-3xl font-semibold tracking-tight">Relay by Valley</h1>
                <p className="text-neutral-400">
                    {/*Turn signals into real-time qualification.*/}
                    your AI SDR that turns LinkedIn intent signals into real-time sales calls.
                </p>
            </header>

            <section className="grid lg:grid-cols-2 gap-10">

                {/* Input */}
                <form
                    onSubmit={startCall}
                    className=" backdrop-blur border border-neutral-800 rounded-xl p-6 space-y-4"
                >

                    <div className="text-neutral-400 space-y-2 rounded-xl font-bold text-lg-">
                        Initiate a call:
                    </div>

                    <Input name="name" label="Prospect name"/>
                    <Input name="company" label="Company"/>
                    <Input name="signal" label="Signal"/>
                    <Input name="context" label="Context"/>
                    <Input name="phone" label="Phone number"/>

                    <button
                        disabled={loading}
                        className="w-full mt-4 py-3 rounded-lg font-medium
               text-white
              disabled:opacity-50 bg-black hover:bg-gray-900 cursor-pointer
            "
                    >
                        {loading ? "Calling…" : "Start Call"}
                    </button>
                </form>

                {/* Output */}
                <div className="bg-neutral-100 backdrop-blur border border-neutral-800 rounded-xl p-6 space-y-8">

                    <div className="text-neutral-400 space-y-2 rounded-xl font-bold text-lg-">
                        Prospect Qualification:
                    </div>

                    {/* Status + Intent */}

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-neutral-800">
                                Outcome
                            </p>
                            <p className="text-sm mt-1">{outcome}</p>
                        </div>

                        {session?.intent_score !== undefined && (
                            <div className="px-3 py-1 rounded-full bg-white/10 text-sm">
                                {intentLabel} ({session.intent_score})
                            </div>
                        )}
                    </div>

                    <Divider/>

                    <Section title="Conversation">
            <pre className="text-sm text-neutral-800 whitespace-pre-wrap leading-relaxed">
              {session?.transcript || "Waiting for call…"}
            </pre>
                    </Section>

                    <Divider/>

                    <Section title="Qualification Summary">
                        <p className="text-neutral-800 leading-relaxed">
                            {session?.summary || "—"}
                        </p>
                    </Section>

                    <Divider/>

                    <Section title="Next Step">
                        <p className="text-neutral-800 leading-relaxed">
                            {nextStep}
                        </p>
                    </Section>

                </div>
            </section>
        </>
    );
}


function mapIntent(score?: number) {
    if (score === undefined) return "—";
    if (score >= 70) return "Hot";
    if (score >= 40) return "Warm";
    return "Cold";
}

function mapOutcome(status?: string): Outcome {
    switch (status) {
        case "connected":
            return "Connected";
        case "voicemail":
            return "Voicemail";
        case "no_answer":
            return "No Answer";
        case "qualified":
            return "Qualified";
        case "dialing":
            return "Dialing";
        default:
            return "Not Started";
    }
}

function generateNextStep(intent: string, outcome: Outcome) {
    if (outcome === "Qualified") return "Schedule demo with AE";
    if (intent === "Hot") return "Follow up within 24 hours";
    if (intent === "Warm") return "Send personalized LinkedIn message";
    if (intent === "Cold") return "Add to nurture sequence";
    return "Await call completion";
}

function Section({title, children}: any) {
    return (
        <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-neutral-400">
                {title}
            </p>
            {children}
        </div>
    );
}

function Divider() {
    return <div className="h-px bg-neutral-800"/>;
}