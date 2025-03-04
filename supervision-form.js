/**
 * Wayne Center - Clinical Supervision Form
 * 
 * This script handles form functionality including:
 * - User identification and data isolation
 * - Multi-draft management
 * - Section toggling
 * - Form validation
 * - Data persistence (localStorage)
 * - PDF generation
 * - Review type switching
 * - Signature capture
 */

// Global variables
let formId = '';
let currentUser = '';
let usersList = [];
let form;
let reviewType;
let caseReviewButton;
let saveAsPdfButton;
let saveDraftButton;
let saveAsNewButton;
let newDraftButton;
let clearFormButton;
let blankPdfButton;
let loadingOverlay;
let notification;
let staffSignatureCanvas;
let supervisorSignatureCanvas;
let staffSignatureCtx;
let supervisorSignatureCtx;
let isDrawing = false;
let activeCanvas = null;
let activeCtx = null;
let toggleButtons;
let sectionContents;
let requiredFields;

document.addEventListener('DOMContentLoaded', function() {
    // Store references to DOM elements
    form = document.getElementById('supervisionForm');
    reviewType = document.getElementById('reviewType');
    caseReviewButton = document.getElementById('caseReviewButton');
    saveAsPdfButton = document.getElementById('saveAsPdf');
    saveDraftButton = document.getElementById('saveDraft');
    saveAsNewButton = document.getElementById('saveAsNewButton');
    newDraftButton = document.getElementById('newDraftButton');
    clearFormButton = document.getElementById('clearForm');
    blankPdfButton = document.getElementById('blankPdfButton');
    loadingOverlay = document.getElementById('loadingOverlay');
    notification = document.getElementById('notification');
    
    // Signature Elements
    staffSignatureCanvas = document.getElementById('staffSignature');
    supervisorSignatureCanvas = document.getElementById('supervisorSignature');
    
    if (staffSignatureCanvas) {
        staffSignatureCtx = staffSignatureCanvas.getContext('2d');
    }
    
    if (supervisorSignatureCanvas) {
        supervisorSignatureCtx = supervisorSignatureCanvas.getContext('2d');
    }
    
    // Get all toggle buttons and section contents
    toggleButtons = document.querySelectorAll('.toggle-button');
    sectionContents = document.querySelectorAll('.section-content');
    
    // Form fields that are required
    requiredFields = document.querySelectorAll('input[required], select[required]');
    
    // Initialize user system instead of form directly
    initializeUserSystem();
});

/**
 * Initialize the user management system
 */
function initializeUserSystem() {
    // Load existing users list
    usersList = JSON.parse(localStorage.getItem('supervisionform_users') || '[]');
    
    // Check if a user is already selected
    currentUser = localStorage.getItem('supervisionform_currentuser') || '';
    
    // If no current user, show the user selection dialog
    if (!currentUser) {
        showUserSelectionDialog();
    } else {
        // Update the user display
        updateUserDisplay();
        
        // Initialize the form for this user
        initializeForm();
    }
}

/**
 * Show the user selection dialog
 */
