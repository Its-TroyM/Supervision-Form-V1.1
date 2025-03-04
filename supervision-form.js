/**
     * Create blank PDF template optimized for printing and manual completion
     * @param {string} filename Filename for the PDF
     */
function createPrintableBlankPDF(filename) {
    try {
        // Create PDF using jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'pt', 'a4');
        
        // PDF dimensions and margins
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 40;
        const contentWidth = pageWidth - (2 * margin);
        
        // Add header
        doc.setFontSize(16);
        doc.setTextColor(112, 48, 160); // Primary color
        doc.text('Wayne Center - Clinical Supervision Form', margin, margin);
        
        let yOffset = margin + 30;
        
        // Add blank form indicator
        doc.setFontSize(14);
        doc.setTextColor(112, 48, 160);
        doc.text('BLANK TEMPLATE FOR MANUAL COMPLETION', margin, yOffset);
        yOffset += 30;
        doc.setTextColor(0, 0, 0);
        
        // Add basic info fields with blank lines for manual completion
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(150, 150, 150);
        
        // Date field
        doc.text('Supervision Date: ', margin, yOffset);
        doc.line(margin + 120, yOffset, margin + 300, yOffset);
        yOffset += 25;
        
        doc.text('Supervisor Name: ', margin, yOffset);
        doc.line(margin + 120, yOffset, margin + 300, yOffset);
        yOffset += 25;
        
        doc.text('Supervisor Title: ', margin, yOffset);
        doc.line(margin + 120, yOffset, margin + 300, yOffset);
        yOffset += 25;
        
        doc.text('Staff Name: ', margin, yOffset);
        doc.line(margin + 120, yOffset, margin + 300, yOffset);
        yOffset += 25;
        
        doc.text('Staff Title: ', margin, yOffset);
        doc.line(margin + 120, yOffset, margin + 300, yOffset);
        yOffset += 25;
        
        doc.text('Caseload Count: ', margin, yOffset);
        doc.line(margin + 120, yOffset, margin + 300, yOffset);
        yOffset += 25;
        
        doc.text('Review Type:', margin, yOffset);
        
        // Create check boxes
        doc.rect(margin + 120, yOffset - 10, 15, 15);
        doc.text('General Review', margin + 145, yOffset);
        
        doc.rect(margin + 250, yOffset - 10, 15, 15);
        doc.text('Client-Specific Review', margin + 275, yOffset);
        
        yOffset += 40;
        
        // ===== ASSESSMENTS SECTION =====
        doc.setFontSize(14);
        doc.setTextColor(112, 48, 160);
        doc.text("Assessments", margin, yOffset);
        yOffset += 25;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setDrawColor(150, 150, 150);
        
        // Create assessment table
        const assessmentItems = ["Biopsychosocials", "BHTEDs", "MichiCANS"];
        const optionLabels = ["<25%", "<50%", "<75%", "<100%", "N/A"];
        
        for (let i = 0; i < assessmentItems.length; i++) {
            doc.text(assessmentItems[i], margin, yOffset);
            yOffset += 20;
            
            // Create option checkboxes
            for (let j = 0; j < optionLabels.length; j++) {
                const xPos = margin + 50 + (j * 80);
                doc.rect(xPos, yOffset - 15, 15, 15);
                doc.text(optionLabels[j], xPos + 20, yOffset);
            }
            yOffset += 20;
            
            // Comments field
            doc.text("Comments:", margin, yOffset);
            yOffset += 5;
            doc.rect(margin, yOffset, contentWidth, 60);
            yOffset += 80;
        }
        
        // ===== IPOS SECTION =====
        // Check if we need a new page
        if (yOffset + 200 > pageHeight - margin) {
            doc.addPage();
            yOffset = margin;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(112, 48, 160);
        doc.text("IPOS & Addendums", margin, yOffset);
        yOffset += 25;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        const iposItems = ["Unsigned Documents", "PCP/ IPOS due in next 60 days"];
        
        for (let i = 0; i < iposItems.length; i++) {
            doc.text(iposItems[i], margin, yOffset);
            
            // Count box
            doc.text("Count:", margin + 250, yOffset);
            doc.rect(margin + 300, yOffset - 15, 60, 20);
            
            yOffset += 30;
            
            // Comments field
            doc.text("Comments:", margin, yOffset);
            yOffset += 5;
            doc.rect(margin, yOffset, contentWidth, 40);
            yOffset += 60;
        }
        
        // ===== IN-SERVICE SECTION =====
        // Check if we need a new page
        if (yOffset + 150 > pageHeight - margin) {
            doc.addPage();
            yOffset = margin;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(112, 48, 160);
        doc.text("In-service", margin, yOffset);
        yOffset += 25;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        // In-service items
        doc.text("In-services in last 30 days", margin, yOffset);
        
        // Count box
        doc.text("Count:", margin + 250, yOffset);
        doc.rect(margin + 300, yOffset - 15, 60, 20);
        
        yOffset += 30;
        
        // Comments field
        doc.text("Comments:", margin, yOffset);
        yOffset += 5;
        doc.rect(margin, yOffset, contentWidth, 40);
        yOffset += 60;
        
        // ===== COORDINATION OF CARE SECTION =====
        // Check if we need a new page
        if (yOffset + 200 > pageHeight - margin) {
            doc.addPage();
            yOffset = margin;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(112, 48, 160);
        doc.text("Coordination of Care", margin, yOffset);
        yOffset += 25;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        const coordItems = ["Consents faxed within past 30 days", "Clinical Documentation Uploaded to MHWIN"];
        
        for (let i = 0; i < coordItems.length; i++) {
            doc.text(coordItems[i], margin, yOffset);
            
            // Count box
            doc.text("Count:", margin + 250, yOffset);
            doc.rect(margin + 300, yOffset - 15, 60, 20);
            
            yOffset += 30;
            
            // Comments field
            doc.text("Comments:", margin, yOffset);
            yOffset += 5;
            doc.rect(margin, yOffset, contentWidth, 40);
            yOffset += 60;
        }
        
        // ===== GUARDIANSHIP SECTION =====
        // Check if we need a new page
        if (yOffset + 150 > pageHeight - margin) {
            doc.addPage();
            yOffset = margin;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(112, 48, 160);
        doc.text("Guardianship", margin, yOffset);
        yOffset += 25;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        // Guardianship items
        doc.text("Expiring in next 30 days", margin, yOffset);
        
        // Count box
        doc.text("Count:", margin + 250, yOffset);
        doc.rect(margin + 300, yOffset - 15, 60, 20);
        
        yOffset += 30;
        
        // Comments field
        doc.text("Comments:", margin, yOffset);
        yOffset += 5;
        doc.rect(margin, yOffset, contentWidth, 40);
        yOffset += 60;
        
        // ===== SERVICE ACTIVITIES SECTION =====
        // Check if we need a new page
        if (yOffset + 350 > pageHeight - margin) {
            doc.addPage();
            yOffset = margin;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(112, 48, 160);
        doc.text("Service Activities", margin, yOffset);
        yOffset += 25;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Month in Review", margin, yOffset);
        yOffset += 20;
        
        const activityItems = [
            "Billable Service Activities", 
            "Face to Face", 
            "Telehealth", 
            "Member's not seen in 30 days",
            "Number of notes entered after 48 hours"
        ];
        
        for (let i = 0; i < activityItems.length; i++) {
            doc.text(activityItems[i], margin, yOffset);
            
            // Count box
            doc.text("Count:", margin + 250, yOffset);
            doc.rect(margin + 300, yOffset - 15, 60, 20);
            
            yOffset += 30;
            
            // Comments field
            doc.text("Comments:", margin, yOffset);
            yOffset += 5;
            doc.rect(margin, yOffset, contentWidth, 40);
            yOffset += 60;
        }
        
        // ===== CASE REVIEW SECTION =====
        // Always start on a new page for case review
        doc.addPage();
        yOffset = margin;
        
        doc.setFontSize(14);
        doc.setTextColor(112, 48, 160);
        doc.text("Case Review", margin, yOffset);
        yOffset += 25;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        // Client info
        doc.text("Client #:", margin, yOffset);
        doc.line(margin + 80, yOffset, margin + 200, yOffset);
        
        doc.text("IPOS Active Date:", margin + 220, yOffset);
        doc.line(margin + 330, yOffset, margin + 450, yOffset);
        
        yOffset += 30;
        
        // Create table structure for case review items
        const reviewItems = [
            "Annual Consents Up to date and Signed",
            "Coordination of Care Confirmation Fax",
            "Bio Up to date and signed",
            "Guardianship Current",
            "Up to date Physical",
            "Diabetes Screening",
            "Medication Review Uploaded",
            "Health and Safety Checklist Up to Date",
            "IPOS Status",
            "Goals are SMART with complete interventions",
            "The individual plan of service adequately identifies the individual's goals and preferences",
            "Authorizations entered",
            "Member/Guardian Signature on IPOS",
            "Residential/CLS Assessment",
            "Referrals for Service"
        ];
        
        // Column headers
        doc.text("Item", margin, yOffset);
        doc.text("Met", margin + 250, yOffset);
        doc.text("Partially", margin + 300, yOffset);
        doc.text("Not Met", margin + 360, yOffset);
        doc.text("N/A", margin + 420, yOffset);
        
        yOffset += 20;
        
        // Draw items with checkboxes
        for (let i = 0; i < reviewItems.length; i++) {
            // Check if we need a new page
            if (yOffset + 60 > pageHeight - margin) {
                doc.addPage();
                yOffset = margin;
                
                // Repeat column headers on new page
                doc.text("Item", margin, yOffset);
                doc.text("Met", margin + 250, yOffset);
                doc.text("Partially", margin + 300, yOffset);
                doc.text("Not Met", margin + 360, yOffset);
                doc.text("N/A", margin + 420, yOffset);
                yOffset += 20;
            }
            
            // Item text - wrap if needed
            doc.text(reviewItems[i], margin, yOffset);
            
            // Checkboxes
            doc.rect(margin + 250, yOffset - 10, 15, 15);
            doc.rect(margin + 300, yOffset - 10, 15, 15);
            doc.rect(margin + 360, yOffset - 10, 15, 15);
            doc.rect(margin + 420, yOffset - 10, 15, 15);
            
            yOffset += 30;
            
            // Comments field
            doc.text("Comments:", margin, yOffset);
            yOffset += 5;
            doc.rect(margin, yOffset, contentWidth, 30);
            yOffset += 45;
        }
        
        // ===== ADDITIONAL COMMENTS SECTION =====
        // Check if we need a new page
        if (yOffset + 250 > pageHeight - margin) {
            doc.addPage();
            yOffset = margin;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(112, 48, 160);
        doc.text("Additional Comments", margin, yOffset);
        yOffset += 25;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        // Large text area for comments
        doc.rect(margin, yOffset, contentWidth, 200);
        yOffset += 220;
        
        // ===== SIGNATURES SECTION =====
        // Check if we need a new page
        if (yOffset + 250 > pageHeight - margin) {
            doc.addPage();
            yOffset = margin;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(112, 48, 160);
        doc.text("Signatures", margin, yOffset);
        yOffset += 25;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        doc.text("By signing below, staff acknowledges they have participated in this supervision session and reviewed the contents of this form.", margin, yOffset, { maxWidth: contentWidth });
        yOffset += 30;
        
        // Staff signature
        doc.text("Staff Signature:", margin, yOffset);
        yOffset += 10;
        doc.rect(margin, yOffset, 250, 80);
        doc.text("Date:", margin + 270, yOffset + 40);
        doc.line(margin + 310, yOffset + 40, margin + 450, yOffset + 40);
        
        yOffset += 100;
        
        // Supervisor signature
        doc.text("Supervisor Signature:", margin, yOffset);
        yOffset += 10;
        doc.rect(margin, yOffset, 250, 80);
        doc.text("Date:", margin + 270, yOffset + 40);
        doc.line(margin + 310, yOffset + 40, margin + 450, yOffset + 40);
        
        // Add footer with page numbers
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text('BLANK FORM FOR MANUAL COMPLETION', margin, pageHeight - 20);
            doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 60, pageHeight - 20, { align: 'right' });
        }
        
        // Save the PDF
        doc.save(filename);
        return true;
        
    } catch (error) {
        console.error('Error creating printable blank PDF:', error);
        showNotification('Error creating blank PDF: ' + error.message, true);
        return false;
    }
}/**
* Wayne Center - Clinical Supervision Form
* 
* This script handles form functionality including:
* - Section toggling
* - Form validation
* - Data persistence (localStorage)
* - PDF generation
* - Review type switching
* - Signature capture
*/

document.addEventListener('DOMContentLoaded', function() {
// DOM Elements
const form = document.getElementById('supervisionForm');
const reviewType = document.getElementById('reviewType');
const caseReviewButton = document.getElementById('caseReviewButton');
const saveAsPdfButton = document.getElementById('saveAsPdf');
const saveDraftButton = document.getElementById('saveDraft');
const clearFormButton = document.getElementById('clearForm');
const blankPdfButton = document.getElementById('blankPdfButton');
const loadingOverlay = document.getElementById('loadingOverlay');
const notification = document.getElementById('notification');

// Signature Elements
const staffSignatureCanvas = document.getElementById('staffSignature');
const supervisorSignatureCanvas = document.getElementById('supervisorSignature');
const clearStaffSignatureButton = document.getElementById('clearStaffSignature');
const clearSupervisorSignatureButton = document.getElementById('clearSupervisorSignature');

// Signature contexts
let staffSignatureCtx = staffSignatureCanvas ? staffSignatureCanvas.getContext('2d') : null;
let supervisorSignatureCtx = supervisorSignatureCanvas ? supervisorSignatureCanvas.getContext('2d') : null;

// Signature drawing variables
let isDrawing = false;
let activeCanvas = null;
let activeCtx = null;

// Get all toggle buttons and section contents
const toggleButtons = document.querySelectorAll('.toggle-button');
const sectionContents = document.querySelectorAll('.section-content');

// Form fields that are required
const requiredFields = document.querySelectorAll('input[required], select[required]');

// Generate a unique form ID based on date/time if not already stored
let formId = localStorage.getItem('currentFormId');
if (!formId) {
    formId = 'form_' + Date.now();
    localStorage.setItem('currentFormId', formId);
}

// Initialize the form state
initializeForm();

/**
 * Sets up the initial form state
 */
function initializeForm() {
    // Load saved draft if available
    loadFormState();
    
    // Set up review type change handler
    reviewType.addEventListener('change', handleReviewTypeChange);
    
    // Set initial review type display
    handleReviewTypeChange();
    
    // Set up toggle buttons
    setupToggleButtons();
    
    // Set up form validation
    setupValidation();
    
    // Set up automatic saving
    setupAutoSave();
    
    // Set up signature functionality
    setupSignatures();
    
    // Set up button event listeners
    if (saveDraftButton) {
        saveDraftButton.addEventListener('click', saveFormState);
    }
    
    if (saveAsPdfButton) {
        saveAsPdfButton.addEventListener('click', generatePDF);
    }
    
    if (clearFormButton) {
        clearFormButton.addEventListener('click', confirmClearForm);
    }
    
    if (blankPdfButton) {
        blankPdfButton.addEventListener('click', createBlankPDF);
    }
    
    // Set today's date as default for signature dates if not already set
    const today = new Date().toISOString().split('T')[0];
    const staffSignatureDate = document.getElementById('staffSignatureDate');
    const supervisorSignatureDate = document.getElementById('supervisorSignatureDate');
    
    if (staffSignatureDate && !staffSignatureDate.value) {
        staffSignatureDate.value = today;
    }
    
    if (supervisorSignatureDate && !supervisorSignatureDate.value) {
        supervisorSignatureDate.value = today;
    }
}

/**
 * Toggle section visibility when header is clicked
 */
function setupToggleButtons() {
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            
            button.classList.toggle('active');
            button.setAttribute('aria-expanded', button.classList.contains('active'));
            
            section.classList.toggle('active');
            section.setAttribute('aria-hidden', !section.classList.contains('active'));
        });
    });
}

/**
 * Handle review type changes (General vs Client-Specific)
 */
function handleReviewTypeChange() {
    const isClientReview = reviewType.value === 'client';
    
    toggleButtons.forEach(button => {
        const sectionId = button.getAttribute('data-section');
        
        if (isClientReview) {
            // For client review, only show Case Review and Additional Comments
            if (sectionId === 'case-review-section' || sectionId === 'comments-section') {
                button.style.display = 'block';
                
                // Auto-expand the case review section for client-specific reviews
                if (sectionId === 'case-review-section') {
                    button.classList.add('active');
                    button.setAttribute('aria-expanded', true);
                    document.getElementById(sectionId).classList.add('active');
                    document.getElementById(sectionId).setAttribute('aria-hidden', false);
                }
            } else {
                button.style.display = 'none';
                // Hide and deactivate other sections
                const section = document.getElementById(sectionId);
                section.classList.remove('active');
                section.setAttribute('aria-hidden', true);
                button.classList.remove('active');
                button.setAttribute('aria-expanded', false);
            }
        } else {
            // For general review, show all buttons except Case Review
            if (sectionId === 'case-review-section') {
                button.style.display = 'none';
                const section = document.getElementById(sectionId);
                section.classList.remove('active');
                section.setAttribute('aria-hidden', true);
                button.classList.remove('active');
                button.setAttribute('aria-expanded', false);
            } else {
                button.style.display = 'block';
            }
        }
    });
}

/**
 * Set up form validation
 */
function setupValidation() {
    // Clear error styling on input
    requiredFields.forEach(field => {
        field.addEventListener('input', function() {
            this.style.borderColor = '';
            const errorMsg = document.getElementById(this.id + 'Error');
            if (errorMsg) errorMsg.textContent = '';
        });
    });
}

/**
 * Validate the form before submission
 * @returns {boolean} True if form is valid, false otherwise
 */
function validateForm() {
    let isValid = true;
    
    // Check required fields
    requiredFields.forEach(field => {
        const errorElement = document.getElementById(field.id + 'Error');
        
        if (!field.value) {
            isValid = false;
            field.style.borderColor = 'var(--error-color)';
            
            if (errorElement) {
                errorElement.textContent = 'This field is required';
            }
            
            // Ensure the section containing this field is visible
            const section = field.closest('.section-content');
            if (section && !section.classList.contains('active')) {
                const sectionId = section.id;
                const button = document.querySelector(`[data-section="${sectionId}"]`);
                if (button) {
                    button.click();
                }
            }
        } else {
            field.style.borderColor = '';
            if (errorElement) {
                errorElement.textContent = '';
            }
        }
    });
    
    // Check if signatures are present
    if (staffSignatureCanvas) {
        const isStaffSigned = isSignaturePresent(staffSignatureCtx, staffSignatureCanvas.width, staffSignatureCanvas.height);
        if (!isStaffSigned) {
            isValid = false;
            staffSignatureCanvas.style.borderColor = 'var(--error-color)';
            
            // Make sure the signatures section is visible
            const signaturesSection = document.getElementById('signatures-section');
            if (signaturesSection && !signaturesSection.classList.contains('active')) {
                const button = document.querySelector('[data-section="signatures-section"]');
                if (button) {
                    button.click();
                }
            }
            
            showNotification('Staff signature is required', true);
        } else {
            staffSignatureCanvas.style.borderColor = '';
        }
    }
    
    if (!isValid) {
        showNotification('Please complete all required fields and signatures', true);
    }
    
    return isValid;
}

/**
 * Check if signature is present (not just a blank canvas)
 * @param {CanvasRenderingContext2D} ctx Canvas context
 * @param {number} width Canvas width
 * @param {number} height Canvas height
 * @returns {boolean} True if signature is present
 */
function isSignaturePresent(ctx, width, height) {
    if (!ctx) return false;
    
    // Get image data and check if any non-white pixels exist
    const imageData = ctx.getImageData(0, 0, width, height).data;
    const numPixels = imageData.length / 4; // Each pixel has 4 values (r,g,b,a)
    
    for (let i = 0; i < numPixels; i++) {
        const r = imageData[i * 4];
        const g = imageData[i * 4 + 1];
        const b = imageData[i * 4 + 2];
        
        // Check if the pixel is not white
        if (r < 255 || g < 255 || b < 255) {
            return true;
        }
    }
    
    return false;
}

/**
 * Set up auto-save functionality
 */
function setupAutoSave() {
    // Auto-save form state when inputs change
    const formInputs = form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('change', debounce(() => {
            saveFormState(true); // true = silent save (no notification)
        }, 500));
        
        if (input.tagName === 'TEXTAREA') {
            input.addEventListener('input', debounce(() => {
                saveFormState(true);
            }, 1000));
        }
    });
}

/**
 * Save the current form state to localStorage
 * @param {boolean} silent If true, don't show a notification
 */
function saveFormState(silent = false) {
    const formData = {};
    
    // Get all form inputs
    const formInputs = form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        if (input.type === 'radio') {
            if (input.checked) {
                formData[input.name] = input.value;
            }
        } else if (input.type === 'checkbox') {
            formData[input.id] = input.checked;
        } else {
            formData[input.id] = input.value;
        }
    });
    
    // Also save which sections are expanded
    const expandedSections = [];
    toggleButtons.forEach(button => {
        if (button.classList.contains('active')) {
            expandedSections.push(button.getAttribute('data-section'));
        }
    });
    formData._expandedSections = expandedSections;
    
    // Save signatures
    if (staffSignatureCanvas) {
        formData._staffSignature = staffSignatureCanvas.toDataURL();
    }
    
    if (supervisorSignatureCanvas) {
        formData._supervisorSignature = supervisorSignatureCanvas.toDataURL();
    }
    
    // Add timestamp
    formData._lastSaved = new Date().toISOString();
    
    // Save to localStorage
    localStorage.setItem(`formData_${formId}`, JSON.stringify(formData));
    
    // Also save to formList for later retrieval
    updateFormList(formData);
    
    if (!silent) {
        showNotification('Form draft saved successfully');
    }
}

