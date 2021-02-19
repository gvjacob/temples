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

## **Configuration**

`.temples.yaml` is the configuration file for Temples. Each command has a list of `temples`, each one defining which template files to use, where to output the compiled files, and default mapping for the key value pairs. You can further configure each command.

The schema for `.temples.yaml`:

```yaml
[command]:
  base: [base_path]
  prompt:
    - [key]
      ...
  temples:
    - template: [template_path]
      output: [output_path]
      default:
        [key]: [value]
        ...
      ...
...
```

### `base`

Every path (e.g. `template`, `output`) will be relative to the given `base`. This helps avoid redundancy in specifying path values in `temples`.

If you need to differentiate the base path for all templates and outputs, you can specify `template` and `output` under `base`.

```yaml
base:
  template: [template_base_path]
  output: [output_base_path]
```

### `prompt`

`prompt` takes in a list of keys that the user will be prompted for in the CLI.

Follow this syntax to provide documentation for a key:

```yaml
prompt:
  - key: [key]
    doc: [documentation] # displayed when prompted
```

### `temples`

The list of files to generate when running the command. This can take an arbitrary number if you want to generate more than one file from different templates. For example in React, you might want to create a Javascript file, a css stylesheet, and a test file when generating a new component.

- `template`: Path to template file. A template file can have any extension as long as it has text and abides by Handlebars syntax. You could establish your own template conventions like `file.template` to be explicit. Omitting a template will create an empty file.

- `output`: Path to output file. Temples will create any non-existent directories along the given path if needed.

- `default`: Default key value pairs if not provided by the CLI command.

> Note: if you wish to use a key when defining `template` and `output`, you can wrap the values with quotes and use the same Handlebars syntax (e.g. “path/to/{{ module }}.js”).

## **Template Helpers**

Temples uses Handlebars syntax for defining file templates and dynamic output paths. We've added a few helpers to provide more flexibility within the templates:

### `camel`

This helper will convert your variable to camelCase.

```sh
# Template
{{ camel name }}
```

```sh
# Input: { name: "BigButton" }
bigButton
```

### `kebab`

This helper will convert your variable to kebab-case.

```sh
# Template
{{ kebab name }}
```

```sh
# Input: { name: "bigButton" }
big-button
```

### `snake`

This helper will convert your variable to snake_case.

```sh
# Template
{{ snake name }}
```

```sh
# Input: { name: "big-button" }
big_button
```

### `title`

This helper will convert your variable to TitleCase.

```sh
# Template
{{ snake name }}
```

```sh
# Input: { name: "big_button" }
BigButton
```

### Naming Conflicts

If a variable conflicts with a helper name (e.g. `{{ title }}`), Handlebars will treat it as a helper instead of a variable. You can namespace the variable with `this` or `./` to avoid naming conflicts.

```
{{ this.title }}
```

## **Example**

This is an example `.temples.yaml` file for a React project:

```yaml
# Generate a new component
component:
  # All paths are relative to src folder
  base: ./src
  temples:
    # Component entry point file
    - template: component.template
      output: 'components/{{ name }}/index.js'
      default:
        name: Component

    # Component CSS stylesheet
    - template: styles.template
      output: 'components/{{ name }}/{{ camel name }}.module.scss'

    # Component test file
    - template: test.template
      output: 'components/{{ name }}/test.js'
```

`component.template`

```
import React from 'react';
import styles from './{{ camel name }}.module.scss';

const {{ name }} = () => {
	return null;
};

export default {{ name }};
```

`styles.template`

```
.{{ kebab name }} {

}
```

`test.template`

```
import React from 'react';
import { render } from '@testing-library/react'

describe('{{ name }}', () => {})
```

To run the command:

```bash
temples component --name Button
```

## **License**

Copyright © 2020, [Gino Jacob](https://ginojacob.com). MIT License.