function showUserSelectionDialog() {
    // Create the dialog if it doesn't exist
    if (!document.getElementById('userSelectionDialog')) {
        const dialog = document.createElement('div');
        dialog.id = 'userSelectionDialog';
        dialog.className = 'user-dialog';
        
        dialog.innerHTML = `
          <div class="user-dialog-content">
            <h2>User Identification</h2>
            <p>Please identify yourself to access your private drafts.</p>
            
            <div class="user-selection">
              <div class="form-group">
                <label for="usernameInput">Your Name:</label>
                <input type="text" id="usernameInput" placeholder="Enter your name">
              </div>
              
              <div class="user-list-container" style="display: none;">
                <p>Or select your name from the list:</p>
                <div class="user-list"></div>
              </div>
            </div>
            
            <div class="user-dialog-actions">
              <button id="continueAsUserBtn" class="button primary-button">Continue</button>
            </div>
          </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Add event listeners
        document.getElementById('continueAsUserBtn').addEventListener('click', selectUser);
        document.getElementById('usernameInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                selectUser();
            }
        });
        
        // If we have existing users, show the list
        if (usersList.length > 0) {
            const userListContainer = dialog.querySelector('.user-list-container');
            userListContainer.style.display = 'block';
            
            const userList = dialog.querySelector('.user-list');
            userList.innerHTML = '';
            
            usersList.forEach(user => {
                const userButton = document.createElement('button');
                userButton.className = 'user-option';
                userButton.textContent = user;
                userButton.addEventListener('click', function() {
                    document.getElementById('usernameInput').value = user;
                });
                
                userList.appendChild(userButton);
            });
        }
    } else {
        // Just show the existing dialog
        document.getElementById('userSelectionDialog').style.display = 'flex';
    }
}

/**
 * Select a user from the dialog
 */
function selectUser() {
    const usernameInput = document.getElementById('usernameInput');
    const username = usernameInput.value.trim();
    
    if (!username) {
        alert('Please enter your name to continue.');
        return;
    }
    
    // Save the username
    currentUser = username;
    localStorage.setItem('supervisionform_currentuser', currentUser);
    
    // Add to users list if not already there
    if (!usersList.includes(username)) {
        usersList.push(username);
        localStorage.setItem('supervisionform_users', JSON.stringify(usersList));
    }
    
    // Hide dialog
    document.getElementById('userSelectionDialog').style.display = 'none';
    
    // Update display
    updateUserDisplay();
    
    // Initialize the form
    initializeForm();
}

/**
 * Update the user display in the header
 */
function updateUserDisplay() {
    // Create user display if it doesn't exist
    if (!document.getElementById('userDisplay')) {
        const userDisplay = document.createElement('div');
        userDisplay.id = 'userDisplay';
        userDisplay.className = 'user-display';
        
        userDisplay.innerHTML = `
          <span id="currentUserName"></span>
          <button id="switchUserBtn" class="button small-button">Switch User</button>
        `;
        
        // Find where to insert it (after the form header)
        const formHeader = document.querySelector('.form-header');
        if (formHeader && formHeader.nextSibling) {
            formHeader.parentNode.insertBefore(userDisplay, formHeader.nextSibling);
        } else {
            document.querySelector('.form-container').prepend(userDisplay);
        }
        
        // Add event listener
        document.getElementById('switchUserBtn').addEventListener('click', showUserSelectionDialog);
    }
    
    // Update the displayed name
    document.getElementById('currentUserName').textContent = `Current user: ${currentUser}`;
}

/**
 * Get a user-specific storage key
 * @param {string} key - The base key name
 * @returns {string} The user-specific key
 */
function getUserKey(key) {
    return `${currentUser}_${key}`;
}

/**
 * Set an item in localStorage with user isolation
 * @param {string} key - The key to store
 * @param {string} value - The value to store
 */
function setUserItem(key, value) {
    localStorage.setItem(getUserKey(key), value);
}

/**
 * Get an item from localStorage with user isolation
 * @param {string} key - The key to retrieve
 * @returns {string|null} The stored value or null
 */
function getUserItem(key) {
    return localStorage.getItem(getUserKey(key));
}

/**
 * Remove an item from localStorage with user isolation
 * @param {string} key - The key to remove
 */
function removeUserItem(key) {
    localStorage.removeItem(getUserKey(key));
}

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
    
    // Initialize case review section
    initializeCaseReview();
    
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
    
    if (saveAsNewButton) {
        saveAsNewButton.addEventListener('click', saveAsNewDraft);
    }
    
    if (newDraftButton) {
        newDraftButton.addEventListener('click', createNewDraft);
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
    
    // Initialize the drafts list
    updateDraftsList();
    
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
 * Initialize the Case Review section
 */
function initializeCaseReview() {
    // Get the review type select element
    const reviewTypeSelect = document.getElementById('reviewType');
    if (!reviewTypeSelect) return;
    
    // Check if we're in client-specific review mode
    if (reviewTypeSelect.value === 'client') {
        const caseReviewSection = document.getElementById('case-review-section');
        const caseReviewButton = document.getElementById('caseReviewButton');
        
        if (caseReviewSection && caseReviewButton) {
            // Make the case review button visible
            caseReviewButton.style.display = 'block';
            
            // Add active class to show the section
            caseReviewSection.classList.add('active');
            caseReviewSection.setAttribute('aria-hidden', 'false');
            caseReviewButton.classList.add('active');
            caseReviewButton.setAttribute('aria-expanded', 'true');
            
            // Make sure all review items are visible
            const reviewItems = caseReviewSection.querySelectorAll('.review-item');
            reviewItems.forEach(item => {
                item.style.display = 'grid';
            });
            
            // Make sure review categories are visible
            const reviewCategories = caseReviewSection.querySelectorAll('.review-category');
            reviewCategories.forEach(category => {
                category.style.display = 'block';
            });
        }
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
    
    // Show/hide the case review button based on review type
    if (caseReviewButton) {
        if (isClientReview) {
            caseReviewButton.style.display = 'block';
        } else {
            caseReviewButton.style.display = 'none';
        }
    }
    
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
                    
                    const section = document.getElementById(sectionId);
                    if (section) {
                        section.classList.add('active');
                        section.setAttribute('aria-hidden', false);
                        
                        // Make sure all review items are visible
                        const reviewItems = section.querySelectorAll('.review-item');
                        reviewItems.forEach(item => {
                            item.style.display = 'grid';
                        });
                        
                        // Make sure review categories are visible
                        const reviewCategories = section.querySelectorAll('.review-category');
                        reviewCategories.forEach(category => {
                            category.style.display = 'block';
                        });
                    }
                }
            } else {
                button.style.display = 'none';
                // Hide and deactivate other sections
                const section = document.getElementById(sectionId);
                if (section) {
                    section.classList.remove('active');
                    section.setAttribute('aria-hidden', true);
                    button.classList.remove('active');
                    button.setAttribute('aria-expanded', false);
                }
            }
        } else {
            // For general review, show all buttons except Case Review
            if (sectionId === 'case-review-section') {
                button.style.display = 'none';
                const section = document.getElementById(sectionId);
                if (section) {
                    section.classList.remove('active');
                    section.setAttribute('aria-hidden', true);
                    button.classList.remove('active');
                    button.setAttribute('aria-expanded', false);
                }
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
 * Get the user-specific form list
 * @returns {Array} The list of forms for the current user
 */
function getUserFormList() {
    return JSON.parse(getUserItem('formList') || '[]');
}

/**
 * Save the user-specific form list
 * @param {Array} formList - The list of forms to save
 */
function saveUserFormList(formList) {
    setUserItem('formList', JSON.stringify(formList));
}

/**
 * Updates the form list with a new entry
 * @param {Object} formData - The form data to save
 * @param {string} specificFormId - Optional specific form ID to use
 */
function updateFormList(formData, specificFormId = null) {
    let formList = getUserFormList();
    
    const idToUse = specificFormId || formId;
    
    // Check if this form is already in the list
    const existingIndex = formList.findIndex(item => item.id === idToUse);
    
    const formMeta = {
        id: idToUse,
        supervisorName: formData.supervisorName || 'Unknown Supervisor',
        staffName: formData.staffName || 'Unknown Staff',
        date: formData.supervisionDate || 'Unknown Date',
        reviewType: formData.reviewType || 'general',
        lastSaved: new Date().toISOString(),
        created: existingIndex >= 0 ? formList[existingIndex].created : new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
        formList[existingIndex] = formMeta;
    } else {
        formList.push(formMeta);
    }
    
    saveUserFormList(formList);
}

/**
 * Save the current form state to localStorage
 * @param {boolean} silent - If true, don't show a notification
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
    
    // Save to localStorage with user-specific key
    setUserItem(`formData_${formId}`, JSON.stringify(formData));
    
    // Also save to formList for later retrieval
    updateFormList(formData);
    
    // Update the drafts list UI
    updateDraftsList();
    
    if (!silent) {
        showNotification('Form draft saved successfully');
    }
}

/**
 * Load saved form state from localStorage
 */
function loadFormState() {
    // Get the form ID from user-specific storage
    const savedFormId = getUserItem('currentFormId');
    if (savedFormId) {
        formId = savedFormId;
    } else {
        // Generate a new form ID if none exists
        formId = 'form_' + Date.now();
        setUserItem('currentFormId', formId);
    }
    
    // Load the form data
    const savedData = getUserItem(`formData_${formId}`);
    
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
    } else {
        // No form data, might be first time - show notification
        showNotification('New form created');
    }
}

/**
 * Loads a specific draft by ID
 * @param {string} draftId - The ID of the draft to load
 */
function loadDraft(draftId) {
    // Check for unsaved changes
    if (hasUnsavedChanges() && !confirm('You have unsaved changes. Load another draft anyway?')) {
        return;
    }
    
    // Load the draft data
    const savedData = getUserItem(`formData_${draftId}`);
    if (!savedData) {
        showNotification('Error: Draft not found', true);
        return;
    }
    
    // Clear current form
    clearFormWithoutReset();
    
    // Set the current form ID
    formId = draftId;
    setUserItem('currentFormId', formId);
    
    // Load the form data
    loadFormStateWithId(draftId);
    
    // Update the drafts list UI
    updateDraftsList();
    
    showNotification('Draft loaded successfully');
}

/**
 * Deletes a draft by ID
 * @param {string} draftId - The ID of the draft to delete
 */
function deleteDraft(draftId) {
    if (!confirm('Are you sure you want to delete this draft? This cannot be undone.')) {
        return;
    }
    
    // Remove from localStorage
    removeUserItem(`formData_${draftId}`);
    
    // Update the form list
    const formList = getUserFormList();
    const updatedList = formList.filter(draft => draft.id !== draftId);
    saveUserFormList(updatedList);
    
    // If we're deleting the current draft, create a new one
    if (draftId === formId) {
        createNewDraft();
    } else {
        // Just update the UI
        updateDraftsList();
    }
    
    showNotification('Draft deleted');
}

/**
 * Updates the drafts list in the UI
 */
function updateDraftsList() {
    const draftsList = document.querySelector('.drafts-list');
    if (!draftsList) return;
    
    // Clear the list
    draftsList.innerHTML = '';
    
    // Get all saved forms for current user
    const formList = getUserFormList();
    
    if (formList.length === 0) {
        draftsList.innerHTML = '<p>No saved drafts for current user</p>';
        return;
    }
    
    // Sort by last saved date (newest first)
    formList.sort((a, b) => new Date(b.lastSaved) - new Date(a.lastSaved));
    
    // Create a list item for each draft
    formList.forEach(draft => {
        const draftItem = document.createElement('div');
        draftItem.className = 'draft-item';
        if (draft.id === formId) {
            draftItem.classList.add('current');
        }
        
        const draftDate = new Date(draft.lastSaved).toLocaleString();
        
        draftItem.innerHTML = `
          <div class="draft-info">
            <div class="draft-name">${draft.supervisorName} - ${draft.staffName}</div>
            <div class="draft-date">Last saved: ${draftDate}</div>
            <div class="draft-type">${draft.reviewType === 'general' ? 'General Review' : 'Client-Specific Review'}</div>
          </div>
          <div class="draft-actions">
            <button class="load-draft" data-id="${draft.id}">Load</button>
            <button class="delete-draft" data-id="${draft.id}">Delete</button>
            <button class="duplicate-draft" data-id="${draft.id}">Duplicate</button>
          </div>
        `;
        
        draftsList.appendChild(draftItem);
    });
    
    // Add event listeners to buttons
    draftsList.querySelectorAll('.load-draft').forEach(button => {
        button.addEventListener('click', function() {
            loadDraft(this.getAttribute('data-id'));
        });
    });
    
    draftsList.querySelectorAll('.delete-draft').forEach(button => {
        button.addEventListener('click', function() {
            deleteDraft(this.getAttribute('data-id'));
        });
    });
    
    draftsList.querySelectorAll('.duplicate-draft').forEach(button => {
        button.addEventListener('click', function() {
            duplicateDraft(this.getAttribute('data-id'));
        });
    });
}

/**
 * Loads form state with a specific ID
 * @param {string} draftId - The ID of the draft to load
 */
function loadFormStateWithId(draftId) {
    const savedData = getUserItem(`formData_${draftId}`);
    
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
        
        // Set review type display
        handleReviewTypeChange();
        
        // Initialize case review section if needed
        initializeCaseReview();
    }
}

/**
 * Creates a new blank draft
 */
function createNewDraft() {
    // Confirm if there are unsaved changes
    if (hasUnsavedChanges() && !confirm('You have unsaved changes. Create a new draft anyway?')) {
        return;
    }
    
    // Clear the form
    clearFormWithoutReset();
    
    // Generate a new form ID
    formId = 'form_' + Date.now();
    setUserItem('currentFormId', formId);
    
    // Set today's date as default for new drafts
    const today = new Date().toISOString().split('T')[0];
    if (document.getElementById('supervisionDate')) {
        document.getElementById('supervisionDate').value = today;
    }
    
    // Update UI to reflect new draft
    updateDraftsList();
    showNotification('New draft created');
}

/**
 * Saves current form state as a new draft with a new ID
 */
function saveAsNewDraft() {
    // Generate a new form ID
    const newFormId = 'form_' + Date.now();
    
    // Save current form data with the new ID
    const formData = saveCurrentFormData();
    setUserItem(`formData_${newFormId}`, JSON.stringify(formData));
    
    // Update the current form ID
    formId = newFormId;
    setUserItem('currentFormId', formId);
    
    // Update the form list
    updateFormList(formData, newFormId);
    updateDraftsList();
    
    showNotification('Saved as new draft');
}

/**
 * Duplicates a draft by ID
 * @param {string} draftId - The ID of the draft to duplicate
 */
function duplicateDraft(draftId) {
    // Get the source draft data
    const savedData = getUserItem(`formData_${draftId}`);
    if (!savedData) {
        showNotification('Error: Draft not found', true);
        return;
    }
    
    // Create a new draft ID
    const newDraftId = 'form_' + Date.now();
    
    // Copy the draft data
    const formData = JSON.parse(savedData);
    
    // Update any fields to indicate this is a copy
    if (formData.supervisorName) {
        formData.supervisorName = formData.supervisorName + ' (Copy)';
    }
    
    // Save with new ID
    setUserItem(`formData_${newDraftId}`, JSON.stringify(formData));
    
    // Update the form list
    updateFormList(formData, newDraftId);
    
    // Load the new draft
    loadDraft(newDraftId);
    
    showNotification('Draft duplicated successfully');
}

/**
 * Checks if there are unsaved changes in the current form
 * @returns {boolean} True if there are unsaved changes
 */
function hasUnsavedChanges() {
    // Get the current form data
    const currentData = saveCurrentFormData();
    
    // Get the saved form data
    const savedData = getUserItem(`formData_${formId}`);
    if (!savedData) return true; // No saved data, so there are unsaved changes
    
    // Compare the current and saved data
    const parsedSavedData = JSON.parse(savedData);
    
    // Simple comparison - just check if the stringified objects are different
    return JSON.stringify(currentData) !== JSON.stringify(parsedSavedData);
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
 * Clears the form without resetting the form ID
 */
function clearFormWithoutReset() {
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
    
    // Set today's date as default for supervision date
    const today = new Date().toISOString().split('T')[0];
    const supervisionDate = document.getElementById('supervisionDate');
    if (supervisionDate) {
        supervisionDate.value = today;
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
    const clearStaffSignatureButton = document.getElementById('clearStaffSignature');
    if (clearStaffSignatureButton) {
        clearStaffSignatureButton.addEventListener('click', () => {
            clearSignature(staffSignatureCtx, staffSignatureCanvas.width, staffSignatureCanvas.height);
            saveFormState(true); // Silent save
        });
    }
    
    const clearSupervisorSignatureButton = document.getElementById('clearSupervisorSignature');
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
        
        // Create printable blank PDF directly
        createPrintableBlankPDF('Wayne_Center_Clinical_Supervision_Form_Blank.pdf')
            .then(success => {
                if (success) {
                    showNotification('Blank PDF template created successfully');
                } else {
                    showNotification('Error creating blank PDF', true);
                }
            })
            .catch(error => {
                console.error('Error creating blank PDF:', error);
                showNotification('Error creating blank PDF: ' + error.message, true);
            })
            .finally(() => {
                // Hide loading overlay
                loadingOverlay.classList.remove('active');
            });
        
    } catch (error) {
        console.error('Error in createBlankPDF:', error);
        showNotification('Error creating blank PDF', true);
        loadingOverlay.classList.remove('active');
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
                
                // Handle different section types here...
                // This is a simplified version; in reality, you'd have more complex logic
                
                // Add a generic notes area for each section
                doc.text("Notes:", margin, yOffset);
                yOffset += 10;
                doc.rect(margin, yOffset, contentWidth, 100);
                yOffset += 120;
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
        return true;
        
    } catch (error) {
        console.error('Error creating PDF:', error);
        throw error;
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
 * Creates a blank PDF template optimized for printing and manual completion
 * @param {string} filename Filename for the PDF
 * @returns {Promise<boolean>} Promise that resolves to true if successful
 */
async function createPrintableBlankPDF(filename) {
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
        
        // Add sections
        const sections = [
            { title: "Assessments", height: 300 },
            { title: "IPOS & Addendums", height: 200 },
            { title: "In-service", height: 150 },
            { title: "Coordination of Care", height: 200 },
            { title: "Service Activities", height: 250 },
            { title: "Case Review", height: 400 },
            { title: "Additional Comments", height: 200 },
            { title: "Signatures", height: 250 }
        ];
        
        for (const section of sections) {
            // Check if we need a new page
            if (yOffset + section.height > pageHeight - margin) {
                doc.addPage();
                yOffset = margin;
            }
            
            // Add section title
            doc.setFontSize(14);
            doc.setTextColor(112, 48, 160);
            doc.text(section.title, margin, yOffset);
            yOffset += 25;
            
            // Add notes area
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text("Notes:", margin, yOffset);
            yOffset += 10;
            
            // Create a box for notes
            doc.rect(margin, yOffset, contentWidth, section.height - 35);
            yOffset += section.height - 35 + 20;
        }
        
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
        throw error;
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
        removeUserItem(`formData_${formId}`);
        
        // Reset form ID for a new form
        formId = 'form_' + Date.now();
        setUserItem('currentFormId', formId);
        
        // Update drafts list
        updateDraftsList();
        
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