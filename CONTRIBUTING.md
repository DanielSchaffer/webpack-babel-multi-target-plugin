# Contributing Guidelines

## Submitting a Pull Request
Thank you for contributing! To make sure everything goes as smoothly as possible, please consider the following guidelines when submitting your pull request:

### 1. Intentional Commits

Group your changes into as few logically grouped commits as possible. It should be easy to explain in your commit message the purpose of each commit, and ideally, the changes should all be related to eachother.

Avoid sequential commits to the effect of "do the thing", and then "that didn't work, actually do the thing", as well as über-commits that combine multiple unrelated changes.

Use `git rebase -i` on your feature branch to squash related commits together and/or change their messages. Alternatively, use `git reset COMMIT_SHA_OF_BRANCH_PARENT` and re-commit your changes once you're ready to submit.

### 2. Use Conventional Commit Messages

Author your commit messages following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) standard. Generally, this looks like the following:

```
<type>: <description>

- [optional detail 1]
- [optional detail 2]

[optional footer(s)]

[<optional verb>] #<issue number>
```
- **description** is a brief summary of the change
- **detail(s)** provide additional description and/or context for the change
- **type** is one of the following:
  - `fix`: patches a bug in the code (correlates with [`patch`](http://semver.org/#summary) in semantic versioning)
  - `feat`: introduces a new feature to the codebase (correlates with [`minor`](http://semver.org/#summary) in semantic versioning)
  - `chore`: changes that do not affect the meaning or structure of code - style/formatting changes, documentation, build, development environment or CI configuration changes, etc

- **verb** is one of the following:
  - `fixes`: used with the `fix` type when a commit completely fixes the specified issue
  - `resolves`: used with the other types when a commit completely resolves the specified issue
  - When your PR is merged, these keywords will automatically close the corresponding issue. If a commit does not completely fix or resolve the issue, but contributes to doing so, please include the issue number without the verb. (e.g. `#21`)
- **issue number** links your changes to the GitHub issue that describes the reason for the commit

If a change is not compatible with existing functionality, the `BREAKING` footer _must_ be included with a description of what was broken, and if possible, instructions to mitigate breakage.

Example `feat`:
```
feat: add configuration option for additional Babel plugins

resolves #54
```

Example `fix`:
```
fix: add specific check for require.context modules

- when determining if a request needs to be transpiled, assume `true` for modules included via Webpack's `require.context`

fixes #51
```

Example `BREAKING` Change:
```
feat: remove `plugins` and `cacheDirectory` from `options.babel` object

BREAKING: move these keys to `options.babel.loaderOptions`

#21
```

### 3. Check Your Work

Several example projects are included for the purpose of ensuring that the plugin works properly in an array of use cases. Start the example project server by running the following from the command line:

```
NODE_OPTIONS="--max-old-space-size=8192" yarn start
```

Due to the number of projects, the `NODE_OPTIONS` environment variable is required to prevent the process from running out of memory.

When the server has completed its initial compilation, you can view the example projects by visiting http://localhost:3002/examples/angular/, and then following the links to each of the other examples. Each of the examples must:

- Turn the page background green after loading
- Add entries to the "Clicks" list when clicking on the page
- Some examples include additional functionality (`angular-routing`, `es6-dynamic-import`). Follow any additional links within the examples and ensure no errors are logged.