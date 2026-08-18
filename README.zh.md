# deepseek-harness-gui

[English](README.md) | 中文

这是一个 dsh bundle 插件，用于将现有的 dsh Web GUI 打开在原生的 [Glimpse](https://github.com/hazat/glimpse) 窗口中。插件不会重新实现聊天功能，也不会添加第二套 RPC 桥接；窗口会直接导航到已绑定的本机 Web Server。

## 安装

将插件安装到 Web profile：

```sh
dsh plugin --profile web add --allow-build=glimpseui deepseek-harness-gui
```

`glimpseui` 包含需要在安装期间构建的平台原生宿主。近期版本的 pnpm 要求通过显式的 `--allow-build` 参数批准该构建脚本，这样可以避免 `IGNORED_BUILDS` 错误。只有在信任该依赖的情况下才应批准其构建脚本。

然后使用 GUI flag 启动 dsh：

```sh
dsh web --gui
# 或：dsh --profile web --gui
```

该包会替换默认的 Web 命令行参数提供插件，使 `--gui` 能够被识别，同时保留 `--host`、`--port` 和 `--trusted-host` 参数。

## 要求

支持的平台：Windows、macOS 和 Linux。

- 已构建前端的 dsh Web profile；
- dsh 支持的 Node.js 版本；
- 当前平台所需的 Glimpse 原生宿主环境。

## 许可证

本项目基于 MIT License 开源。完整许可证文本请参阅 [LICENSE](LICENSE)。
