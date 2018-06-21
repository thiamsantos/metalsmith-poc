const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const Metalsmith = require('metalsmith')
const markdown = require('metalsmith-markdown')
const layouts = require('metalsmith-layouts')
const permalinks = require('metalsmith-permalinks')

function getMetadata() {
  return yaml.safeLoad(
    fs.readFileSync(path.resolve(__dirname, 'site.yml'), 'utf8')
  )
}

Metalsmith(__dirname)
  .metadata(getMetadata())
  .source('./content')
  .destination('./public')
  .clean(true)
  .use(markdown())
  .use(permalinks())
  .use(layouts())
  .build(function(err, files) {
    if (err) {
      throw err
    }
  })
