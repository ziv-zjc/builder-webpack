const glob = require('glob-all')

//检查html 是否生成

describe('Checking generated css js files', () => {
    it('should genetate css js files', (done) => {
        const files = glob.sync([
            './dist/index_*.js',
            './dist/index_*.css',
            './dist/search_*.js',
            './dist/search_*.css'
        ])

        if (files.length > 0) {
            done()
        } else {
            throw new Error('no css js files genetated')
        }

    })

})