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

const REASONS = [
    'Wrong location',
    'Incorrect rent',
    'Already occupied',
    'Fake or duplicate report',
    'Unsafe or inappropriate content',
    'Privacy concern',
    'Other',
];

export function ReportIssueDialog({
    trigger,
}: {
    trigger: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);

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

                <RadioGroup className="gap-2">
                    {REASONS.map((reason) => (
                        <Label
                            key={reason}
                            className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 p-3 text-sm font-medium"
                        >
                            <RadioGroupItem value={reason} />
                            {reason}
                        </Label>
                    ))}
                </RadioGroup>

                <Textarea placeholder="Add details (optional)" />

                <DialogFooter>
                    <Button
                        className="w-full"
                        onClick={() => {
                            setOpen(false);
                            toast('Thank you — a moderator will review this');
                        }}
                    >
                        Submit report
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}