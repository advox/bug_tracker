module.exports = {
    entry: './public/javascripts/components/TaskTable.js',
    output: {
        path: __dirname + '/public/javascripts/dist',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query:
                    {
                        presets: [
                            'es2015',
                        ]
                    }
            }
        ]
    }
};