/**
 * Update the list of saved forms
 * @param {Object} formData The form data being saved
 */
function updateFormList(formData) {
    let formList = JSON.parse(localStorage.getItem('formList') || '[]');
    
    // Check if this form is already in the list
    const existingIndex = formList.findIndex(item => item.id === formId);
    
    const formMeta = {
        id: formId,
        supervisorName: formData.supervisorName || 'Unknown Supervisor',
        staffName: formData.staffName || 'Unknown Staff',
        date: formData.supervisionDate || 'Unknown Date',
        reviewType: formData.reviewType || 'general',
        lastSaved: formData._lastSaved
    };
    
    if (existingIndex >= 0) {
        formList[existingIndex] = formMeta;
    } else {
        formList.push(formMeta);
    }
    
    localStorage.setItem('formList', JSON.stringify(formList));
}

/**
 * Load saved form state from localStorage
 */
function loadFormState() {
    const savedData = localStorage.getItem(`formData_${formId}`);
    
    if (savedData) {
        const formData = JSON.parse(savedData);
        
        // Populate form fields
        Object.keys(formData).forEach(key => {
            // Skip metadata fields
            if (key.startsWith('_') && key !== '_staffSignature' && key !== '_supervisorSignature') return;
            
            // Handle signatures separately
            if (key === '_staffSignature' && staffSignatureCanvas) {
                loadSignatureFromDataURL(staffSignatureCtx, formData[key]);
                return;
            }
            
            if (key === '_supervisorSignature' && supervisorSignatureCanvas) {
                loadSignatureFromDataURL(supervisorSignatureCtx, formData[key]);
                return;
            }
            
            const element = document.getElementById(key);
            if (!element) {
                // Check if it's a radio button group
                const radioButtons = document.getElementsByName(key);
                if (radioButtons.length) {
                    radioButtons.forEach(radio => {
                        if (radio.value === formData[key]) {
                            radio.checked = true;
                        }
                    });
                }
                return;
            }
            
            if (element.type === 'checkbox') {
                element.checked = formData[key];
            } else if (element.type !== 'radio') {
                element.value = formData[key];
            }
        });
        
        // Expand previously expanded sections
        if (formData._expandedSections) {
            formData._expandedSections.forEach(sectionId => {
                const button = document.querySelector(`[data-section="${sectionId}"]`);
                const section = document.getElementById(sectionId);
                
                if (button && section) {
                    button.classList.add('active');
                    button.setAttribute('aria-expanded', true);
                    section.classList.add('active');
                    section.setAttribute('aria-hidden', false);
                }
            });
        }
        
        // Show a notification
        showNotification('Form draft loaded');
    }
}

