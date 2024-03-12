# 插件化的命令行工具

## 内置功能

1. `@clack/prompts` 实现交互式命令行
2. `chalk` 实现命令行输出样式
3. `clipboardy` 实现剪贴板操作
4. `execa` 实现命令行执行

上述功能均可通过 `ctx` 对象调用。

## 如何开发插件？

```ts
import { resolve } from 'node:path';
import type { CliPlugin } from '@waycode/cli';

const plugin: CliPlugin = {
  name: 'wdp',
  handle(ctx) {
    ctx.registerCommand({
      scope: 'wdp',
      command: 'cicd [appName]',
      action: (appName?: string) => {
        // do something
      },
    });
  },
};

export default plugin;
```
