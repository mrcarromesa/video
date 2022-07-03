# Storybook

- Para adicionar seguir a documentação em: https://storybook.js.org/tutorials/intro-to-storybook/react/pt/get-started/

- Executar o comando:

```shell
npx -p @storybook/cli sb init
```

- Com isso será criado uma pasta na raiz chamada `.storybook` para começar altero a extensão dos arquivos para .ts no caso do `main.js` e .tsx para o `preview.js`

- Opcionalmente pode remover os `stories` de exemplos que são criados 

## Probolemas com typescript

- Encontrei um problema com a resolução de paths conforme configurado no tsconfig.json em `baseUrl`,

- O que ajudou a resolver problemas com o `baseURL` foi: https://storybook.js.org/docs/react/builders/webpack#typescript-module-resolution

- Instalar a dependencia:

```shell
yarn add tsconfig-paths-webpack-plugin -D
```

- E ajustar no arquivo `.storybook/main.ts`:

```ts
// .storybook/main.js

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  // ... MORE ...
  webpackFinal: async (config) => {
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      }),
    ];
    return config;
  },
};
```

## Problemas com o sass

- Help: https://stackoverflow.com/questions/48551520/storybook-custom-webpack-loading-empty-scss-objects

- Para carregar arquivos .sass preicamos adicionar os loaders:

```shell
yarn add node-sass sass-loader -D   
```

- adicionar a dependencia: 

```shell
yarn add -D @storybook/preset-scss
```

- E ajustar no arquivo `.storybook/main.ts`:

```ts
 "addons": [
    // ... MORE
    {
      name: '@storybook/preset-scss',
      options: {
        cssLoaderOptions: {
          modules: true
        }
      }
    },
  ],
```

- Otras formas: https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config

---

## Reset css

- Além de adicionar o css global da aplicação pode ser que seja necessário alterar algumas configurações do css, como cor de fundo, etc...

- Para tal crie um arquivo de reset de css em `./storybook/reset.css` e adicione no arquivo `.storybook/preview.tsx`:

```tsx
import '../src/styles/globals.scss';
import './reset.css'; // <--- Arquivo com reset de css
```

---

## Centralizar itens

- No arquivo `.storybook/preview` adicionar o seguinte:

```tsx
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: 'centered',  // <---- Adicionar isso para centralizar o layout
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
```

---

## Adicionar temas

- Seguir documentação: https://storybook.js.org/docs/react/configure/theming

- Instalar dependências:

```shell
yarn add --dev @storybook/addons @storybook/theming
```

- criar arquivo `.storybook/manager.ts`:

```ts
import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';


addons.setConfig({
  theme: themes.dark,
});
```


## Criar uma storie

- Um exemplo de como criar o storie de um component: https://storybook.js.org/docs/react/get-started/setup

---

## Context

- Para utilizar o context podemos utilizar o decorators, pode ser de uma forma mais global, ou pontualmente em um componente, para uma forma mais global utilizar o `.storybook/preview.tsx`

### Global

- Para isso criei um arquivo `.storybook/customDecorator.tsx` e importei ele no `.storybook/preview.tsx`:

```tsx
export const decorators = customDecorator({
  bufferedChunks: []
});
```

### No component

- No component é basicamente algo semelhante, só adicionar a prop decorators, um exemplo disso em `src/stories/components/Media/Controls/ProgressBar/components/ProgressBarLoaded.stories.tsx`:

```tsx
// imports

export default {
  title: "ProgressBar/Components/ProgressBarLoaded",
  component: ProgressBarLoaded,
  decorators: customDecorator({ // <---UTILIZAR AQUI o Context que está em .storybook/customDecorator.tsx
    bufferedChunks: [{ start: 0, end: 10, range: 10 }],
    // ... MORE ...
  }),
  parameters: {
    docs: { source: { excludeDecorators: true, type: "code" } },
  },
} as Meta;

const Template: ComponentStory<typeof ProgressBarLoaded> = (args) => (
  <ProgressBarLoaded {...args} />
);

export const Loaded = Template.bind({});
Loaded.args = {
  className: styles.progressBarLoaded,
};


```

---

## Decorators e Documentação

- Em alguns casos precisamos adicionar um component extra para que o component que queremos documentar apareça corretamente, porém não queremos que esses components extras apareçam na documentação

