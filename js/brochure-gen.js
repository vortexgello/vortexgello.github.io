/**
 * Quad Dimensions - Rich Brochure Image Generator
 * Uses html2canvas to render a high-fidelity, dark-themed PNG.
 * 
 * HYBRID MODE:
 * - Localhost: Generates Brochure Image (for development/creation)
 * - Production: Downloads pre-generated PDF Datasheet
 */

async function generateBrochure(productName) {
    const element = document.getElementById('pdf-template');

    if (!element) {
        console.error("Brochure Template not found!");
        return;
    }

    // Save original styles to restore later
    const originalPosition = element.style.position;
    const originalLeft = element.style.left;
    const originalTop = element.style.top;
    const originalZIndex = element.style.zIndex;

    // Move the REAL element into view for capture
    // We use fixed positioning to overlay it on top of everything
    // html2canvas needs the element to be visible in the DOM
    element.style.position = 'fixed';
    element.style.left = '0';
    element.style.top = '0';
    element.style.zIndex = '2147483647'; // Max z-index

    // Wait for layout/images to settle
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        // Generate Canvas
        const canvas = await html2canvas(element, {
            scale: 2, // High resolution (Retina-like)
            useCORS: true, // Allow cross-origin images if any
            scrollY: 0,
            windowWidth: 794,
            width: 794,
            backgroundColor: '#020617', // Match body bg
            logging: false
        });

        // Convert to PNG Data URL
        const image = canvas.toDataURL("image/png", 1.0);

        // Trigger Download
        const link = document.createElement('a');
        link.href = image;
        link.download = `QD_${productName.replace(/\s+/g, '_')}_Brochure.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("Brochure image generated successfully");

    } catch (error) {
        console.error("Image Generation failed:", error);
        alert("Could not generate brochure image. Please check the console.");
    } finally {
        // Restore original strict off-screen hiding
        element.style.position = originalPosition || 'fixed';
        element.style.left = originalLeft || '-9999px';
        element.style.top = originalTop || '0';
        element.style.zIndex = originalZIndex || '10000';
    }

}


/**
 * Sets up the datasheet button based on the environment.
 * @param {string} buttonId - ID of the button element
 * @param {string} productName - Name of the product for generation name
 * @param {string} pdfPath - Relative path to the static PDF file
 */
function setupBrochureButton(buttonId, productName, pdfPath) {
    const btn = document.getElementById(buttonId);
    if (!btn) return;

    // Check hostname
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

    if (isLocal) {
        // Development: Generate Image
        btn.innerText = "Generate Brochure (Dev)";
        btn.innerHTML = "Generate Brochure (Dev)"; // Ensure text updates
        btn.onclick = (e) => {
            e.preventDefault();
            generateBrochure(productName);
        };
        console.log("Datasheet Mode: Generative (Local)");
    } else {
        // Production: Link to Static PDF
        btn.innerText = "Download Datasheet";
        btn.innerHTML = "Download Datasheet";
        // Remove previous onclick
        btn.onclick = null;

        // Set new behavior
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(pdfPath, '_blank');
        });
        console.log("Datasheet Mode: Static PDF (Production)");
    }
}
