/** Key/value rows. Rows with an empty value are skipped so missing data never shows as "undefined". */
export function KvList({ rows }: { rows: [string, string | null | undefined][] }) {
    const visible = rows.filter(([, v]) => v !== null && v !== undefined && v !== '');

    if (!visible.length) {
        return <p className="py-2 text-sm text-stone-400">Nothing reported yet.</p>;
    }

    return (
        <div className="divide-y divide-stone-100">
            {visible.map(([label, value]) => (
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
