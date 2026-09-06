export function KvList({ rows }: { rows: [string, string][] }) {
    return (
        <div className="divide-y divide-stone-100">
            {rows.map(([label, value]) => (
                <div
                    key={label}
                    className="flex items-center justify-between gap-4 py-2 text-sm"
                >
                    <span className="text-stone-500">{label}</span>
                    <span className="max-w-[60%] text-right font-semibold text-stone-900">
                        {value}
                    </span>
                </div>
            ))}
        </div>
    );
}