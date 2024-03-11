import Conf from 'conf';

export const globalConf = new Conf({
  projectName: '@yi/core',
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
