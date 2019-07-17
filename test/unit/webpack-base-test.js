
const assert = require('assert')

describe('webpack.base.js test case', () => {

    const baseConfig = require('../../lib/webpack.base')

    console.log(baseConfig)
    it('entry', () => {
        assert.equal(baseConfig.entry.index, '/github_project/builder-webpack/test/template/src/index/index.js')
        assert.equal(baseConfig.entry.search, '/github_project/builder-webpack/test/template/src/search/index.js')

    })
})