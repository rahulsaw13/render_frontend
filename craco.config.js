const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@common': path.resolve(__dirname, 'src/components/common'),
            '@pages': path.resolve(__dirname, 'src/pages'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@styles': path.resolve(__dirname, 'src/styles'),
            '@hooks': path.resolve(__dirname, 'src/hooks'),
            '@constants': path.resolve(__dirname, 'src/constants'),
            '@api': path.resolve(__dirname, 'src/api'),
            '@store': path.resolve(__dirname, 'src/useCartStore.js'),
            '@userpage': path.resolve(__dirname, 'src/pages/userpage'),
            '@adminpage-layouts': path.resolve(__dirname, 'src/components/layouts'),
            '@adminpage-components': path.resolve(__dirname, 'src/components'),
            '@userpage-layouts': path.resolve(__dirname, 'src/pages/userpage/layouts'),
            '@userpage-components': path.resolve(__dirname, 'src/pages/userpage/components'),
            '@api-constant': path.resolve(__dirname, 'src/api'),
            '@helper': path.resolve(__dirname, 'src/helper/helper.js'),
        },
    }
};