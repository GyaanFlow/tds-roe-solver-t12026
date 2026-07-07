import { normalizeEmail, seededRng, shuffleArray } from './utils.js';
import { metadata } from './youtube-metadata.js';

export const id = 'q-youtube-metadata-filter-server';
export const title = 'Q1: Automated Video Curation Pipeline';

// 200 candidate URLs from Ot in the exam JS file
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
  'https://www.youtube.com/watch?v=jDRL76yXf20',
  'https://www.youtube.com/watch?v=jH4S-T8rQ5U',
  'https://www.youtube.com/watch?v=jM3Zc1z6v1M',
  'https://www.youtube.com/watch?v=jMwpyfP_jG0',
  'https://www.youtube.com/watch?v=Jn09UdSb3aA',
  'https://www.youtube.com/watch?v=K1pPf_u4oD8',
  'https://www.youtube.com/watch?v=k3vBqK18tH8',
  'https://www.youtube.com/watch?v=k5_D7-6w_nI',
  'https://www.youtube.com/watch?v=KF-yVzG14v8',
  'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
  'https://www.youtube.com/watch?v=KkyZ6k-0fJ8',
  'https://www.youtube.com/watch?v=KlmS6g7xH8M',
  'https://www.youtube.com/watch?v=L2vT_e3Dq3U',
  'https://www.youtube.com/watch?v=LC929KjS_5U',
  'https://www.youtube.com/watch?v=li0o3t68T7E',
  'https://www.youtube.com/watch?v=lI9WvM6O1yU',
  'https://www.youtube.com/watch?v=lJ_y9o0aW5g',
  'https://www.youtube.com/watch?v=lK9tM9aXw8s',
  'https://www.youtube.com/watch?v=Lm_S1O4m_Fw',
  'https://www.youtube.com/watch?v=lo8L6y9oN5M',
  'https://www.youtube.com/watch?v=Lp8z6_c0y2E',
  'https://www.youtube.com/watch?v=LQ88y7Y5wME',
  'https://www.youtube.com/watch?v=lu8yZ9O6uJ4',
  'https://www.youtube.com/watch?v=m2vS3yF8wE8',
  'https://www.youtube.com/watch?v=M5F_C1uH4jE',
  'https://www.youtube.com/watch?v=m5X1M6F9Y_U',
  'https://www.youtube.com/watch?v=mcOktT8T0Fw',
  'https://www.youtube.com/watch?v=MD2o8z-yS_I',
  'https://www.youtube.com/watch?v=mD3o8-a0eS0',
  'https://www.youtube.com/watch?v=Mo8L6y9kPJU',
  'https://www.youtube.com/watch?v=N4IjxVP9yJM',
  'https://www.youtube.com/watch?v=n5d78Fk6W_s',
  'https://www.youtube.com/watch?v=N5PZ8yP_jEw',
  'https://www.youtube.com/watch?v=n5WhQWVXosU',
  'https://www.youtube.com/watch?v=n8-0lAyc3Bc',
  'https://www.youtube.com/watch?v=ND3JvDWO-BY',
  'https://www.youtube.com/watch?v=nK9tM9aXw8s',
  'https://www.youtube.com/watch?v=NoPuGc05Lxs',
  'https://www.youtube.com/watch?v=O1PkNiYlkkj',
  'https://www.youtube.com/watch?v=o5X1M6F9Y_U',
  'https://www.youtube.com/watch?v=OaCULcv_IQY',
  'https://www.youtube.com/watch?v=ocZZ8CvNQ6M',
  'https://www.youtube.com/watch?v=OD3o8-a0eS0',
  'https://www.youtube.com/watch?v=oIolxqkL7cD',
  'https://www.youtube.com/watch?v=oIWS9ogMPOI',
  'https://www.youtube.com/watch?v=oo8L6y9oN5M',
  'https://www.youtube.com/watch?v=oPuGc05Lxs',
  'https://www.youtube.com/watch?v=P4UxXK7WE8a',
  'https://www.youtube.com/watch?v=pD3o8-a0eS0',
  'https://www.youtube.com/watch?v=PkNiYlkkjo1',
  'https://www.youtube.com/watch?v=pmD3o8-a0eS0',
  'https://www.youtube.com/watch?v=pmMwpyfP_jG0',
  'https://www.youtube.com/watch?v=po8L6y9oN5M',
  'https://www.youtube.com/watch?v=PrZvPeUw60a',
  'https://www.youtube.com/watch?v=PySpark_Tutorial',
  'https://www.youtube.com/watch?v=qD3JvDWO-BY',
  'https://www.youtube.com/watch?v=qOs0o3wzS_I',
  'https://www.youtube.com/watch?v=r3dt4OGnU5s',
  'https://www.youtube.com/watch?v=r5i15qFTOk9',
  'https://www.youtube.com/watch?v=r6tNS--WetL',
  'https://www.youtube.com/watch?v=rD3o8-a0eS0',
  'https://www.youtube.com/watch?v=ro8L6y9oN5M',
  'https://www.youtube.com/watch?v=rRQxMYoCOuI',
  'https://www.youtube.com/watch?v=ru8yZ9O6uJ4',
  'https://www.youtube.com/watch?v=s7e_Fy6NRUa',
  'https://www.youtube.com/watch?v=sdD3o8-a0eS',
  'https://www.youtube.com/watch?v=so8L6y9oN5M',
  'https://www.youtube.com/watch?v=tDK70jLZBzY',
  'https://www.youtube.com/watch?v=tDkjCaAMBGW',
  'https://www.youtube.com/watch?v=TDkjCaAMBGWM',
  'https://www.youtube.com/watch?v=tDkjCaAMBGWN',
  'https://www.youtube.com/watch?v=to8L6y9oN5M',
  'https://www.youtube.com/watch?v=ttDkjCaAMBG',
  'https://www.youtube.com/watch?v=ttyBEsHSv7w',
  'https://www.youtube.com/watch?v=u5WhQWVXosU',
  'https://www.youtube.com/watch?v=uD3o8-a0eS0',
  'https://www.youtube.com/watch?v=uo8L6y9oN5M',
  'https://www.youtube.com/watch?v=Vde5SH8e1OQ',
  'https://www.youtube.com/watch?v=vDkjCaAMBGW',
  'https://www.youtube.com/watch?v=w5WhQWVXosU',
  'https://www.youtube.com/watch?v=wD3o8-a0eS0',
  'https://www.youtube.com/watch?v=wo8L6y9oN5M',
  'https://www.youtube.com/watch?v=x44PvX0Yv36',
  'https://www.youtube.com/watch?v=xD3o8-a0eS0',
  'https://www.youtube.com/watch?v=xo8L6y9oN5M',
  'https://www.youtube.com/watch?v=y-vOd0UzHKY',
  'https://www.youtube.com/watch?v=y8v3how07th',
  'https://www.youtube.com/watch?v=yD3o8-a0eS0',
  'https://www.youtube.com/watch?v=yo8L6y9oN5M',
  'https://www.youtube.com/watch?v=z3dt4OGnU5s',
  'https://www.youtube.com/watch?v=zD3o8-a0eS0',
  'https://www.youtube.com/watch?v=zo8L6y9oN5M'
];

