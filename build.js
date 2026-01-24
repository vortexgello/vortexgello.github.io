const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

const items = [
    'books.html',
    'index.html',
    'index_2.html',
    'notes.html',
    'styles.css',
    'robots.txt',
    'sitemap.xml',
    'images',
    'pages',
    'plotter'
];

function copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursive(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

items.forEach(item => {
    const srcPath = path.join(__dirname, item);
    if (fs.existsSync(srcPath)) {
        copyRecursive(srcPath, path.join(distDir, item));
    }
});

console.log('Build completed: Assets copied to dist/');
