import { html } from 'lit';
import '../src/pokemon-wiki.js';

export default {
  title: 'PokemonWiki',
  component: 'pokemon-wiki',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ title, backgroundColor }) {
  return html`
    <pokemon-wiki
      style="--pokemon-wiki-background-color: ${backgroundColor || 'white'}"
      .title=${title}
    >
    </pokemon-wiki>
  `;
}

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
