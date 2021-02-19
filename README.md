<h1 align="center">Temples</h1>
<p align="center">
<br />
🕍
<br />
<br />
<b>Automatically generate code from predefined templates. No boilerplate.</b>
</p>

<p align="center">
Boilerplate coding is tedious. Temples automates the process by giving you the ability to define <a href="https://handlebarsjs.com/">Handlebars</a> templates, target paths, and the CLI commands to automatically generate the code. You can <b>create new files</b> or <b>insert into existing ones</b>.
</p>

<br />

<p align="center">
<img  src="https://user-images.githubusercontent.com/23367882/81625727-bacd1980-93c7-11ea-80f0-08af6e1ef855.gif"/>

</p>

<p align="center">
<sub>Example of Temples CLI</sub>
</p>
<br />

# **Installation**

```bash
# Install globally
npm install [-g] temples

# Or, in your project
npm install --save-dev temples
```

<br />

# **Usage**

> Temples reads from a `.temples.yaml` configuration file. Refer to [Configuration](#configuration) below to create your own configuration file before running temples.

You can run temples by specifying the generator command and props, or invoke a CLI step by step guide where you can input these parameters.

```bash
# Invoke CLI guide
temples

# Or, directly specify generator and value for each prop
temples [generator] --[prop]=[value] ...

# Read more in the manual
temples -h
```

<br />

# **Configuration**

### generators

> Required. Temples will throw error if undefined.

In your `.temples.yaml` file, specify the `generators` object. This lists all available generators and what each does, either creating new files or inserting code into existing files.

```yaml
# .temples.yaml

generators:
  # Give your command a name
  [command]:
    files: ...
    inserts: ...
```

<hr />
<br />
<br />

### files

Generate new files given a target path, and an optional template path. If template is given, temples will use the contents of that template, compile it with given props, and output to target path.

```yaml
# .temples.yaml

generators:
  new-component:
    files:
      # Use `component.hbs` and create `index.js`
      - template: component.hbs
        target: index.js

      # Create empty file at `index.js`
      - target: index.js

      # Compile with `name` and create
      # file at `[component_name]/index.js`
      - target: '{{ name }}/index.js'
```

<hr />
<br />
<br />

### inserts

Insert code into targeted files. Temples uses user defined regex to find tags in targeted files and replace them with the parsed content. File comments are the best ways to do this:

```js
/* components/index.js */

// temples(import {{ name }} from './{{ name }}';)
import Button from './Button';
```

```yaml
# .temples.yaml

# File extension to ECMAScript regex pattern
#
# The first regex capture group is the
# template for the insert
regex:
  js: '\/\/ temples\((.+)\)'

generators:
  new-component:
    inserts:
      # Insert into `components/index.js`
      - target: components/index.js

      # Insert into `components/[component_name]/index.js`
      - target: 'components/{{ name }}/index.js'
```

Here's a great [playground tool](https://regex101.com/) for finding the right regex pattern.

<hr />
<br />
<br />

### base

Specify the base paths for templates, files, or inserts. `base` can be specified and overridden in the root configuration file or the generator command's configuration.

```yaml
# .temples.yaml

# Find templates, files, and inserts
# under `dir/`
base: dir

generators:
  new-component:
    # Override to be `dir/subdir/`
    base: dir/subdir

    # Find templates in `dir/templates`
    # Target files and inserts in `dir/targets`
    base:
      templates: dir/templates
      target: dir/targets

    # Find templates in `dir/templates`
    # Target files in `dir/targets/files`
    # Target inserts in `dir/targets/inserts`
    base:
      templates: dir/templates
      target:
        files: dir/targets/files
        inserts: dir/targets/inserts
```

<hr />
<br />
<br />

### default

Default prop values if not provided in CLI.

> If there is no default provided and user doesn't specify value, Handlebars compiles undefined props to empty string.

```yaml
# .temples.yaml

default:
  name: 'NewComponent'

generators:
  new-component:
    # Override default in root level
    default:
      name: 'NewestComponent'
    ...
```

<hr />
<br />
<br />

### props

Specify props that should be prompted for in the CLI guide. It's not optimal for temples to search through all props available in templates. You can specify which props to prompt for with this key.

```yaml
# .temples.yaml

generators:
  new-component:
    # Ask user for `name` and `directory`
    props: [name, directory]

    # In YAML, this is the same
    props:
    - name
    - directory

    # Provide documentation for each prop
    # during CLI guide
    props:
    - name: name
      doc: Name of component
    - name: directory
      doc: Directory to place component in
```

<hr />
<br />
<br />

### position

Position to insert output to. This is relative to the regex tag in the target file. Default position is `below`. The most specific position will be used.

```yaml
# .temples.yaml

position: above | below | right | left

generators:
  new-component:
    position: above | below | right | left

    inserts:
      - target: components/index.js
        position: above | below | right | left
```

<hr />
<br />
<br />

# Handlebars Helpers

Temples uses Handlebars templating engine, and temples has some built-in [helpers](https://handlebarsjs.com/api-reference/helpers.html#helpers).

### camel-case

Convert into camelCase.

```hbs
{{ camel name }}

# Input: { name: "BigButton" }
bigButton
```

### kebab-case

Convert into kebab-case

```hbs
{{ kebab-case name }}

# Input: { name: "bigButton" }
big-button
```

### snake-case

Convert into snake_case

```hbs
{{ snake-case name }}

# Input: { name: "big-button" }
big_button
```

### title-case

Convert into TitleCase

```hbs
{{ title-case name }}

# Input: { name: "big_button" }
BigButton
```

<br />
<br />

# Customizing Handlebars

The built-in helpers might not be enough for your use case. You can customize the Handlebars instance temples uses by specifying a path to a JavaScript file that configures Handlebars.

See the [Handlebars runtime documentation](https://handlebarsjs.com/api-reference/runtime.html).

```yaml
# .temples.yaml

handlebars: configureHandlebars.js
```

```js
// configureHandlebars.js

module.exports = (handlebars) => {
  handlebars.registerHelper('replace', (v) => {
    return v.replace(' ', '-');
  });
};
```

<br/>
<br/>

# Caveats

### Naming Conflicts

If a variable conflicts with a helper name (e.g. `{{ title }}`), Handlebars will treat it as a helper instead of a variable. You can namespace the variable with `this` or `./` to avoid naming conflicts.

```hbs
{{ this.title }}
```

### Escaping Handlebars Syntax

Sometimes you need Handlebars to ignore parsing a prop. For example, if you're generating a file from a twig template, Handlebars might parse `{{ example }}` unintentionally.

You can leave it as it is by escaping:

```hbs
\{{ example }}
```

<br/>
<br/>

## **License**

Copyright © 2020, [Gino Jacob](https://ginojacob.com). MIT License.
