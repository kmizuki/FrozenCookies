# Steam Local Development

FrozenCookies can be tested on the Steam version by pointing the Steam loader at your local checkout.

## Commands

1. Switch the Steam loader to local mode:
   `mise run steam-local`
2. Start a local file server from this repository:
   `mise run steam-serve`
3. To restore the published loader later:
   `mise run steam-prod`

You can also use the `bun` scripts directly:

- `bun run steam:use:local`
- `bun run steam:serve`
- `bun run steam:use:prod`
- `bun run steam:loader:status`

## Steam setup

1. Copy `Steam/FrozenCookies` into Cookie Clicker's `mods/local` directory.
2. Re-copy `Steam/FrozenCookies/main.js` into that installed folder whenever you switch between `local` and `prod`.
3. Restart Cookie Clicker and enable Frozen Cookies in `Options > Manage mods`.

`main.local.js` loads `http://127.0.0.1:8000/frozen_cookies.js`, so the local server must stay running while you test.
