import Conf from 'conf';

export const globalConf = new Conf({
  projectName: '@cli/core',
  schema: {
    plugins: {
      type: 'object',
      additionalProperties: {
        oneOf: [{ type: 'string' }, { type: 'boolean' }],
      },
      default: {},
    },
  },
});
