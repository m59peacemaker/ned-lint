#!/usr/bin/env node

const {spawn} = require('child_process')
const program = require('commander')
const {watch} = require('chokidar')
const {sync: glob} = require('glob-all')
const debounce = require('debounce')
const {bold, green, yellow} = require('chalk')
const {tick: checkMark, warning} = require('figures')
const greenCheckmark = green(checkMark)
const yellowWarning = yellow(warning)
const exclusiveProcess = require('exclusive-process')
const {sync: globAssist} = require('cli-glob-assist')
const {chainToProcess} = require('cp-pipe')

const args = program
  .arguments('[files...]', 'path to a directory to lint or globs of files to lint')
  .option('-w, --watch')
  .parse(process.argv)

args.files = globAssist(args.args, '**/*.js')

const lintCommand = (files) => {
  return spawn(require.resolve('standard/bin/cmd.js'), ['--parser', 'babel-eslint', ...files])
}
const formatCommand = () => spawn(require.resolve('snazzy/bin/cmd.js'), ['--colors'])

let lastLintExitCode
process.on('exit', (err) => {
  err && process.stdout.write(err)
  process.exit(lastLintExitCode)
})
const lint = (files) => {
  const matches = glob(args.files)
  if (!matches.length) {
    console.log(bold(`No files matched ${yellowWarning}`))
    return spawn('sleep', [0])
  }
  console.log(bold('Checking code style...'))
  const lintProcess = lintCommand(files)
    .on('close', exitCode => { lastLintExitCode = exitCode })
    .on('close', exitCode => {
      if (exitCode === 0) {
        console.log(bold(`Code style is JavaScript Standard Style compliant ${greenCheckmark}`))
      }
    })
  const formatProcess = formatCommand()
  chainToProcess([lintProcess, formatProcess])
  return lintProcess
}

const exclusiveLint = exclusiveProcess(() => lint(args.files))

exclusiveLint()

if (args.watch) {
  watch(args.files, {
    ignored: ['**/node_modules/**'],
    ignoreInitial: true
  }).on('all', debounce(exclusiveLint, 100))
}
