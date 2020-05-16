<h1 align="center">Temples</h1>
<p align="center">
🕍
<br />
<br />
<b>Automatically generate files from predefined templates. No boilerplate.</b>
</p>

Creating the same files with the same boilerplate code gets tedious after a while. Temples automates the process by giving you the ability to define [Handlebars](https://handlebarsjs.com/) templates, output paths, and the commands to generate these given your CLI arguments.

<br />

<p align="center">
<img  src="https://user-images.githubusercontent.com/23367882/81625727-bacd1980-93c7-11ea-80f0-08af6e1ef855.gif"/>

</p>

<p align="center">
<sub>Example of Temples CLI</sub>
</p>
<br />

## **Installation**

Temples is a CLI application. The easiest way to use it is to install it globally:

```bash
npm install -g temples
```

## **Usage**

Temples reads from a `.temples.yaml` file in the root directory of your project.

To run Temples CLI:

```bash
temples
```

Running `temples` without any arguments will bring you to a CLI that will prompt for the command, and the values for each key defined under `prompt` in `.temples.yaml`.

To run Temples without the CLI:

```bash
temples [command] [--[key] [value], ...]
```

`command` is the name of a command specified in `.temples.yaml`.
Each `key` and `value` pair is a mapping for the variables in your templates.

## **Configuration**

`.temples.yaml` is the configuration file for Temples. Each command has a list of “temples”, each one defining which template files to use, where to output the compiled files, and default mapping for the key value pairs. You can further configure each command.

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

Use the `-c` option when invoking `temples` to specify a path to a different yaml configuration file.

### `base`

Every path (e.g. `template`, `output`) will be relative to the given `base`. This helps avoid redundancy in specifying path values in `temples`.

If you need to differentiate the root directory for all templates and outputs, you can specify `template` and `output` under `base`.

```yaml
base:
  template: [template_base_path]
  output: [output_base_path]
```

### `prompt`

`prompt` takes in a list of keys that the user will be prompted for when key value arguments are not provided when running Temples.

### `temples`

The list of “temples”, or files to generate when running the command. This can take an arbitrary number if you want to generate more than one file from different templates. For example in React, you might want to create a Javascript file, a css stylesheet, and a test file when generating a new component.

- `template`: Path to template file. A template file can have any extension as long as it has text and abides by Handlebars syntax. You could establish your own template conventions like `file.template` to be explicit.

- `output`: Path to output template file after compiling with provided key value pairs from the CLI. Temples will create any non-existent directories along the given path if needed.

- `default`: Default key value pairs if not provided by the CLI command.

> Note: if you wish to use a key when defining `template` and `output`, you can wrap the values with quotes and use the same Handlebars syntax (e.g. “path/to/{{ module }}.js”).

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
      output: "components/{{ name }}/index.js"
      default:
        name: Component

  # Component CSS stylesheet
    - template: styles.template
      output: "components/{{ name }}/styles.css"
      
  # Component test file
    - template: test.template
      output: "components/{{ name }}/test.js"
```

`component.template`

```
import React from 'react';
import styles from './styles.css';

const {{ name }} = () => {
	return null;
};

export default {{ name }};
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
Copyright © 2020 - present, [Gino Jacob](https://ginojacob.com). MIT License.
