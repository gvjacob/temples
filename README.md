# **Temples** 🕍

Automatically generate files from predefined templates.

Creating the same files with the same boilerplate code gets tedious after a while. Temples automates the process by giving you the ability to define [Handlebars](https://handlebarsjs.com/) templates, output paths, and the commands to generate these given your CLI arguments.

## **Installation**

Temples is a CLI application. The easiest way to use it is to install it globally:

```bash
npm install -g temples
```

## **Usage**

Temples reads from a `.temples.yaml` file in the root directory of your project. To run Temples:

```bash
temples [command] [--[key] [value], ...]
```

`command` is the name of a command specified in `.temples.yaml`.
Each `key` and `value` pair is a mapping for the variables in your templates.

## **Configuration**

`.temples.yaml` is the configuration file for Temples. Each key is a specific command, and has a list of “temples”, each one defining which template file to use, where to output the compiled file, and default mapping for key value pairs. You can specify other base configurations for each command.

`.temples.yaml` schema:

```yaml
[command]:
	base: [base_path]
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

### `temples`

The list of “temples”, or files to generate when running the command. This can take an arbitrary number if you want to generate more than one file from different templates. For example in React, you might want to create a Javascript file, a css stylesheet, and a test file when generating a new component.

#### `template`

Path to template file. A template file can have any extension as long as it has text and abides by Handlebars syntax. You could establish your own template conventions like `file.template` to be explicit.

#### `output`

Path to output template file after compiled with provided key value pairs from the CLI. Temples will create any non-existent directories along the given path if needed.

> Note: if you wish to use a key when defining `template` and `output`, you can wrap the values with quotes and use the same Handlebars syntax (e.g. “path/to/{{ module }}.js”).

#### `default`

Default key value pairs if not provided by the CLI command.

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
