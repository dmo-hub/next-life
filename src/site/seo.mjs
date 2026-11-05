// SEO หน้าแรก + sitemap (ui-redo 68): build ฉีดบล็อกระหว่าง marker ใน <head> ของหน้าแรก · og:title/og:description อ่านจาก <title>/description ของหน้าเอง แก้ที่เดียว
// sitemap มีเฉพาะหน้าไม่ติดรหัส (ข้อ 107) — หน้าติดรหัสทุกหน้า noindex อยู่แล้ว
// ภาพแชร์/ไอคอนสร้างด้วย npm run og (ต้องมี playwright-core) แล้ว commit ไฟล์ภาพ — build ไม่สร้างภาพ
export const SITE = 'https://dmo-hub.github.io/next-life/';
export const SEO_START = '<!--SEO:START-->';
export const SEO_END = '<!--SEO:END-->';
export const OG_IMAGE = 'og.png';
export const OG_W = 1200;
export const OG_H = 630;
export const FAVICON_SVG = 'favicon.svg';
export const FAVICON_PNG = 'favicon-32.png';
export const TOUCH_ICON = 'apple-touch-icon.png';
export const SITEMAP = 'sitemap.xml';
export const SITEMAP_PAGES = ['', 'play.html'];

const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const unattr = (s) => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

export function pageMeta(html, where) {
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = html.match(/<meta name="description" content="([^"]*)">/)?.[1];
  if (!title || !desc) throw new Error(`${where}: ต้องมี <title> และ <meta name="description"> ก่อนฉีด SEO`);
  return { title: unattr(title), desc: unattr(desc) };
}

// ชื่อเกมไทยคือส่วนก่อน " · " ของ title หน้าแรก
export function jsonLd({ title, desc }) {
  const name = title.split(' · ')[0];
  return [
    { '@context': 'https://schema.org', '@type': 'VideoGame', name, alternateName: 'Next Life', description: desc, inLanguage: 'th', gamePlatform: 'Web browser', applicationCategory: 'GameApplication', url: SITE, image: SITE + OG_IMAGE, offers: { '@type': 'Offer', price: '0', priceCurrency: 'THB' } },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Next Life', alternateName: name, url: SITE, inLanguage: 'th' },
  ];
}

export function seoBlock(meta) {
  const m = (k, v, key = 'property') => `<meta ${key}="${k}" content="${attr(v)}">`;
  return [
    `<link rel="canonical" href="${SITE}">`,
    m('og:type', 'website'),
    m('og:site_name', 'Next Life'),
    m('og:title', meta.title),
    m('og:description', meta.desc),
    m('og:locale', 'th_TH'),
    m('og:url', SITE),
    m('og:image', SITE + OG_IMAGE),
    m('og:image:width', String(OG_W)),
    m('og:image:height', String(OG_H)),
    m('og:image:alt', `${meta.title.split(' · ')[0]} · Next Life`),
    m('twitter:card', 'summary_large_image', 'name'),
    `<link rel="icon" href="${FAVICON_SVG}" type="image/svg+xml">`,
    `<link rel="icon" href="${FAVICON_PNG}" sizes="32x32" type="image/png">`,
    `<link rel="apple-touch-icon" href="${TOUCH_ICON}">`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd(meta)).replace(/</g, '\\u003c')}</script>`,
  ].join('\n');
}

export function injectSeo(html, where) {
  const body = `\n${seoBlock(pageMeta(html, where))}\n`;
  const a = html.indexOf(SEO_START);
  const b = html.indexOf(SEO_END);
  if (a < 0 || b < a || html.indexOf(SEO_START, a + 1) >= 0) throw new Error(`${where}: ต้องมี ${SEO_START} … ${SEO_END} ชุดเดียว`);
  return html.slice(0, a + SEO_START.length) + body + html.slice(b);
}

export const sitemapXml = (pages = SITEMAP_PAGES) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${SITE}${p}</loc></url>`).join('\n')}
</urlset>
`;

// ไอคอนจากดอกบัวของภาพฉากตาย (src/ui/art.mjs artLotus) บนพื้นรัก — path ล้วน ไม่พึ่งฟอนต์
export const faviconSvg = (ink) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="${ink.lacquer}"/><rect x="1.5" y="1.5" width="29" height="29" rx="5" fill="none" stroke="${ink.gold}" stroke-width="1"/><path d="M16 26q-6-10 0-18q6 8 0 18z" fill="${ink.gold2}"/><path d="M16 26q-12-4-14-12q10 0 14 12z" fill="${ink.bronze2}"/><path d="M16 26q12-4 14-12q-10 0-14 12z" fill="${ink.bronze2}"/></svg>
`;
