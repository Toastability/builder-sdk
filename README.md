# Chai Builder - Open Source Tailwind Builder

Chai Builder is an Open Source Low Code React + Tailwind CSS Visual Builder. 
It allows you to create web pages visually by dragging and dropping elements onto the canvas. 
It is a simple React component that renders a full-fledged visual builder into any React application. 

Demo: https://chaibuilder-sdk.vercel.app/

NextJS Starter: https://github.com/chaibuilder/chaibuilder-nextjs

---

### Manual installation:

Step 1: Install the packages
```bash
npm install @chaibuilder/sdk
```

Step 2: Add a custom tailwind config.
Create a new file: `tailwind.chaibuilder.config.ts`. <br /> Pass the path to your source files.
```tsx
import { getChaiBuilderTailwindConfig } from "@chaibuilder/sdk/tailwind";
export default getChaiBuilderTailwindConfig(["./src/**/*.{js,ts,jsx,tsx}"]);

```

Step 3: Create a new `chaibuilder.tailwind.css`
```css
@config "./tailwind.chaibuilder.config.ts";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

Step 4: Add the builder to your page.
```tsx
import "./chaibuilder.tailwind.css";
import "@chaibuilder/sdk/styles";
import {loadWebBlocks} from "@chaibuilder/sdk/web-blocks";
import { ChaiBuilderEditor } from "@chaibuilder/sdk";

loadWebBlocks();

const BuilderFullPage = () => {
  return  (
      <ChaiBuilderEditor
          blocks={[{_type: 'Heading', _id: 'a', content: 'This is a heading', styles: '#styles:,text-3xl font-bold'}]}
          onSave={async ({ blocks, providers, brandingOptions } ) => {
            console.log(blocks, providers, brandingOptions );
            return true
          }}
      />
  );
}
```
    
### Render the blocks on your page.

```tsx
export default () => {
    return <RenderChaiBlocks blocks={blocks}/>
}
```

---
## Support
If you like the project, you can assist us in expanding. ChaiBuilder is a collaborative endeavor crafted by developers in their free time. We value every contribution, no matter how modest, as each one represents a significant step forward in various ways, particularly in fueling our drive to enhance this tool continually.

<a href="https://www.buymeacoffee.com/chaibuilder" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 30px !important;width: 117px !important;" ></a>


## Commit Message Guidelines
This repository uses Husky with commitlint to enforce [Conventional Commit](https://www.conventionalcommits.org/) style messages. Every commit must include a **type** and a **subject** in the form `type: subject`.

Common commit types you can use:

- `feat`: add a new feature
- `fix`: patch a bug
- `docs`: documentation-only changes
- `chore`: tooling or maintenance updates
- `refactor`: code changes that neither fix a bug nor add a feature
- `test`: add or update tests

Example messages that will pass the hook:

```text
feat: add CMS support for block icon URLs
fix: prevent undefined error when cloning block icons
docs: expand README with commit message examples
```

If your commit spans multiple areas, split it into logical commits so each message remains focused and descriptive.


## Acknowledgments
Chai Builder stands on the shoulders of many open-source libraries and tools. We extend our gratitude to the developers and maintainers of these projects for their contributions.
