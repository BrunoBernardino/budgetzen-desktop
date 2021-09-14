# Budget Zen - Desktop

[![](https://github.com/BrunoBernardino/budgetzen-desktop/workflows/Run%20Tests/badge.svg)](https://github.com/BrunoBernardino/budgetzen-desktop/actions?workflow=Run+Tests)

This is the repo for the desktop electron app (macOS via local build, Linux via Snapcraft, Windows via download). Website is at https://budgetzen.net

**NOTE**: The app is no longer available in the App Store for ideological reasons. You can still build it from this repo yourself, or download + install the EXE from the [Releases page](https://github.com/BrunoBernardino/budgetzen-desktop/releases). Personally, I'm using the [web app version](https://app.budgetzen.net) now for both mobile and desktop, though.

## Development

```bash
make install  # install dependencies
make start  # dev/run locally
make pretty  # runs prettier
make test  # runs lint + tests
```

## Deployment (macOS)

```bash
make build/macos  # packages to try locally and upload to releases (generated .pkg file)
```

See [an older commit](https://github.com/BrunoBernardino/budgetzen-desktop/tree/85353436fc79eaa594b6f2500fbadc06d238a638#deployment-macos) for other commands, related to publishing to the Mac App Store.

## Deployment (Linux)

```bash
make build/snap  # packages to try locally and upload to snap store (generated .snap file)
sudo snap install dist/budgetzen-desktop_*.snap  # installs app locally to try
make deploy/snap  # uploads app via snapcraft to https://snapcraft.io/budgetzen/listing
```

## Deployment (Windows)

```bash
make build/win  # packages to try locally and upload (generated .exe file) -- requires `wine` to be installed (`brew install --cask wine-stable`) if running on macOS
wine install dist/Budget*.exe  # installs app locally to try
```

## TODOs:

- [ ] Create script/command to build a .appimage for linux in addition to snap store
- [ ] When running `make deploy`, update/write the package.json:buildHash and version properties automatically
- [ ] Properly tweak UI for dark/light mode