/**
 * Load signature from dataURL
 * @param {CanvasRenderingContext2D} ctx Canvas context
 * @param {string} dataURL Signature dataURL
 */
function loadSignatureFromDataURL(ctx, dataURL) {
    if (!ctx || !dataURL) return;
    
    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
    };
    img.src = dataURL;
}

/**
 * Set up signature functionality
 */
function setupSignatures() {
    if (!staffSignatureCanvas || !supervisorSignatureCanvas) return;
    
    // Initialize signature canvases with white background
    initializeCanvas(staffSignatureCtx, staffSignatureCanvas.width, staffSignatureCanvas.height);
    initializeCanvas(supervisorSignatureCtx, supervisorSignatureCanvas.width, supervisorSignatureCanvas.height);
    
    // Clear signature buttons
    if (clearStaffSignatureButton) {
        clearStaffSignatureButton.addEventListener('click', () => {
            clearSignature(staffSignatureCtx, staffSignatureCanvas.width, staffSignatureCanvas.height);
            saveFormState(true); // Silent save
        });
    }
    
    if (clearSupervisorSignatureButton) {
        clearSupervisorSignatureButton.addEventListener('click', () => {
            clearSignature(supervisorSignatureCtx, supervisorSignatureCanvas.width, supervisorSignatureCanvas.height);
            saveFormState(true); // Silent save
        });
    }
    
    // Staff signature drawing events
    setupSignatureEvents(staffSignatureCanvas, staffSignatureCtx);
    
    // Supervisor signature drawing events
    setupSignatureEvents(supervisorSignatureCanvas, supervisorSignatureCtx);
}

