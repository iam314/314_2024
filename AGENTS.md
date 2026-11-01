## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Store / Payhip

The cart is loaded lazily (see the script at the end of `src/layouts/BaseLayout.astro`)
and initialised by `initPayhip()`, not by Payhip's own `window.load` hook — a
lazily-loaded Payhip never receives that event and would otherwise load inert
(no button handlers, no cart UI).

## Page transitions

Not enabled. The site intentionally uses normal full page loads: when the View
Transitions router swapped `<body>` it destroyed Payhip's injected cart DOM and
made the cart feel unreliable, so it was removed. The previous implementation
lives on the `feat/view-transitions` branch. Some scripts still carry
`astro:page-load` / `astro:after-swap` listeners and `data-astro-rerun`
attributes; they simply never fire without the router and are harmless.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