- Um caso de exemplo:

- Temos o seguinte component:

```tsx
<div
  className={stylesContainer.container}
  style={{
    width: "100px",
  }}
>
  <ContentProgressBar {...args} />
</div>
```

- Utilizamos a div que "embrulha" o component `ContentProgressBar` porém só queremos que na documentação apareça o `ContentProgressBar` e a div seja omitida, para tal podemos fazer o seguinte conforme exemplo em:
`src/stories/components/Media/Controls/ProgressBar/components/ContentProgressBar.stories.tsx`:

```tsx
// imports

export default {
  title: "ProgressBar/Components/ContentProgressBar",
  component: ContentProgressBar,
  parameters: {
    docs: { source: { excludeDecorators: true } },
  },
} as Meta;

ContentProgressBar.displayName = "ContentProgressBar";

const Template: ComponentStory<typeof ContentProgressBar> = (args) => (
  <ContentProgressBar {...args} />
);

export const ContentProgressBarElement = Template.bind({});
ContentProgressBarElement.decorators = [
  (Story: PartialStoryFn<ReactFramework>) => (
    <div
      className={stylesContainer.container}
      style={{
        width: "100px",
      }}
    >
      <Story />
    </div>
  ),
];

```

- Veja que no Template utilizamos somente o component que queremos documentar
- E no `ContentProgressBarElement.decorators` colocamos outros componentes que necessitamos para reenderizar corretamente nosso component.

- E para que esse decorator não apareça na documentação utilizamos nos `parameteres` a prop: `docs.source.excludeDecorators: true`, adicionalmente pode utilizar também a prop em `docs` `docs.source.type: "code"`

---

## Personalizar a doc do component

- Em alguns casos queremos personalizar a doc do component para tal segue um exemplo:

```tsx
import {
  ArgsTable,
  Canvas,
  Description,
  Preview,
  Primary,
  SourceState,
  Stories,
  Subtitle,
  Title,
} from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { ComponentStory } from "@storybook/react";
import { ReactNode } from "react";
import styles from "src/components/Media/Controls/ProgressBar/components/Container/styles.module.scss";
import { SliderButton } from "src/components/Media/Controls/ProgressBar/components/SliderButton/index";
import stylesSlider from "src/components/Media/Controls/ProgressBar/components/SliderButton/styles.module.scss";

interface CustomPreviewProps {
  children: ReactNode;
}
type CustomTypePreview = typeof Canvas.defaultProps & CustomPreviewProps;

const CustomPreview: React.FC<CustomTypePreview> =
  Preview as React.FC<CustomTypePreview>;

export default {
  title: "ProgressBar/Components/SliderButton",
  component: SliderButton,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <CustomPreview
            withToolbar
            withSource={SourceState.CLOSED}
            mdxSource='<SliderButton className="sliderButton" />'
          >
            <div className={styles.container}>
              <SliderButton
                className={`${styles.sliderButton} ${stylesSlider.grabbing}`}
              />
            </div>
          </CustomPreview>
          <ArgsTable of={SliderButton} />
          <Stories />
        </>
      ),
    },
  },
} as Meta;

const Template: ComponentStory<typeof SliderButton> = (args) => (
  <div className={styles.container}>
    <SliderButton {...args} />
  </div>
);

export const Hidden = Template.bind({});

Hidden.args = {
  className: styles.sliderButton,
};

export const Grabbing = Template.bind({});

Grabbing.args = {
  className: `${styles.sliderButton} ${stylesSlider.grabbing}`,
};

```

- É necessário instalar a dependencia:

```shell
yarn add -D @storybook/addon-docs
```

- E adicionar no `.storybook/main.ts`:

```ts
module.exports = {
  
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/__stories__/*.stories.@(mdx|js|jsx|ts|tsx)",
    "../src/**/storybook/*.@(js|jsx|ts|tsx)",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-docs", // <---
    "@storybook/addon-interactions",
    {
      name: '@storybook/preset-scss',
      options: {
        cssLoaderOptions: {
          modules: true
        }
      }
    },
  ],
  // "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-webpack5"
  },
  webpackFinal: async (config, { configType }) => {
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      }),
    ];
    return config;
  },
}
```