/**
 * Initialize canvas with white background
 * @param {CanvasRenderingContext2D} ctx Canvas context
 * @param {number} width Canvas width
 * @param {number} height Canvas height
 */
function initializeCanvas(ctx, width, height) {
    if (!ctx) return;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'black';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

/**
 * Clear signature canvas
 * @param {CanvasRenderingContext2D} ctx Canvas context
 * @param {number} width Canvas width
 * @param {number} height Canvas height
 */
function clearSignature(ctx, width, height) {
    if (!ctx) return;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'black';
}

/**
 * Set up signature drawing events for a canvas
 * @param {HTMLCanvasElement} canvas The signature canvas
 * @param {CanvasRenderingContext2D} ctx The canvas context
 */
function setupSignatureEvents(canvas, ctx) {
    if (!canvas || !ctx) return;
    
    // Start drawing
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('touchstart', handleTouchStart);
    
    // Draw
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchmove', handleTouchMove);
    
    // Stop drawing
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Functions for drawing
    function startDrawing(e) {
        isDrawing = true;
        activeCanvas = canvas;
        activeCtx = ctx;
        draw(e);
    }
    
    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }
    
    function draw(e) {
        if (!isDrawing || activeCanvas !== canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        
        // Auto-save the signature after a small delay
        debounce(() => {
            saveFormState(true); // Silent save
        }, 1000)();
    }
    
    function handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }
    
    function stopDrawing() {
        if (isDrawing && activeCanvas === canvas) {
            isDrawing = false;
            activeCanvas = null;
            activeCtx = null;
            ctx.beginPath();
            
            // Save the signature
            saveFormState(true); // Silent save
        }
    }
}

