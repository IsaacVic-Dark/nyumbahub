export function MetricStat({ value, label }: { value: string; label: string }) {
    return (
        <div className="text-center">
            <div className="text-2xl font-extrabold text-emerald-700 sm:text-3xl">
                {value}
            </div>
            <div className="mt-1 text-xs text-stone-500">{label}</div>
        </div>
    );
}