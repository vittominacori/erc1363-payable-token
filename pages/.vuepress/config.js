const vars = require('./.env.json');

module.exports = {
  title: 'An ERC-20 token that can be used for payments',
  description:
    'The ERC-1363 is an ERC-20 compatible token that can make a callback on the receiver contract to notify token transfers or token approvals',
  base: '/erc1363-payable-token/',
  plugins: [
    [
      'google-gtag',
      {
        ga: vars.gaId,
      },
    ],
  ],
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://vittominacori.github.io/erc1363-payable-token' }],
    [
      'meta',
      {
        property: 'og:image',
        content: 'https://vittominacori.github.io/erc1363-payable-token/assets/images/erc1363-payable-token.jpg',
      },
    ],
    ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
    [
      'meta',
      {
        property: 'twitter:image',
        content: 'https://vittominacori.github.io/erc1363-payable-token/assets/images/erc1363-payable-token.jpg',
      },
    ],
    [
      'meta',
      { property: 'twitter:title', content: 'ERC-1363 Payable Token | An ERC-20 token that can be used for payments' },
    ],
  ],
  themeConfig: {
    repo: 'vittominacori/erc1363-payable-token',
    sidebar: 'auto',
  },
};