/**
 * Generate a PDF of the completed form
 */
function generatePDF() {
    if (!validateForm()) {
        return;
    }
    
    try {
        // Show loading overlay
        loadingOverlay.classList.add('active');
        
        // Get form values
        const supervisorName = document.getElementById('supervisorName').value || 'Unknown_Supervisor';
        const staffName = document.getElementById('staffName').value || 'Unknown_Staff';
        const reviewTypeValue = document.getElementById('reviewType').value;
        const dateValue = document.getElementById('supervisionDate').value || new Date().toISOString().split('T')[0];
        
        // Generate filename
        const filename = `Clinical_Supervision_${supervisorName.replace(/\s+/g, '_')}_${staffName.replace(/\s+/g, '_')}_${reviewTypeValue}_${dateValue}.pdf`;
        
        // Generate the PDF
        createPDF(filename, false)
            .then(() => {
                showNotification('PDF generated successfully');
            })
            .catch(error => {
                console.error('Error generating PDF:', error);
                showNotification('Error generating PDF. Please try again.', true);
            })
            .finally(() => {
                // Hide loading overlay
                loadingOverlay.classList.remove('active');
            });
        
    } catch (error) {
        console.error('Error in generatePDF:', error);
        showNotification('Error generating PDF. Please try again.', true);
        loadingOverlay.classList.remove('active');
    }
}

/**
 * Generate a blank PDF template
 */
function createBlankPDF() {
    try {
        console.log('Creating blank PDF...');
        
        // Show loading overlay
        loadingOverlay.classList.add('active');
        showNotification('Creating blank PDF...');
        
        // Create printable blank PDF directly instead of using the complex approach
        const success = createPrintableBlankPDF('Wayne_Center_Clinical_Supervision_Form_Blank.pdf');
        
        if (success) {
            showNotification('Blank PDF template created successfully');
        } else {
            showNotification('Error creating blank PDF', true);
        }
        
    } catch (error) {
        console.error('Error in createBlankPDF:', error);
        showNotification('Error creating blank PDF', true);
    } finally {
        // Hide loading overlay
        loadingOverlay.classList.remove('active');
    }
}

/**
 * Save current form data to a temporary object
 * @returns {Object} Form data object
 */
function saveCurrentFormData() {
    const data = {};
    
    // Save all form inputs
    const formInputs = form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        if (input.type === 'radio') {
            if (input.checked) {
                data[input.name] = input.value;
                data[`${input.name}_checked`] = input.id;
            }
        } else if (input.type === 'checkbox') {
            data[input.id] = input.checked;
        } else {
            data[input.id] = input.value;
        }
    });
    
    // Save signatures
    if (staffSignatureCanvas) {
        data._staffSignature = staffSignatureCanvas.toDataURL();
    }
    
    if (supervisorSignatureCanvas) {
        data._supervisorSignature = supervisorSignatureCanvas.toDataURL();
    }
    
    return data;
}

