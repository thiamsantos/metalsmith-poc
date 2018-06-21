const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const cpy = require('cpy')
const metalsmith = require('metalsmith')
const markdown = require('metalsmith-markdown')
const layouts = require('metalsmith-layouts')
const permalinks = require('metalsmith-permalinks')
const sitemap = require('metalsmith-sitemap')
const favicons = require('metalsmith-favicons')

function getMetadata() {
  return yaml.safeLoad(
    fs.readFileSync(path.resolve(__dirname, 'site.yml'), 'utf8')
  )
}

function copyAssets() {
  return function (files, metalsmith, done) {
    const manifest = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, 'assets/manifest.json'), 'utf-8')
    )

    const assets = Object.values(manifest).map(file =>
      path.resolve(__dirname, 'assets', file)
    )
    cpy(assets, path.resolve(__dirname, 'public/assets')).then(() => {
      metalsmith.metadata(
        Object.assign({}, metalsmith.metadata(), {
          assets: {
            css: path.join('/assets', manifest['site.css']),
            js: path.join('/assets', manifest['site.js'])
          }
        })
      )
      setImmediate(done)
    })
  }
}

metalsmith(__dirname)
  .metadata(getMetadata())
  .clean(false)
  .source('./content')
  .destination('./public')
  .use(copyAssets())
  .use(
    favicons({
      src: 'logo.png',
      dest: 'favicons/',
      icons: {
        android: true,
        appleIcon: true,
        favicons: true
      }
    })
  )
  .use(markdown())
  .use(permalinks())
  .use(layouts())
  .use(
    sitemap({
      hostname: 'https://brainn.co/'
    })
  )
  .build(err => {
    if (err) {
      throw err
    }
    console.info('Metalsmith finished build')
  })
