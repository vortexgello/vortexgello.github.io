const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const storeDir = path.join(__dirname, 'store');

// Ensure dist directory exists
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir);

// 1. Copy Static Assets (styles, images, pages, js) from Root to Dist
const assets = ['styles.css', 'images', 'pages', 'js', 'robots.txt'];

function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) return;
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

assets.forEach(asset => {
    copyRecursive(path.join(__dirname, asset), path.join(distDir, asset));
});

// 1.5 Copy Datasheets from store folder
copyRecursive(path.join(storeDir, 'Datasheets'), path.join(distDir, 'Datasheets'));

// 2. Process Store HTML files
// Move store/*.html -> dist/*.html and rewrite paths
fs.readdirSync(storeDir).forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(storeDir, file), 'utf8');

        // Rewrite Paths: Remove exactly one "../" prefix
        // Handles href="../..." and src="../..."
        content = content.replace(/(href|src)="(\.\.\/)/g, '$1="');

        // Special case: Navigation to Main Hompage
        // We want "Home" to still go to the main domain if possible, or just stay relative.
        // For now, removing "../" makes "index.html" refer to "store/index.html" (which is now root index.html),
        // which is correct for the Store Site's homepage.
        // But links to "portfolio.html" (main site) might need attention if we want cross-domain nav.
        // For this specific request, we just want the Store Site to work self-contained.

        fs.writeFileSync(path.join(distDir, file), content);
    }
});

console.log('Store Build completed: Assets flattened and copied to dist/');
