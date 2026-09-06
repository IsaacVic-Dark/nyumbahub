import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ReportIssueDialog } from '@/components/nyumba/report-issue-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { QUICK_QUESTIONS } from '@/lib/nyumba-data';
import { cn } from '@/lib/utils';

type Message = { from: 'me' | 'them'; text: string };

const INITIAL_MESSAGES: Message[] = [
    { from: 'them', text: 'Hi! Was water reliable during the dry months?' },
    {
        from: 'me',
        text: 'Mostly yes. There were a few mornings in January when the tank ran low, but it was refilled by midday.',
    },
    { from: 'them', text: 'What was the actual monthly cost including everything?' },
    {
        from: 'me',
        text: 'Rent 22,000 plus roughly 700 for water and 200 garbage. Electricity is prepaid, I used about 800 a month.',
    },
];

export default function Messages() {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [draft, setDraft] = useState('');

    const send = () => {
        if (!draft.trim()) return;
        setMessages((prev) => [...prev, { from: 'me', text: draft.trim() }]);
        setDraft('');
        toast('Sent');
    };

    return (
        <div className="mx-auto max-w-2xl py-6 pb-16">
            <Head title="Questions and messages" />

            <h1 className="text-2xl font-extrabold text-stone-900">
                Questions and messages
            </h1>
            <p className="mt-1 text-sm text-stone-500">
                Private, optional questions between a house seeker and a
                former tenant. This is not an agent lead system.
            </p>

            <p className="mt-4 rounded-lg bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800">
                🔐 Phone numbers are hidden by default. Never share ID
                numbers, M-Pesa details or documents in chat.
            </p>

            <Card className="mt-4 p-5">
                <h3 className="font-bold text-stone-900">Message request</h3>
                <div className="mt-3 flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-full bg-stone-100 text-sm font-bold text-stone-600">
                        JK
                    </div>
                    <div>
                        <b className="text-sm text-stone-900">A house seeker</b>
                        <p className="text-xs text-stone-400">
                            Wants to ask about your Ruaka report
                        </p>
                    </div>
                </div>
                <p className="mt-3 text-sm text-stone-700">
                    &ldquo;Was water reliable during the dry months?&rdquo;
                </p>
                <div className="mt-3 flex gap-2">
                    <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => toast('Request accepted')}
                    >
                        Accept
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={() => toast('Request declined')}
                    >
                        Decline
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast('Ignored')}
                    >
                        Ignore
                    </Button>
                </div>
            </Card>

            <Card className="mt-4 p-5">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-stone-900">
                        Conversation · Ruaka 1-bedroom
                    </h3>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast('User blocked')}
                        >
                            Block
                        </Button>
                        <ReportIssueDialog
                            trigger={
                                <Button variant="ghost" size="sm">
                                    Report
                                </Button>
                            }
                        />
                    </div>
                </div>
                <p className="mt-1 text-xs text-stone-400">
                    Auto-expiry: this conversation closes in 30 days. ⏳
                </p>

                <div className="mt-4 flex flex-col gap-2">
                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={cn(
                                'max-w-[80%] rounded-2xl px-3.5 py-2 text-sm',
                                m.from === 'me'
                                    ? 'ml-auto bg-emerald-700 text-white'
                                    : 'bg-stone-100 text-stone-800',
                            )}
                        >
                            {m.text}
                        </div>
                    ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                    {QUICK_QUESTIONS.map((q) => (
                        <button
                            key={q}
                            onClick={() => setDraft(q)}
                            className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:border-stone-300"
                        >
                            {q}
                        </button>
                    ))}
                </div>

                <div className="mt-3 flex gap-2">
                    <Input
                        placeholder="Write a message…"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && send()}
                    />
                    <Button onClick={send}>Send</Button>
                </div>
                <p className="mt-2 text-xs text-stone-400">
                    Safety: NyumbaHub staff will never ask for payment in
                    chat. Report anyone who requests money to
                    &ldquo;reserve&rdquo; a house.
                </p>
            </Card>
        </div>
    );
}