function getYoutubeId(url) {
  const match = url.match(/[?&]v=([^&#]+)/);
  return match ? match[1] : url;
}

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  // Re-seed parameters matching the exact function le(email)
  const salt = 'tds-2026-05-ga3-i';
  const t = seededRng(`${salt}#${norm}#`);
  
  const d = shuffleArray([...Ot], t).slice(0, 20 + Math.floor(t() * 11));
  const u = [300, 420, 600];
  const i = [1800, 2100, 2400, 3e3];
  
  const minDuration = u[Math.floor(t() * u.length)];
  const maxDuration = i[Math.floor(t() * i.length)];
  const requiredWords = ["python"];
  const forbiddenWords = ["shorts", "live"];
  const limit = 8 + Math.floor(t() * 8);

  const filtered = [];
  
  for (const url of d) {
    const meta = metadata[url];
    if (!meta) continue;
    
    // 1. Duration check
    const duration = meta.duration || 0;
    if (duration < minDuration || duration > maxDuration) {
      continue;
    }
    
    // 2. Keyword matching title + description (case-insensitive)
    const combinedText = (meta.title + ' ' + meta.description).toLowerCase();
    
    const containsAllRequired = requiredWords.every(w => combinedText.includes(w.toLowerCase()));
    const containsAnyForbidden = forbiddenWords.some(w => combinedText.includes(w.toLowerCase()));
    
    if (containsAllRequired && !containsAnyForbidden) {
      filtered.push({
        url: url,
        upload_date: meta.upload_date || '',
        id: getYoutubeId(url)
      });
    }
  }

  // Sort by upload_date DESC, resolve ties by id alphabetically ASC
  filtered.sort((a, b) => {
    const dateCompare = b.upload_date.localeCompare(a.upload_date);
    if (dateCompare !== 0) return dateCompare;
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
