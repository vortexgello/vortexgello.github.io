/**
 * Quad Dimensions - Rich PDF Brochure Generator
 * Uses html2pdf.js to render a high-fidelity, dark-themed PDF.
 */

async function generatePDF(productName) {
    const element = document.getElementById('pdf-template');

    if (!element) {
        console.error("PDF Template not found!");
        return;
    }

    // Save original styles to restore later
    const originalPosition = element.style.position;
    const originalLeft = element.style.left;
    const originalTop = element.style.top;
    const originalZIndex = element.style.zIndex;

    // Move the REAL element into view (don't clone, or we lose ID-based CSS)
    // We use fixed positioning to overlay it on top of everything
    element.style.position = 'fixed';
    element.style.left = '0';
    element.style.top = '0';
    element.style.zIndex = '2147483647'; // Max z-index

    // Wait for layout/images
    await new Promise(resolve => setTimeout(resolve, 500));

    // populate dynamic data if needed (currently static in template for simplicity, 
    // but can be extended to pull from page content)

    const opt = {
        margin: 0,
        filename: `QD_${productName.replace(/\s+/g, '_')}_Datasheet.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            scrollY: 0,
            windowWidth: 794,
            width: 794,
            backgroundColor: '#020617' // Match body bg
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        // Generate PDF from the live element
        await html2pdf().set(opt).from(element).save();
        console.log("PDF generated successfully");
    } catch (error) {
        console.error("PDF Generation failed:", error);
        alert("Could not generate PDF. Please check the console for errors.");
    } finally {
        // Restore original strict off-screen hiding
        element.style.position = originalPosition || 'fixed';
        element.style.left = originalLeft || '-9999px';
        element.style.top = originalTop || '0';
        element.style.zIndex = originalZIndex || '10000';
    }
}
