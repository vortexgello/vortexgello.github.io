const fs = require('fs');
const path = require('path');

const baseDir = 'h:\\\\Documents\\\\GitHub\\\\vortexgello.github.io';
const indexHtmlPaths = [
    'store\\\\index.html',
    'store\\\\solar-sail.html',
    'store\\\\equinox-hinge.html',
    'store\\\\cubesat_selfie.html',
    'store\\\\booms.html',
    'store\\\\boom2.html',
    'store\\\\boom-configurator.html'
];

for (const f of indexHtmlPaths) {
    const fullPath = path.join(baseDir, f);
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/class="brand-title-hero">GYROID/g, 'class="brand-title-hero" style="color: #fff;">GYROID');
    content = content.replace(/img src="\.\.\/images\/gyroid_logo\.png" alt="Logo" class="hero-logo"/g, 'img src="../images/gyroid_logo_header.png" alt="Logo" class="hero-logo"');
    content = content.replace(/img src="\.\.\/images\/gyroid_logo\.png" alt="VT"/g, 'img src="../images/gyroid_logo_header.png" alt="VT"');
    fs.writeFileSync(fullPath, content, 'utf8');
}
console.log('Replaced header logo and colored Gyroid white in Store HTML files!');
