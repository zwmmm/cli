import { join } from 'node:path';
import Conf from 'conf';
import type { Execa$ } from 'execa';
import { globalConf } from './../core/utils/conf';
import type { CliPlugin } from './../types/index';
import type { CliContext } from '@/types/index';

interface PluginList {
  [key: string]: boolean | string;
}

export class Plugin {
  private plugins = new Map<string, CliPlugin>();
  private pluginDirPath: string;
  private $$: Execa$;

  public constructor(private ctx: CliContext) {
    this.pluginDirPath = join(this.ctx.meta.paths.home, '.yi/plugins');
    ctx.fs.ensureDirSync(this.pluginDirPath);
    this.$$ = this.ctx.$({
      cwd: this.pluginDirPath,
      stdio: 'inherit',
    });
    if (!ctx.fs.existsSync(join(this.ctx.meta.paths.home, '.yi/plugins/package.json')))
      this.$$`npm init -y`;
  }

  public init() {
    this.initCommand();
    this.initExternalPlugins();
    this.loadPlugins();
  }

  public getNpmPkgName(name: string) {
    const names = name.split('@');
    return names[0] || `@${names[1]}`;
  }

  private initCommand() {
    this.ctx.registerCommand({
      scope: 'cli',
      command: 'install <pluginName>',
      alias: 'i',
      description: 'install plugin',
      action: async (name: string) => {
        try {
          await this.$$`npm i ${name} --save`;
          const pkgName = this.getNpmPkgName(name);
          globalConf.set(`plugins.${pkgName}`, true);
          this.ctx.log.success(`🎉 Plugin ${pkgName} installed`);
        }
        catch (e) {
          this.ctx.log.error((e as Error).message);
        }
      },
    });

    this.ctx.registerCommand({
      scope: 'cli',
      command: 'uninstall <name>',
      alias: 'un',
      description: 'uninstall plugin',
      action: async (name: string) => {
        try {
          await this.$$`npm un ${name} --save`;
          const pkgName = this.getNpmPkgName(name);
          const plugins = globalConf.get('plugins') as PluginList;
          if (!Object.prototype.hasOwnProperty.call(plugins, pkgName)) {
            this.ctx.log.error(`Plugin ${pkgName} is not installed`);
            return;
          }
          delete plugins[pkgName];
          globalConf.set('plugins', plugins);
          this.ctx.log.success(`🎉 Plugin ${pkgName} uninstalled`);
        }
        catch (e) {
          this.ctx.log.error((e as Error).message);
        }
      },
    });

    this.ctx.registerCommand({
      scope: 'cli',
      command: 'enable <name>',
      description: 'enable plugin',
      action: (inName: string) => {
        const name = this.getNpmPkgName(inName);
        const plugins = globalConf.get('plugins') as PluginList;
        if (!Object.prototype.hasOwnProperty.call(plugins, name)) {
          this.ctx.log.error(`Plugin ${name} is not installed`);
          return;
        }
        globalConf.set(`plugins.${name}`, true);
        this.ctx.log.success(`🎉 Plugin ${name} enabled`);
      },
    });

    this.ctx.registerCommand({
      scope: 'cli',
      command: 'disable <name>',
      description: 'disable plugin',
      action: (inName: string) => {
        const name = this.getNpmPkgName(inName);
        const plugins = globalConf.get('plugins') as PluginList;
        if (!Object.prototype.hasOwnProperty.call(plugins, name)) {
          this.ctx.log.error(`Plugin ${name} is not installed`);
          return;
        }
        globalConf.set(`plugins.${name}`, false);
        this.ctx.log.success(`🎉 Plugin ${name} disabled`);
      },
    });

    this.ctx.registerCommand({
      scope: 'cli',
      command: 'link',
      description: 'link plugin',
      options: [
        {
          flags: '-p, --path <path>',
          description: 'plugin path',
          defaultValue: this.ctx.meta.paths.cwd,
        },
      ],
      action: async (options: { path: string }) => {
        try {
          const name = this.ctx.fs.readJSONSync(join(options.path, 'package.json')).name;
          globalConf.set(`plugins.${name}`, options.path);
          this.ctx.log.success(`🎉 Plugin ${name} linked`);
        }
        catch (e) {
          this.ctx.log.error((e as Error).message);
        }
      },
    });

    this.ctx.registerCommand({
      scope: 'cli',
      command: 'unlink',
      description: 'unlink plugin',
      action: async () => {
        try {
          const name = this.ctx.fs.readJSONSync(join(this.ctx.meta.paths.cwd, 'package.json')).name;
          const plugins = globalConf.get('plugins') as PluginList;
          if (!Object.prototype.hasOwnProperty.call(plugins, name)) {
            this.ctx.log.error(`Plugin ${name} is not installed`);
            return;
          }
          if (typeof plugins[name] === 'string') {
            delete plugins[name];
            globalConf.set('plugins', plugins);
            this.ctx.log.success(`🎉 Plugin ${name} unlinked`);
            return;
          }
          this.ctx.log.error(`Plugin ${name} is not linked`);
        }
        catch (e) {
          this.ctx.log.error((e as Error).message);
        }
      },
    });

    this.ctx.registerCommand({
      scope: 'cli',
      command: 'updates',
      description: 'check plugin updates',
      action: async () => {
        await this.$$`npx taze major -w`;
        await this.$$`npm i`;
        this.ctx.log.success(`🎉 Plugins updates done`);
      },
    });
  }

  private initExternalPlugins() {
    const pluginMap = (globalConf.get('plugins') || {}) as Record<string, boolean | string>;
    const plugins = Object.keys(pluginMap).filter(name => pluginMap[name]);
    plugins.forEach((name) => {
      try {
        let plugin: CliPlugin;
        if (typeof pluginMap[name] === 'string')
        // eslint-disable-next-line ts/no-var-requires, ts/no-require-imports
          plugin = require(pluginMap[name] as string).default as CliPlugin;
        else
          // eslint-disable-next-line ts/no-var-requires, ts/no-require-imports
          plugin = require(join(this.pluginDirPath, 'node_modules', name)).default as CliPlugin;

        if (!plugin.name) {
          this.ctx.log.error(`Plugin ${name} load failed`);
          return;
        }
        this.registerPlugin(plugin);
        this.ctx.log.debug(`Plugin ${name} loaded`);
      }
      catch (e) {
        this.ctx.log.error((e as Error).message);
      }
    });
  }

  private loadPlugins() {
    this.plugins.forEach((plugin) => {
      plugin.handle(this.ctx);
    });
  }

  private registerPlugin(plugin: CliPlugin) {
    const name = plugin.name;
    if (this.plugins.has(name)) {
      this.ctx.log.error(`Plugin ${name} already exists`);
      return;
    }
    this.plugins.set(name, plugin);
    if (plugin.config) {
      const conf = new Conf({ schema: plugin.config, projectName: `@yi/${name}` });
      this.ctx.log.debug(`${name} configPath: ${conf.path}`);
      this.ctx.store.set(name, conf);
    }
  }
}
