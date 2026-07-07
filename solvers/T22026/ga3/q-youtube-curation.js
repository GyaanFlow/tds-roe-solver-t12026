import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';
import { metadata } from './youtube-metadata.js';

export const id = 'q-youtube-metadata-filter-server';
export const title = 'Q1: Automated Video Curation Pipeline';

const Ot = [
  'https://www.youtube.com/watch?v=_C8kWso4ne4',
  'https://www.youtube.com/watch?v=_K_QIx1KGuA',
  'https://www.youtube.com/watch?v=-2uyzAqefyE',
  'https://www.youtube.com/watch?v=-aKFBoZpiqA',
  'https://www.youtube.com/watch?v=-ARI4Cz-awo',
  'https://www.youtube.com/watch?v=-oPuGc05Lxs',
  'https://www.youtube.com/watch?v=-s7e_Fy6NRU',
  'https://www.youtube.com/watch?v=-tyBEsHSv7w',
  'https://www.youtube.com/watch?v=0K_eZGS5NsU',
  'https://www.youtube.com/watch?v=1PkNiYlkkjo',
  'https://www.youtube.com/watch?v=2HfSFdPEFRg',
  'https://www.youtube.com/watch?v=3-4qAkFRpAk',
  'https://www.youtube.com/watch?v=3aVqWaLjqS4',
  'https://www.youtube.com/watch?v=3dt4OGnU5sM',
  'https://www.youtube.com/watch?v=3ohzBxoFHAY',
  'https://www.youtube.com/watch?v=44PvX0Yv368',
  'https://www.youtube.com/watch?v=4P4UxXK7WE8',
  'https://www.youtube.com/watch?v=5cvM-crlDvg',
  'https://www.youtube.com/watch?v=5i15qFTOk9A',
  'https://www.youtube.com/watch?v=5iWhQWVXosU',
  'https://www.youtube.com/watch?v=5pf0_bpNbkw',
  'https://www.youtube.com/watch?v=5PrZvPeUw60',
  'https://www.youtube.com/watch?v=6DI_7Zja8Zc',
  'https://www.youtube.com/watch?v=6fzep1rdQwg',
  'https://www.youtube.com/watch?v=6iF8Xb7Z3wQ',
  'https://www.youtube.com/watch?v=6tNS--WetLI',
  'https://www.youtube.com/watch?v=7DK70jLZBzY',
  'https://www.youtube.com/watch?v=803Ei2Sq-Zs',
  'https://www.youtube.com/watch?v=83-_3x2AjXI',
  'https://www.youtube.com/watch?v=8dTpNajxaH0',
  'https://www.youtube.com/watch?v=8v3how07th4',
  'https://www.youtube.com/watch?v=8xHT7GZndJA',
  'https://www.youtube.com/watch?v=8YbIwueDQx4',
  'https://www.youtube.com/watch?v=9-vOd0UzHKY',
  'https://www.youtube.com/watch?v=9N6a-VLBa2I',
  'https://www.youtube.com/watch?v=9Os0o3wzS_I',
  'https://www.youtube.com/watch?v=a48xeeo5Vnk',
  'https://www.youtube.com/watch?v=A5AcNuXPefY',
  'https://www.youtube.com/watch?v=acOktTcTVEQ',
  'https://www.youtube.com/watch?v=aCULcv_IQYw',
  'https://www.youtube.com/watch?v=afITiFR6vfw',
  'https://www.youtube.com/watch?v=aHC3uTkT9r8',
  'https://www.youtube.com/watch?v=ajrtAuDg3yw',
  'https://www.youtube.com/watch?v=aRQxMYoCOuI',
  'https://www.youtube.com/watch?v=au8xkSQW1kE',
  'https://www.youtube.com/watch?v=bD05uGo_sVI',
  'https://www.youtube.com/watch?v=bDhvCp3_lYw',
  'https://www.youtube.com/watch?v=BJ-VvGyQxho',
  'https://www.youtube.com/watch?v=bkpLhQd6YQM',
  'https://www.youtube.com/watch?v=Blw7OF_-hXk',
  'https://www.youtube.com/watch?v=bTMPwUgLZf0',
  'https://www.youtube.com/watch?v=ByGJQzlzxQg',
  'https://www.youtube.com/watch?v=BYpSfx7I6x4',
  'https://www.youtube.com/watch?v=cLNOADl17b4',
  'https://www.youtube.com/watch?v=cnjhHZNJEDk',
  'https://www.youtube.com/watch?v=CQ90L5jfldw',
  'https://www.youtube.com/watch?v=CqvZ3vGoGs0',
  'https://www.youtube.com/watch?v=crJVzc5Ct_s',
  'https://www.youtube.com/watch?v=CSHx6eCkmv0',
  'https://www.youtube.com/watch?v=cY2NXB_Tqq0',
  'https://www.youtube.com/watch?v=cYWiDiIUxQc',
  'https://www.youtube.com/watch?v=D0iCHFXHb_g',
  'https://www.youtube.com/watch?v=D2lwk1Ukgz0',
  'https://www.youtube.com/watch?v=D3JvDWO-BY4',
  'https://www.youtube.com/watch?v=D4IjxVPzb7k',
  'https://www.youtube.com/watch?v=daefaLgNkw0',
  'https://www.youtube.com/watch?v=dcqPhpY7tWk',
  'https://www.youtube.com/watch?v=DEwgZNC-KyE',
  'https://www.youtube.com/watch?v=Dh-0lAyc3Bc',
  'https://www.youtube.com/watch?v=DjEuROpsvp4',
  'https://www.youtube.com/watch?v=DkjCaAMBGWM',
  'https://www.youtube.com/watch?v=DZwmZ8Usvnk',
  'https://www.youtube.com/watch?v=e1skexBUb1M',
  'https://www.youtube.com/watch?v=e53tmzo-U3g',
  'https://www.youtube.com/watch?v=ecZZ8CvNQ6M',
  'https://www.youtube.com/watch?v=eirjjyP2qcQ',
  'https://www.youtube.com/watch?v=eXBD2bB9-RA',
  'https://www.youtube.com/watch?v=FdVuKt_iuSI',
  'https://www.youtube.com/watch?v=FKLr3ft8ea0',
  'https://www.youtube.com/watch?v=FPkHecI3y_4',
  'https://www.youtube.com/watch?v=FsAPt_9Bf3U',
  'https://www.youtube.com/watch?v=FVpho_UiDAY',
  'https://www.youtube.com/watch?v=g2eEQc1qEq0',
  'https://www.youtube.com/watch?v=g33-tYIs7zU',
  'https://www.youtube.com/watch?v=Gdys9qPjuKs',
  'https://www.youtube.com/watch?v=GfxJYp9_nJA',
  'https://www.youtube.com/watch?v=GkgMTyiLtWk',
  'https://www.youtube.com/watch?v=goToXTC96Co',
  'https://www.youtube.com/watch?v=gtjxAH8uaP0',
  'https://www.youtube.com/watch?v=Gxpg9vvT8hE',
  'https://www.youtube.com/watch?v=HAxm8n9QY50',
  'https://www.youtube.com/watch?v=HW29067qVWk',
  'https://www.youtube.com/watch?v=HYV81L7qd6M',
  'https://www.youtube.com/watch?v=IbUa1tTT-7k',
  'https://www.youtube.com/watch?v=iNEwkaYmPqY',
  'https://www.youtube.com/watch?v=IolxqkL7cD8',
  'https://www.youtube.com/watch?v=iv5m0c-8Opc',
  'https://www.youtube.com/watch?v=iWS9ogMPOI0',
  'https://www.youtube.com/watch?v=j4bhmlkpLfc',
  'https://www.youtube.com/watch?v=jCzT9XFZ5bw',
  'https://www.youtube.com/watch?v=JVQNywo4AbU',
  'https://www.youtube.com/watch?v=jxmzY9soFXg',
  'https://www.youtube.com/watch?v=k8asfUbWbI4',
  'https://www.youtube.com/watch?v=K8L6KVGG-7o',
  'https://www.youtube.com/watch?v=k9TUPpGqYTo',
  'https://www.youtube.com/watch?v=KB2CtEDrglY',
  'https://www.youtube.com/watch?v=KgCgpCIOkIs',
  'https://www.youtube.com/watch?v=khKv-8q7YmY',
  'https://www.youtube.com/watch?v=KlBPCzcQNU8',
  'https://www.youtube.com/watch?v=kt3ZtW9MXhw',
  'https://www.youtube.com/watch?v=KzqSDvzOFNA',
  'https://www.youtube.com/watch?v=lbY9r0rHTQc',
  'https://www.youtube.com/watch?v=Liv6eeb1VfE',
  'https://www.youtube.com/watch?v=Lu8lXXlstvM',
  'https://www.youtube.com/watch?v=LUFn-QVcmB8',
  'https://www.youtube.com/watch?v=m42FB3RY0TQ',
  'https://www.youtube.com/watch?v=M54UFvJqQ5I',
  'https://www.youtube.com/watch?v=mB0EBW-vDSQ',
  'https://www.youtube.com/watch?v=mkYBJwX_dMs',
  'https://www.youtube.com/watch?v=MwZwr5Tvyxo',
  'https://www.youtube.com/watch?v=mXR47qiTdWQ',
  'https://www.youtube.com/watch?v=N5vscPTWKOk',
  'https://www.youtube.com/watch?v=Na8h09Goovk',
  'https://www.youtube.com/watch?v=NDFbXIiqT4o',
  'https://www.youtube.com/watch?v=NDFMa5FSQuI',
  'https://www.youtube.com/watch?v=NeJKaolLQqU',
  'https://www.youtube.com/watch?v=ng2o98k983k',
  'https://www.youtube.com/watch?v=nghuHvKLhJA',
  'https://www.youtube.com/watch?v=NhidVhNHfeU',
  'https://www.youtube.com/watch?v=NIWwJbo-9_8',
  'https://www.youtube.com/watch?v=OdIHeg4jj2c',
  'https://www.youtube.com/watch?v=OebyvmZo3w0',
  'https://www.youtube.com/watch?v=OEJv74QnduA',
  'https://www.youtube.com/watch?v=Oh2Dkkswy30',
  'https://www.youtube.com/watch?v=pd-0G0MigUA',
  'https://www.youtube.com/watch?v=PSNXoAs2FtQ',
  'https://www.youtube.com/watch?v=PSWf2TjTGNY',
  'https://www.youtube.com/watch?v=PUIE7CPANfo',
  'https://www.youtube.com/watch?v=q4jPR-M0TAQ',
  'https://www.youtube.com/watch?v=q5uM4VKywbA',
  'https://www.youtube.com/watch?v=q7Bo_J8x_dw',
  'https://www.youtube.com/watch?v=qbLc5a9jdXo',
  'https://www.youtube.com/watch?v=qDwdMDQ8oX4',
  'https://www.youtube.com/watch?v=QErlGfPRoUU',
  'https://www.youtube.com/watch?v=qfWpPEgea2A',
  'https://www.youtube.com/watch?v=qJPw_IVEyfc',
  'https://www.youtube.com/watch?v=QnDWIZuWYW0',
  'https://www.youtube.com/watch?v=QVdf0LgmICw',
  'https://www.youtube.com/watch?v=QyhqzaMiFxk',
  'https://www.youtube.com/watch?v=r-uOLxNrNk8',
  'https://www.youtube.com/watch?v=R67XuYc9NQ4',
  'https://www.youtube.com/watch?v=rkzpx5Bkbek',
  'https://www.youtube.com/watch?v=roTZJaxjnJc',
  'https://www.youtube.com/watch?v=rq8cL2XMM5M',
  'https://www.youtube.com/watch?v=RSl87lqOXDE',
  'https://www.youtube.com/watch?v=S5Dn1HjBPA4',
  'https://www.youtube.com/watch?v=Sa_kQheCnds',
  'https://www.youtube.com/watch?v=St48epdRDZw',
  'https://www.youtube.com/watch?v=sugvnHA7ElY',
  'https://www.youtube.com/watch?v=Sw79_adeUR0',
  'https://www.youtube.com/watch?v=SwSbnmqk3zY',
  'https://www.youtube.com/watch?v=T6y2LRcX9qM',
  'https://www.youtube.com/watch?v=t8hG0WnyHgU',
  'https://www.youtube.com/watch?v=T9Jh_X134l4',
  'https://www.youtube.com/watch?v=tf3ezjeTpfI',
  'https://www.youtube.com/watch?v=tiBeLLv5GJo',
  'https://www.youtube.com/watch?v=TIZRskDMyA4',
  'https://www.youtube.com/watch?v=tJxcKyFMTGo',
  'https://www.youtube.com/watch?v=u0oDDZrDz9U',
  'https://www.youtube.com/watch?v=U2ZN104hIcc',
  'https://www.youtube.com/watch?v=Uh2ebFW8OYM',
  'https://www.youtube.com/watch?v=uHd7KDesmkM',
  'https://www.youtube.com/watch?v=UIJKdCIEXUQ',
  'https://www.youtube.com/watch?v=uL0-6kfiH3g',
  'https://www.youtube.com/watch?v=UlygQI2eSdg',
  'https://www.youtube.com/watch?v=UmljXZIypDc',
  'https://www.youtube.com/watch?v=uVNfQDohYNI',
  'https://www.youtube.com/watch?v=Vde5SH8e1OQ',
  'https://www.youtube.com/watch?v=ve2pmm5JqmI',
  'https://www.youtube.com/watch?v=vTX3IwquFkc',
  'https://www.youtube.com/watch?v=vuDCndpkutQ',
  'https://www.youtube.com/watch?v=vutyTx7IaAI',
  'https://www.youtube.com/watch?v=W8KRzm-HUcc',
  'https://www.youtube.com/watch?v=WbTOutpwPHs',
  'https://www.youtube.com/watch?v=Wfx4YBzg16s',
  'https://www.youtube.com/watch?v=WXsD0ZgxjRw',
  'https://www.youtube.com/watch?v=x3v9zMX1s4s',
  'https://www.youtube.com/watch?v=XBksHCvObhQ',
  'https://www.youtube.com/watch?v=xFciV6Ew5r4',
  'https://www.youtube.com/watch?v=XGa4onZP66Q',
  'https://www.youtube.com/watch?v=xLw9wf9uNuw',
  'https://www.youtube.com/watch?v=XMmfJFS_MFQ',
  'https://www.youtube.com/watch?v=Xnbef8F_Yfc',
  'https://www.youtube.com/watch?v=XrW2RaQnJYw',
  'https://www.youtube.com/watch?v=xwPWcFKeIac',
  'https://www.youtube.com/watch?v=xXibS9832FM',
  'https://www.youtube.com/watch?v=YJC6ldI3hWk',
  'https://www.youtube.com/watch?v=YST1sWFPDh4',
  'https://www.youtube.com/watch?v=YYXdXT2l-Gg',
  'https://www.youtube.com/watch?v=Z81JW1NTsO8'
];

function fisherYatesShuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getYoutubeId(url) {
  const match = url.match(/[?&]v=([^&#]+)/);
  return match ? match[1] : url;
}

export async function solve(email, sessionToken) {
  const norm = String(email || '').trim().toLowerCase();
  const salt = 'tds-2026-05-ga3-youtube-metadata-filter-v1';
  const rng = seedrandom(`${salt}#${norm}#`);

  const d = fisherYatesShuffle(Ot, rng).slice(0, 20 + Math.floor(rng() * 11));
  const u = [300, 420, 600];
  const i = [1800, 2100, 2400, 3e3];

  const minDuration = u[Math.floor(rng() * u.length)];
  const maxDuration = i[Math.floor(rng() * i.length)];
  const requiredWords = ["python"];
  const forbiddenWords = ["shorts", "live"];
  const limit = 8 + Math.floor(rng() * 8);

  const filtered = [];

  for (const url of d) {
    const meta = metadata[url];
    if (!meta) continue;

    const duration = meta.duration || 0;
    if (duration < minDuration || duration > maxDuration) continue;

    const combinedText = (meta.title + ' ' + meta.description).toLowerCase();
    const containsAllRequired = requiredWords.every(w => combinedText.includes(w));
    const containsAnyForbidden = forbiddenWords.some(w => combinedText.includes(w));

    if (containsAllRequired && !containsAnyForbidden) {
      filtered.push({
        url,
        upload_date: meta.upload_date || '',
        id: getYoutubeId(url)
      });
    }
  }

  filtered.sort((a, b) => {
    const dc = b.upload_date.localeCompare(a.upload_date);
    if (dc !== 0) return dc;
    return a.id.localeCompare(b.id);
  });

  const resultUrls = filtered.slice(0, limit).map(item => item.url);
  const answerObj = { urls: resultUrls };

  return {
    type: 'solved',
    answer: JSON.stringify(answerObj, null, 2),
    variant: `Curation limits: ${minDuration}s - ${maxDuration}s, limit: ${limit}`,
    answerDisplay: [
      `### Q1: Automated Video Curation Results`,
      `*Matches found:* ${filtered.length} (curated to top ${limit})`,
      `\`\`\`json`,
      JSON.stringify(answerObj, null, 2),
      `\`\`\``
    ].join('\n')
  };
}
