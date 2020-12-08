# Budget Zen - Desktop

[![](https://github.com/BrunoBernardino/budgetzen-desktop/workflows/Run%20Tests/badge.svg)](https://github.com/BrunoBernardino/budgetzen-desktop/actions?workflow=Run+Tests)

This is the repo for the desktop electron app (macOS via App Store and Linux via Snapcraft). Website is at https://budgetzen.net

## Development

```bash
make install  # install dependencies
make start  # dev/run locally
make pretty  # runs prettier
make test  # runs lint + tests
```

## Deployment (macOS)

Make sure you've downloaded the appropriate `*.provisionprofile` from https://developer.apple.com/account/resources/profiles/list, save it as `BudgetZen-macOS.provisionprofile`

```bash
make deploy/mas  # packages to try locally
OSX_SIGN_IDENTITY=X OSX_FLAT_IDENTITY=Y make deploy/mas/prod  # signs app to upload via Transporter (the generated .pkg inside the app folder, not `make` — that one's not signed, intentionally)
```

`OSX_SIGN_IDENTITY` is the distribution/application identity, and the `OSX_FLAT_IDENTITY` is the installer identity.

To find available identities, run:

```bash
security find-identity -v
```

## Deployment (Linux)

```bash
make deploy/snap  # packages to try locally and upload (generated .snap file)
sudo snap install dist/budgetzen-desktop_*.snap  # installs app locally to try
make deploy/snap/prod  # uploads app via snapcraft
```

Upload file to https://snapcraft.io/budgetzen/listing

## TODOs:

- [ ] When running `make deploy`, update/write the package.json:buildHash and version properties automatically
- [ ] Properly tweak UI for dark/light mode
