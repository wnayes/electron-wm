<p align="center">
  <a href="https://wnayes.github.io/bond-wm/" target="_blank" rel="noopener noreferrer">
    <img src="/assets/logo.svg" height="110px" alt="bond-wm logo">
  </a>
</p>
<p align="center">
  An X Window Manager built on web technologies.
</p>

### [Read the docs to get started 🔗](https://wnayes.github.io/bond-wm)

Bond Window Manager is a [X window manager](https://en.wikipedia.org/wiki/X_window_manager) gives web developers a familiar platform for total customization of their desktop appearance.

The goal is to thoughtfully apply front-end technologies to the desktop. Today this means:

- [Node.js](https://nodejs.org) driving a window manager core, which creates desktop and frame windows using [Electron](https://www.electronjs.org/) and its underlying Chromium engine.
- [Vite](https://vitejs.dev/) providing first class support for TypeScript, JSX, CSS modules, and more. Vite enables "hot module replacement" for rapid iteration on desktop styling.
- [React](https://react.dev/) as the primary supported UI library.

## Screenshot

![bond-wm screenshot](assets/screenshots/1.png?raw=true)

## Development

This repository uses the pnpm package manager. [Install pnpm](https://pnpm.io/installation) for your operating system.

To do prerequisite build steps:

    pnpm install
    pnpm build
    (Equivalent to `npm run build` if you prefer npm for running scripts.)

To start a test X server (requires Xephyr):

    pnpm startx

To start the window manager:

    pnpm start --config ./packages/react-config

Substitute your own config package with the default one above as desired.

## Usage

### Keyboard Shortcuts

The following shortcuts are supported:

(`Mod4` is typically the Windows key.)

| Shortcut                                  | Description                                                                                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `Mod4 + Enter`                            | Opens a new instance of your configured default terminal.                                                                                   |
| `Mod4 + Space`                            | Swaps between available layouts on the current screen.                                                                                      |
| `Mod4 + R`                                | Opens a basic run prompt in the desktop, where you can type a command like `firefox`. Type `=` to populate with the last submitted command. |
| `Mod4 + O`                                | Sends the active window to the next screen.                                                                                                 |
| `Mod4 + 1` ... `Mod4 + 9`                 | Switches to a different tag by index.                                                                                                       |
| `Mod4 + Shift + 1` ... `Mod4 + Shift + 9` | Sends the active window to a different tag by index.                                                                                        |
| `Mod4 + Shift + C`                        | Closes the focused window.                                                                                                                  |
| `Mod4 + Shift + Q`                        | Closes the window manager                                                                                                                   |
| `Mod4 + Ctrl + R`                         | Reloads the window manager                                                                                                                  |

Shortcuts are currently hard-coded in the wm.ts.

## License

[MIT License](LICENSE.md)

Individual packages within the repository sometimes have different licenses.