/**
 * Clear form for blank PDF generation
 */
function clearFormForBlankPDF() {
    // Clear text inputs and textareas
    const textInputs = form.querySelectorAll('input[type="text"], input[type="number"], textarea');
    textInputs.forEach(input => {
        input.value = '';
    });
    
    // Uncheck radio buttons
    const radioButtons = form.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.checked = false;
    });
    
    // Clear signatures
    if (staffSignatureCtx) {
        clearSignature(staffSignatureCtx, staffSignatureCanvas.width, staffSignatureCanvas.height);
    }
    
    if (supervisorSignatureCtx) {
        clearSignature(supervisorSignatureCtx, supervisorSignatureCanvas.width, supervisorSignatureCanvas.height);
    }
}

/**
 * Restore form data from saved object
 * @param {Object} data Form data to restore
 */
function restoreFormData(data) {
    // Restore basic inputs
    Object.keys(data).forEach(key => {
        // Skip signature data and special fields
        if (key === '_staffSignature' || key === '_supervisorSignature' || key.endsWith('_checked')) {
            return;
        }
        
        const element = document.getElementById(key);
        if (!element) return;
        
        if (element.type === 'checkbox') {
            element.checked = data[key];
        } else if (element.type !== 'radio') {
            element.value = data[key];
        }
    });
    
    // Restore radio buttons
    Object.keys(data).forEach(key => {
        if (key.endsWith('_checked')) {
            const radioId = data[key];
            const radio = document.getElementById(radioId);
            if (radio) {
                radio.checked = true;
            }
        }
    });
    
    // Restore signatures
    if (data._staffSignature && staffSignatureCtx) {
        loadSignatureFromDataURL(staffSignatureCtx, data._staffSignature);
    }
    
    if (data._supervisorSignature && supervisorSignatureCtx) {
        loadSignatureFromDataURL(supervisorSignatureCtx, data._supervisorSignature);
    }
}

/**
 * Create PDF document
 * @param {string} filename Filename for the PDF
 * @param {boolean} isBlank Whether this is a blank template
 * @returns {Promise} Promise that resolves when PDF is created
 */
