const glob = require('glob-all')

//检查html 是否生成

describe('Checking generated html files', () => {
    it('should genetate html files', (done) => {
        const files = glob.sync([
            './dist/index.html',
            './dist/search.html'
        ])

        if (files.length > 0) {
            done()
        } else {
            throw new Error('no html files genetated')
        }

    })

})