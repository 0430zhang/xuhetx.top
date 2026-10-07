export async function onRequestGet({ env }) {
    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
    };

    if (!env.COUNTER_KV) {
        return Response.json({ error: 'COUNTER_KV is not configured' }, { status: 503, headers });
    }

    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
    }).formatToParts(now);
    const year = parts.find((part) => part.type === 'year')?.value;
    const month = parts.find((part) => part.type === 'month')?.value;
    const monthKey = `month:${year}-${month}`;

    const [totalValue, monthValue] = await Promise.all([
        env.COUNTER_KV.get('total'),
        env.COUNTER_KV.get(monthKey),
    ]);
    const total = Number.parseInt(totalValue || '0', 10) + 1;
    const monthCount = Number.parseInt(monthValue || '0', 10) + 1;

    await Promise.all([
        env.COUNTER_KV.put('total', String(total)),
        env.COUNTER_KV.put(monthKey, String(monthCount)),
    ]);

    return Response.json({ total, month_count: monthCount }, { headers });
}
