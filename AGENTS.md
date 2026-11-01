## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Page transitions (view transitions)

Client-side navigation is enabled by `<ClientRouter />` in
`src/layouts/BaseLayout.astro`, and the animation lives in
`src/styles/transitions.css`.

To remove it and go back to normal full page loads:

1. In `src/layouts/BaseLayout.astro`, delete the `<ClientRouter />` component and
   the `import { ClientRouter } from 'astro:transitions';` line.
2. There, also delete `import '../styles/transitions.css';` (and optionally the
   file itself).
3. In `src/components/Nav.astro`, remove `data-astro-reload` from the Newsletter
   link.

That is all. The `astro:page-load` / `astro:after-swap` listeners in
`lyudmils.js`, `BaseLayout.astro` and `ProductGallery.astro`, and the
`data-astro-rerun` attributes on the store scripts, simply never fire without the
router and degrade to normal page loads.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
