import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

function getStorybookChunkName(moduleId: string) {
  const normalizedId = moduleId.replaceAll('\\', '/')
  const storybookDistMarker = '/node_modules/storybook/dist/'

  if (normalizedId.includes(storybookDistMarker)) {
    const [, storybookPath = 'core'] = normalizedId.split(storybookDistMarker)
    const [section = 'core'] = storybookPath.split('/')

    return `storybook-${section.replace(/^_/, '')}`
  }

  if (normalizedId.includes('/node_modules/@storybook/')) {
    const [, packagePath = 'core'] = normalizedId.split('/node_modules/@storybook/')
    const [packageName = 'core'] = packagePath.split('/')

    return `storybook-${packageName}`
  }

  return null
}

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
      build: {
        chunkSizeWarningLimit: 800,
        rolldownOptions: {
          output: {
            codeSplitting: {
              maxSize: 450 * 1024,
              groups: [
                {
                  name: getStorybookChunkName,
                  test: (moduleId: string) => getStorybookChunkName(moduleId) !== null,
                },
                {
                  name: 'react',
                  test: /node_modules[\\/](?:react|react-dom|scheduler)[\\/]/,
                },
                {
                  name: 'testing',
                  test: /node_modules[\\/](?:@testing-library|aria-query|dom-accessibility-api)[\\/]/,
                },
                {
                  name: 'vendor',
                  test: /node_modules[\\/]/,
                },
              ],
            },
          },
        },
      },
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('../src', import.meta.url)),
        },
      },
    }),
}

export default config
