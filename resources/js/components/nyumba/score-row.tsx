export function ScoreRow({
    label,
    score,
    note,
}: {
    label: string;
    score: number;
    note?: string;
}) {
    if (score <= 0) {
        return (
            <div className="flex items-center justify-between border-b border-dashed border-stone-200 py-2.5 text-sm">
                <span className="font-medium text-stone-900">{label}</span>
                <span className="text-stone-400 italic">{note}</span>
            </div>
        );
    }

    return (
        <div className="border-b border-dashed border-stone-200 py-2.5">
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-stone-900">{label}</span>
                <span className="text-stone-500">{score}/5</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: `${score * 20}%` }}
                />
            </div>
            {note && <p className="mt-1.5 text-xs text-stone-500">{note}</p>}
        </div>
    );
}