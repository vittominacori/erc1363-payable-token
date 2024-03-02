import { defineConfig } from 'vitepress';

const vars = require('./.env.json');

const title = 'ERC-1363 Payable Token | Reference implementation';
const description =
  'ERC-1363 is an extension interface for ERC-20 tokens that supports executing code on a recipient contract after transfers, or code on a spender contract after approvals, in a single transaction.';
const url = 'https://vittominacori.github.io/erc1363-payable-token';
const image = 'https://vittominacori.github.io/erc1363-payable-token/assets/images/erc1363-payable-token.jpg';
const repo = 'https://github.com/vittominacori/erc1363-payable-token.git';

export default defineConfig({
  title: 'ERC-1363 Payable Token',
  titleTemplate: 'Reference implementation',
  description: description,
  base: '/erc1363-payable-token/',
  head: [
    ['link', { rel: 'shortcut icon', href: '/erc1363-payable-token/favicon.ico' }],
    ['meta', { name: 'title', property: 'og:title', content: title }],
    ['meta', { name: 'description', property: 'og:description', content: description }],
    ['meta', { name: 'image', property: 'og:image', content: image }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:image', content: image }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'twitter:title', content: title }],
    ['meta', { property: 'twitter:description', content: description }],
    ['meta', { property: 'twitter:image', content: image }],
    ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
    ['script', { async: '', src: `https://www.googletagmanager.com/gtag/js?id=${vars.gaId}` }],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${vars.gaId}');`,
    ],
  ],
  themeConfig: {
    siteTitle: 'ERC-1363 Payable Token',
    socialLinks: [{ icon: 'github', link: repo }],
    search: {
      provider: 'local',
    },
  },
});
