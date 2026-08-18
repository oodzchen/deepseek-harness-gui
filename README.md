# deepseek-harness-gui

[中文](README.zh.md) | English

A small dsh bundle that opens the existing dsh Web GUI in a native [Glimpse](https://github.com/hazat/glimpse) window. It intentionally contains no second chat implementation and no RPC bridge: the window navigates to the bound localhost Web server.

## Screenshots

The dsh Web GUI running inside a native Glimpse window:

![deepseek-harness-gui running in a native Glimpse window](screenshots/Screenshot_20260819_024647.png)

## Install

Install the package into the Web profile:

```sh
dsh plugin --profile web add --allow-build=glimpseui deepseek-harness-gui
```

`glimpseui` contains a platform-native host that must be built during installation. The explicit `--allow-build` flag is required by recent pnpm versions and avoids the `IGNORED_BUILDS` error. Only approve this build script if you trust the dependency.

Then start dsh with the GUI flag:

```sh
dsh web --gui
# or: dsh --profile web --gui
```

The package replaces the stock web command-line provider so `--gui` is accepted, while retaining `--host`, `--port`, and `--trusted-host`.

## Requirements

Supported platforms: Windows, macOS, and Linux.

- dsh Web profile with its frontend built;
- Node.js supported by dsh;
- Glimpse's native host requirements for the current platform.

## License

This project is open source under the MIT License. See [LICENSE](LICENSE) for the full license text.
