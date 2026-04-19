require('dotenv').config();
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
    'plotter',
    'store'
];

// We only want to protect calculator pages
const isCalculatorPage = (path) => path.toLowerCase().includes('calc');

const password = process.env.INTERNAL_PAGE_PASSWORD || 'Vortex2026!';

const gateScript = `
<script>
(function() {
  const p = "${password}";
  if (sessionStorage.getItem('v_auth') === 'true') return;
  const input = prompt("Access Restricted. Enter Password:");
  if (input === p) {
    sessionStorage.setItem('v_auth', 'true');
  } else {
    document.documentElement.innerHTML = "<html><body style='background:#0f172a;color:#ef4444;display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;flex-direction:column;'><h1>403 Forbidden</h1><p>Incorrect credentials.</p><a href='/index.html' style='color:#38bdf8;margin-top:20px;text-decoration:none;'>&larr; Return Home</a></body></html>";
    window.stop();
    throw new Error('Unauthorized access');
  }
})();
</script>
`;

function copyRecursive(src, dest, relativePath = '') {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(childItemName => {
            const childRelPath = relativePath ? path.join(relativePath, childItemName) : childItemName;
            copyRecursive(path.join(src, childItemName), path.join(dest, childItemName), childRelPath);
        });
    } else {
        const ext = path.extname(src).toLowerCase();
        // Normalize backslashes to forward slashes for cross-platform matching
        const normalizedPath = relativePath.split(path.sep).join('/');

        // Determine if page should be protected
        const isProtected = isCalculatorPage(normalizedPath);

        if (ext === '.html' && isProtected) {
            console.log('Protecting: ' + normalizedPath);
            let content = fs.readFileSync(src, 'utf8');
            if (content.includes('<head>')) {
                content = content.replace('<head>', '<head>' + gateScript);
            } else {
                content = gateScript + content;
            }
            fs.writeFileSync(dest, content);
        } else {
            fs.copyFileSync(src, dest);
        }
    }
}

items.forEach(item => {
    const srcPath = path.join(__dirname, item);
    if (fs.existsSync(srcPath)) {
        copyRecursive(srcPath, path.join(distDir, item), item);
    }
});

console.log('Build completed: Assets copied to dist/ with security injections.');
