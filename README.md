# Budgets, calm.

[![](https://github.com/BrunoBernardino/BudgetsCalm-desktop/workflows/Run%20Tests/badge.svg)](https://github.com/BrunoBernardino/BudgetsCalm-desktop/actions?workflow=Run+Tests)

This is the repo for the desktop electron/macOS app. Website is at https://budgets.calm.sh

## Development

```bash
make install  # install dependencies
make start  # dev/run locally
make pretty  # runs prettier
make test  # runs lint + tests
```

## Deployment

Make sure you've downloaded the appropriate `*.provisionprofile` from https://developer.apple.com/account/resources/profiles/list, save it as `BudgetsCalm-macOS.provisionprofile`

```bash
make deploy  # packages to try locally
OSX_SIGN_IDENTITY=X OSX_FLAT_IDENTITY=Y make deploy/prod  # signs app to upload via Transporter (the generated .pkg inside the app folder, not make — that one's not signed, intentionally)
```

`OSX_SIGN_IDENTITY` is the distribution/application identity, and the `OSX_FLAT_IDENTITY` is the installer identity.

To find available identities, run:

```bash
security find-identity -v
```

## TODOs:

- [ ] When running `make deploy`, update/write the package.json:build and buildVersion automatically
- [ ] Properly tweak UI for dark/light mode