async function createPDF(filename, isBlank) {
    // Show all relevant sections for PDF generation
    const sectionsForPdf = [];
    toggleButtons.forEach(button => {
        const sectionId = button.getAttribute('data-section');
        const section = document.getElementById(sectionId);
        
        // Only include sections that should be visible based on review type
        if (button.style.display !== 'none') {
            // Remember current state
            const wasActive = section.classList.contains('active');
            sectionsForPdf.push({ section, button, wasActive });
            
            // Make visible for PDF
            section.classList.add('active');
            section.setAttribute('aria-hidden', false);
        }
    });
    
    try {
        // Create PDF using jsPDF and html2canvas
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'pt', 'a4');
        
        // PDF dimensions and margins
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 40;
        const contentWidth = pageWidth - (2 * margin);
        
        // Add header
        doc.setFontSize(16);
        doc.setTextColor(112, 48, 160); // Primary color
        doc.text('Wayne Center - Clinical Supervision Form', margin, margin);
        
        let yOffset = margin + 30;
        
        // Add blank form indicator if needed
        if (isBlank) {
            doc.setFontSize(14);
            doc.setTextColor(112, 48, 160);
            doc.text('BLANK TEMPLATE FOR MANUAL COMPLETION', margin, yOffset);
            yOffset += 30;
            doc.setTextColor(0, 0, 0);
        }
        
        // Add basic info with blank lines for manual completion if it's a blank form
        const supervisorName = document.getElementById('supervisorName').value;
        const staffName = document.getElementById('staffName').value;
        const reviewTypeValue = document.getElementById('reviewType').value;
        const dateValue = document.getElementById('supervisionDate').value;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Black
        
        // Date field
        if (isBlank) {
            doc.text('Supervision Date: ', margin, yOffset);
            doc.setDrawColor(150, 150, 150);
            doc.line(margin + 120, yOffset, margin + 300, yOffset);
            yOffset += 25;
            
            doc.text('Supervisor Name: ', margin, yOffset);
            doc.line(margin + 120, yOffset, margin + 300, yOffset);
            yOffset += 25;
            
            doc.text('Supervisor Title: ', margin, yOffset);
            doc.line(margin + 120, yOffset, margin + 300, yOffset);
            yOffset += 25;
            
            doc.text('Staff Name: ', margin, yOffset);
            doc.line(margin + 120, yOffset, margin + 300, yOffset);
            yOffset += 25;
            
            doc.text('Staff Title: ', margin, yOffset);
            doc.line(margin + 120, yOffset, margin + 300, yOffset);
            yOffset += 25;
            
            doc.text('Caseload Count: ', margin, yOffset);
            doc.line(margin + 120, yOffset, margin + 300, yOffset);
            yOffset += 25;
            
            doc.text('Review Type:', margin, yOffset);
            
            // Create check boxes
            doc.rect(margin + 120, yOffset - 10, 15, 15);
            doc.text('General Review', margin + 145, yOffset);
            
            doc.rect(margin + 250, yOffset - 10, 15, 15);
            doc.text('Client-Specific Review', margin + 275, yOffset);
            
            yOffset += 40;
        } else {
            if (dateValue) {
                doc.text(`Supervision Date: ${dateValue}`, margin, yOffset);
                yOffset += 20;
            }
            
            if (supervisorName) {
                doc.text(`Supervisor: ${supervisorName}`, margin, yOffset);
                yOffset += 20;
            }
            
            if (staffName) {
                doc.text(`Staff: ${staffName}`, margin, yOffset);
                yOffset += 20;
            }
            
            doc.text(`Review Type: ${reviewTypeValue === 'general' ? 'General Review' : 'Client-Specific Review'}`, margin, yOffset);
            yOffset += 40;
        }
        
        // Process each visible section
        for (const sectionObj of sectionsForPdf) {
            const { section, button } = sectionObj;
            const sectionTitle = button.textContent.trim();
            
            // Add section title
            doc.setFontSize(14);
            doc.setTextColor(112, 48, 160);
            doc.text(sectionTitle, margin, yOffset);
            yOffset += 25;
            
            // Special handling for blank form - create manual fields instead of capturing sections
            if (isBlank) {
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.setDrawColor(150, 150, 150);
                
                // Assessments section
                if (sectionTitle.includes("Assessments")) {
                    // Create assessment table
                    const assessmentItems = ["Biopsychosocials", "BHTEDs", "MichiCANS"];
                    const optionLabels = ["<25%", "<50%", "<75%", "<100%", "N/A"];
                    
                    for (let i = 0; i < assessmentItems.length; i++) {
                        doc.text(assessmentItems[i], margin, yOffset);
                        yOffset += 20;
                        
                        // Create option checkboxes
                        for (let j = 0; j < optionLabels.length; j++) {
                            const xPos = margin + 50 + (j * 80);
                            doc.rect(xPos, yOffset - 15, 15, 15);
                            doc.text(optionLabels[j], xPos + 20, yOffset);
                        }
                        yOffset += 20;
                        
                        // Comments field
                        doc.text("Comments:", margin, yOffset);
                        yOffset += 5;
                        doc.rect(margin, yOffset, contentWidth, 60);
                        yOffset += 80;
                    }
                }
                // IPOS & Addendums section
                else if (sectionTitle.includes("IPOS")) {
                    const items = ["Unassigned Documents", "PCP/ IPOS due in next 60 days", "In-services in last 30 days"];
                    
                    for (let i = 0; i < items.length; i++) {
                        doc.text(items[i], margin, yOffset);
                        
                        // Count box
                        doc.text("Count:", margin + 250, yOffset);
                        doc.rect(margin + 300, yOffset - 15, 60, 20);
                        
                        yOffset += 30;
                        
                        // Comments field
                        doc.text("Comments:", margin, yOffset);
                        yOffset += 5;
                        doc.rect(margin, yOffset, contentWidth, 40);
                        yOffset += 60;
                    }
                }
                // Coordination of Care section
                else if (sectionTitle.includes("Coordination")) {
                    const items = ["Consents faxed within past 30 days", "Clinical Documentation Uploaded to MHWIN"];
                    
                    for (let i = 0; i < items.length; i++) {
                        doc.text(items[i], margin, yOffset);
                        
                        // Count box
                        doc.text("Count:", margin + 250, yOffset);
                        doc.rect(margin + 300, yOffset - 15, 60, 20);
                        
                        yOffset += 30;
                        
                        // Comments field
                        doc.text("Comments:", margin, yOffset);
                        yOffset += 5;
                        doc.rect(margin, yOffset, contentWidth, 40);
                        yOffset += 60;
                    }
                }
                // Service Activities section
                else if (sectionTitle.includes("Service Activities")) {
                    doc.text("Month in Review", margin, yOffset);
                    yOffset += 20;
                    
                    const items = ["Billable Service Activities", "Face to Face", "Telehealth", "Member's not seen in 30 days"];
                    
                    for (let i = 0; i < items.length; i++) {
                        doc.text(items[i], margin, yOffset);
                        
                        // Count box
                        doc.text("Count:", margin + 250, yOffset);
                        doc.rect(margin + 300, yOffset - 15, 60, 20);
                        
                        yOffset += 30;
                        
                        // Comments field
                        doc.text("Comments:", margin, yOffset);
                        yOffset += 5;
                        doc.rect(margin, yOffset, contentWidth, 40);
                        yOffset += 60;
                    }
                }
                // Case Review section
                else if (sectionTitle.includes("Case Review")) {
                    // Client info
                    doc.text("Client #:", margin, yOffset);
                    doc.line(margin + 80, yOffset, margin + 200, yOffset);
                    
                    doc.text("IPOS Active Date:", margin + 220, yOffset);
                    doc.line(margin + 330, yOffset, margin + 450, yOffset);
                    
                    yOffset += 30;
                    
                    // Create table structure for case review items
                    const reviewItems = [
                        "Annual Consents Up to date and Signed by member/guardian",
                        "Bio Up to date and signed",
                        "Guardianship Psychometric/LTR",
                        "Up to date Physical",
                        "Health and Safety Checklist Up to Date and Signed",
                        "IPOS Status",
                        "Goals are SMART with complete interventions and objectives",
                        "Authorizations entered",
                        "Member/Guardian Signature on Current IPOS",
                        "Residential/CLS Assessment",
                        "Referrals for Service (ABA, OT, SP, CLS, SKB, Support Emp...)"
                    ];
                    
                    // Column headers
                    doc.text("Item", margin, yOffset);
                    doc.text("Met", margin + 250, yOffset);
                    doc.text("Partially", margin + 300, yOffset);
                    doc.text("Not Met", margin + 360, yOffset);
                    doc.text("N/A", margin + 420, yOffset);
                    
                    yOffset += 20;
                    
                    // Draw items with checkboxes
                    for (let i = 0; i < reviewItems.length; i++) {
                        // Check if we need a new page
                        if (yOffset + 60 > pageHeight - margin) {
                            doc.addPage();
                            yOffset = margin;
                            
                            // Repeat column headers on new page
                            doc.text("Item", margin, yOffset);
                            doc.text("Met", margin + 250, yOffset);
                            doc.text("Partially", margin + 300, yOffset);
                            doc.text("Not Met", margin + 360, yOffset);
                            doc.text("N/A", margin + 420, yOffset);
                            yOffset += 20;
                        }
                        
                        // Item text - wrap if needed
                        const textLines = doc.splitTextToSize(reviewItems[i], 200);
                        doc.text(textLines, margin, yOffset);
                        
                        // Checkboxes
                        doc.rect(margin + 250, yOffset - 10, 15, 15);
                        doc.rect(margin + 300, yOffset - 10, 15, 15);
                        doc.rect(margin + 360, yOffset - 10, 15, 15);
                        doc.rect(margin + 420, yOffset - 10, 15, 15);
                        
                        yOffset += 30;
                        
                        // Comments field
                        doc.text("Comments:", margin, yOffset);
                        yOffset += 5;
                        doc.rect(margin, yOffset, contentWidth, 30);
                        yOffset += 45;
                    }
                }
                // Additional Comments section
                else if (sectionTitle.includes("Comments")) {
                    doc.text("Additional Comments:", margin, yOffset);
                    yOffset += 10;
                    
                    // Large text area for comments
                    doc.rect(margin, yOffset, contentWidth, 200);
                    yOffset += 220;
                }
                // Signatures section
                else if (sectionTitle.includes("Signatures")) {
                    doc.text("By signing below, staff acknowledges they have participated in this supervision session and reviewed the contents of this form.", margin, yOffset, { maxWidth: contentWidth });
                    yOffset += 30;
                    
                    // Staff signature
                    doc.text("Staff Signature:", margin, yOffset);
                    yOffset += 10;
                    doc.rect(margin, yOffset, 250, 80);
                    doc.text("Date:", margin + 270, yOffset + 40);
                    doc.line(margin + 310, yOffset + 40, margin + 450, yOffset + 40);
                    
                    yOffset += 100;
                    
                    // Supervisor signature
                    doc.text("Supervisor Signature:", margin, yOffset);
                    yOffset += 10;
                    doc.rect(margin, yOffset, 250, 80);
                    doc.text("Date:", margin + 270, yOffset + 40);
                    doc.line(margin + 310, yOffset + 40, margin + 450, yOffset + 40);
                    
                    yOffset += 100;
                }
                // Generic section with just a text area
                else {
                    doc.text("Enter notes below:", margin, yOffset);
                    yOffset += 10;
                    doc.rect(margin, yOffset, contentWidth, 150);
                    yOffset += 170;
                }
            }
            // Regular (non-blank) PDF - capture sections as images
            else {
                // Capture section content as image
                try {
                    const canvas = await html2canvas(section, {
                        scale: 2,  // Higher resolution
                        useCORS: true,
                        logging: false,
                        windowWidth: 1200, // Fixed width for consistency
                        onclone: (clonedDoc) => {
                            // Make any styling adjustments to the cloned document
                            const clonedSection = clonedDoc.getElementById(section.id);
                            if (clonedSection) {
                                clonedSection.style.display = 'block';
                                clonedSection.style.background = 'white';
                                
                                // Handle radiobuttons visibility for non-blank forms
                                if (!isBlank) {
                                    const radios = clonedSection.querySelectorAll('input[type="radio"]');
                                    radios.forEach(radio => {
                                        if (radio.checked) {
                                            radio.style.accentColor = '#7030a0';
                                            radio.style.outline = '2px solid #7030a0';
                                        }
                                    });
                                }
                            }
                        }
                    });
                    
                    const imgData = canvas.toDataURL('image/png');
                    const imgWidth = contentWidth;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    
                    // Check if we need a new page
                    if (yOffset + imgHeight > pageHeight - margin) {
                        doc.addPage();
                        yOffset = margin;
                    }
                    
                    // Add the image
                    doc.addImage(imgData, 'PNG', margin, yOffset, imgWidth, imgHeight);
                    yOffset += imgHeight + 30;
                } catch (err) {
                    console.error('Error capturing section:', err);
                    // Fallback: just add text saying the section couldn't be captured
                    doc.setFontSize(10);
                    doc.setTextColor(255, 0, 0);
                    doc.text(`[Error capturing section content: ${err.message}]`, margin, yOffset);
                    yOffset += 20;
                }
            }
        }
        
        // Add footer with date/time and page numbers
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            
            if (isBlank) {
                doc.text('BLANK FORM FOR MANUAL COMPLETION', margin, pageHeight - 20);
            } else {
                doc.text(`Generated: ${new Date().toLocaleString()}`, margin, pageHeight - 20);
            }
            
            doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 60, pageHeight - 20, { align: 'right' });
        }
        
        // Save the PDF
        doc.save(filename);
        
    } finally {
        // Reset section visibility to original state
        sectionsForPdf.forEach(({ section, wasActive }) => {
            if (!wasActive) {
                section.classList.remove('active');
                section.setAttribute('aria-hidden', true);
            }
        });
    }
}

