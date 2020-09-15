const fs = require('fs')
const path = require('path')

let { TENANT } = process.env

if (!TENANT) {
    TENANT = 'a';
}

fs.writeFileSync(path.resolve(__dirname, '../src/theme/index.js'), `export * from './${TENANT}/index.js'`)
fs.writeFileSync(path.resolve(__dirname, '../src/theme/settings.js'),`
const settings = require('./${TENANT}/settings.js')
module.exports = settings
`)
// fs.createReadStream(path.resolve(__dirname, `../src/theme/${TENANT}/images/favicon.ico`)).pipe(fs.createWriteStream('/public/favicon.ico'))