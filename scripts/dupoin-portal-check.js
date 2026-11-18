// Runs INSIDE a logged-in tab of https://portal.dupoin.co.id (partner account), via the browser's JS tool.
// Input: the `members` array from https://dhirajkelly.id/admin/api/dupoin/pending.
// Output: { results } to POST to https://dhirajkelly.id/admin/api/dupoin/results (header x-csrf-token).
// It only reads the partner's own referral list (the same data shown on /ib/referrals) and changes nothing on Dupoin.
async function dtDupoinCheck(members) {
  const OWNER = 1655644; // partner UID of Dr. Dhiraj Kelly
  const now = Math.floor(Date.now() / 1000) + 86400;
  async function search(kw) {
    const body = { orderBy: 'joinedTime', isDesc: true, pageIndex: 1, pageSize: 20, refreshTotal: true, keyWord: kw, localTimeZone: 0,
      urlUserId: OWNER, dataTimeRange: { begin: 631126800, end: now }, joinedTimeRange: { begin: 0, end: 0 },
      lastActivityTimeRange: { begin: 0, end: 0 }, level: [], verification: 0, countryCode: [], loginUserId: OWNER };
    const r = await fetch('/api/v2/pro/member-report/referrer/list/tree/' + OWNER, {
      method: 'POST', credentials: 'include',
      headers: { Accept: 'application/json, text/plain, */*', 'Content-Type': 'application/json', 'x-cookie-prefix': 'CA_', lang: 'en-US' },
      body: JSON.stringify(body),
    });
    if (r.status === 401 || r.status === 403) throw new Error('NOT_LOGGED_IN');
    const j = await r.json();
    if (j.code !== 0) throw new Error('PORTAL_ERROR ' + j.code);
    return (j.data && j.data.items || []).filter((i) => !i.isOwner && i.userId !== OWNER);
  }
  const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));
  const results = [];
  for (const m of members) {
    const keys = [];
    for (const [k, by] of [[m.vantage_email, 'email Dupoin'], [m.email, 'email'], [m.vantage_account, 'no. akun']]) {
      const v = String(k || '').trim().toLowerCase();
      if (!v || keys.some((x) => x.v === v)) continue;
      if (by === 'no. akun' && !/^\d{6,}$/.test(v)) continue; // short numbers would match unrelated UIDs
      keys.push({ v, by });
    }
    const matches = [];
    for (const k of keys) {
      const items = await search(k.v);
      for (const i of items) matches.push({ uid: i.userId, verified: !!i.isVerification, accounts: i.accountCount || 0, level: i.memberLevel, by: k.by });
      if (items.length) break; // first identifier that hits wins
      await sleep(250);
    }
    results.push({ id: m.id, matches });
  }
  return { results };
}
