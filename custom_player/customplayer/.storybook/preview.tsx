import '../src/styles/globals.scss';
import './reset.css';
import { customDecorator } from './customDecorator';
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: 'centered',
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = customDecorator({
  bufferedChunks: []
});