import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { api, getErrorMessage } from '@/lib/api';

// label shown to the user -> flag reason accepted by POST /api/flagged-contents
const REASONS: [string, string][] = [
    ['Wrong location', 'building_not_found'],
    ['Incorrect rent', 'information_inaccurate'],
    ['Already occupied', 'information_inaccurate'],
    ['Fake or duplicate report', 'fraud'],
    ['Unsafe or inappropriate content', 'safety'],
    ['Privacy concern', 'policy'],
    ['Other', 'policy'],
];

export function ReportIssueDialog({
    trigger,
    listingId,
}: {
    trigger: React.ReactNode;
    listingId: number;
}) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [details, setDetails] = useState('');
    const [sending, setSending] = useState(false);

    const submit = async () => {
        const match = REASONS.find(([label]) => label === reason);
        if (!match) {
            toast('Choose what is wrong first');

            return;
        }

        setSending(true);
        try {
            await api.post('/flagged-contents', {
                flaggable_type: 'listing',
                flaggable_id: listingId,
                reason: match[1],
                details: [reason, details.trim()].filter(Boolean).join(' — '),
            });
            setOpen(false);
            setReason('');
            setDetails('');
            toast('Thank you — a moderator will review this');
        } catch (e) {
            toast.error(getErrorMessage(e));
        } finally {
            setSending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Report an issue</DialogTitle>
                    <DialogDescription>
                        Tell us what is wrong. Reports go to NyumbaHub
                        moderators, not to the contributor.
                    </DialogDescription>
                </DialogHeader>

                <RadioGroup className="gap-2" value={reason} onValueChange={setReason}>
                    {REASONS.map(([label]) => (
                        <Label
                            key={label}
                            className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 p-3 text-sm font-medium"
                        >
                            <RadioGroupItem value={label} />
                            {label}
                        </Label>
                    ))}
                </RadioGroup>

                <Textarea
                    placeholder="Add details (optional)"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                />

                <DialogFooter>
                    <Button className="w-full" disabled={sending} onClick={() => void submit()}>
                        Submit report
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
