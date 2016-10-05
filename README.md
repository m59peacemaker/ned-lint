# ned-lint

Linter for [ned](https://www.npmjs.com/package/ned) built on top of [standard](https://github.com/feross/standard)

## install

```sh
npm install ned-lint
```

## help

```sh
  Usage: ned-lint [options] [files...]

  Options:

    -h, --help   output usage information
    -w, --watch
```

`[files...]` can be globs or paths.
If none given, lint \*\*/\*.js in the current directory.
If a single path to a directory is given, lint \*\*/\*.js in that directory.
Anything else will be considered as is.

Some files will be ignored. See [standard](https://github.com/feross/standard#how-do-i-ignore-files) for details.