/**
 * Prompt user to confirm clearing the form
 */
function confirmClearForm() {
    if (confirm('Are you sure you want to clear the form? All entered data will be lost.')) {
        clearForm();
    }
}

/**
 * Clear all form fields and reset to default state
 */
function clearForm() {
    try {
        // Reset all form inputs
        form.reset();
        
        // Clear radio buttons
        const radioButtons = form.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.checked = false;
        });
        
        // Clear text areas
        const textareas = form.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            textarea.value = '';
        });
        
        // Clear signatures
        if (staffSignatureCtx) {
            clearSignature(staffSignatureCtx, staffSignatureCanvas.width, staffSignatureCanvas.height);
        }
        
        if (supervisorSignatureCtx) {
            clearSignature(supervisorSignatureCtx, supervisorSignatureCanvas.width, supervisorSignatureCanvas.height);
        }
        
        // Set default date values
        const today = new Date().toISOString().split('T')[0];
        const dateInputs = form.querySelectorAll('input[type="date"]');
        dateInputs.forEach(dateInput => {
            // Only set supervision date and signature dates to today's date
            if (dateInput.id === 'supervisionDate' || 
                dateInput.id === 'staffSignatureDate' || 
                dateInput.id === 'supervisorSignatureDate') {
                dateInput.value = today;
            } else {
                dateInput.value = '';
            }
        });
        
        // Delete saved form from localStorage
        localStorage.removeItem(`formData_${formId}`);
        
        // Reset form ID for a new form
        formId = 'form_' + Date.now();
        localStorage.setItem('currentFormId', formId);
        
        // Show success notification
        showNotification('Form has been cleared');
        
    } catch (error) {
        console.error('Error clearing form:', error);
        showNotification('Error clearing form', true);
    }
}

/**
 * Show a notification message
 * @param {string} message Message to display
 * @param {boolean} isError Whether this is an error message
 */
function showNotification(message, isError = false) {
    notification.textContent = message;
    notification.className = 'notification';
    
    if (isError) {
        notification.classList.add('error');
    }
    
    notification.classList.add('show');
    
    // Hide after a delay
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func The function to debounce
 * @param {number} wait Wait time in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}
});