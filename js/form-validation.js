/**
 * Form Validation System with Animations
 * Enhanced contact form with real-time validation and character counting
 */

class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.fields = {
      name: { element: document.getElementById('nameInput'), maxLength: 50, minLength: 2 },
      email: { element: document.getElementById('emailInput'), maxLength: 100, minLength: 5 },
      subject: { element: document.getElementById('subjectInput'), maxLength: 80, minLength: 3 },
      message: { element: document.getElementById('messageInput'), maxLength: 500, minLength: 10 }
    };
    this.submitBtn = document.getElementById('submitBtn');
    this.btnText = this.submitBtn.querySelector('.btn-text');
    this.btnLoader = this.submitBtn.querySelector('.btn-loader');
    this.formStatus = document.getElementById('formStatus');
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.setupCharacterCounters();
    this.setupFloatingLabels();
    this.setupFormSubmission();
  }
  
  setupEventListeners() {
    // Character counting and real-time validation
    Object.entries(this.fields).forEach(([fieldName, fieldData]) => {
      const element = fieldData.element;
      if (element) {
        element.addEventListener('input', () => {
          this.updateCharacterCount(fieldName);
          this.validateField(fieldName);
        });
        
        element.addEventListener('blur', () => {
          this.validateField(fieldName, true);
        });
        
        element.addEventListener('focus', () => {
          this.clearFieldError(fieldName);
        });
      }
    });
  }
  
  setupCharacterCounters() {
    Object.entries(this.fields).forEach(([fieldName, fieldData]) => {
      const element = fieldData.element;
      if (element) {
        const fieldContainer = element.closest('.form-field');
        const counter = fieldContainer.querySelector('.char-counter .current-chars');
        const maxChars = fieldContainer.querySelector('.max-chars');
        
        if (counter && maxChars) {
          maxChars.textContent = fieldData.maxLength;
          this.updateCharacterCount(fieldName);
        }
      }
    });
  }
  
  updateCharacterCount(fieldName) {
    const fieldData = this.fields[fieldName];
    const element = fieldData.element;
    const fieldContainer = element.closest('.form-field');
    const counter = fieldContainer.querySelector('.char-counter .current-chars');
    const counterContainer = fieldContainer.querySelector('.char-counter');
    
    if (counter && counterContainer) {
      const currentLength = element.value.length;
      const maxLength = fieldData.maxLength;
      
      counter.textContent = currentLength;
      
      // Update counter styling based on character count
      counterContainer.classList.remove('warning', 'danger');
      
      const percentage = (currentLength / maxLength) * 100;
      
      if (percentage >= 90) {
        counterContainer.classList.add('danger');
      } else if (percentage >= 75) {
        counterContainer.classList.add('warning');
      }
      
      // Prevent typing beyond max length
      if (currentLength > maxLength) {
        element.value = element.value.substring(0, maxLength);
        counter.textContent = maxLength;
        counterContainer.classList.add('danger');
      }
    }
  }
  
  setupFloatingLabels() {
    // Labels are now always visible above fields
    // This method now just handles focus effects
    Object.entries(this.fields).forEach(([fieldName, fieldData]) => {
      const element = fieldData.element;
      if (element) {
        const fieldContainer = element.closest('.form-field');
        const label = fieldContainer.querySelector('label');
        
        if (label) {
          // Labels are always visible, no state management needed
          // Focus effects are handled by CSS
        }
      }
    });
  }
  
  validateField(fieldName, showError = false) {
    const fieldData = this.fields[fieldName];
    const element = fieldData.element;
    const fieldContainer = element.closest('.form-field');
    const errorElement = fieldContainer.querySelector('.field-error');
    
    let isValid = true;
    let errorMessage = '';
    
    const value = element.value.trim();
    
    // Check required
    if (!value) {
      if (showError) {
        errorMessage = this.getErrorMessage(fieldName, 'required');
        isValid = false;
      }
    }
    // Check minimum length
    else if (value.length < fieldData.minLength) {
      if (showError) {
        errorMessage = this.getErrorMessage(fieldName, 'minLength', fieldData.minLength);
        isValid = false;
      }
    }
    // Check maximum length
    else if (value.length > fieldData.maxLength) {
      errorMessage = this.getErrorMessage(fieldName, 'maxLength', fieldData.maxLength);
      isValid = false;
    }
    // Email specific validation
    else if (fieldName === 'email' && !this.isValidEmail(value)) {
      if (showError) {
        errorMessage = this.getErrorMessage(fieldName, 'invalid');
        isValid = false;
      }
    }
    
    this.setFieldState(element, fieldContainer, errorElement, isValid, errorMessage);
    return isValid;
  }
  
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  getErrorMessage(fieldName, errorType, value = null) {
    const messages = {
      name: {
        required: '<i class="fas fa-exclamation-circle"></i> El nombre es obligatorio',
        minLength: '<i class="fas fa-exclamation-circle"></i> El nombre debe tener al menos 2 caracteres',
        maxLength: '<i class="fas fa-exclamation-circle"></i> El nombre no puede exceder 50 caracteres'
      },
      email: {
        required: '<i class="fas fa-exclamation-circle"></i> El email es obligatorio',
        invalid: '<i class="fas fa-exclamation-circle"></i> Formato de email inválido',
        minLength: '<i class="fas fa-exclamation-circle"></i> El email debe tener al menos 5 caracteres',
        maxLength: '<i class="fas fa-exclamation-circle"></i> El email no puede exceder 100 caracteres'
      },
      subject: {
        required: '<i class="fas fa-exclamation-circle"></i> El asunto es obligatorio',
        minLength: '<i class="fas fa-exclamation-circle"></i> El asunto debe tener al menos 3 caracteres',
        maxLength: '<i class="fas fa-exclamation-circle"></i> El asunto no puede exceder 80 caracteres'
      },
      message: {
        required: '<i class="fas fa-exclamation-circle"></i> El mensaje es obligatorio',
        minLength: '<i class="fas fa-exclamation-circle"></i> El mensaje debe tener al menos 10 caracteres',
        maxLength: '<i class="fas fa-exclamation-circle"></i> El mensaje no puede exceder 500 caracteres'
      }
    };
    
    return messages[fieldName][errorType];
  }
  
  setFieldState(element, fieldContainer, errorElement, isValid, errorMessage) {
    // Remove previous states
    element.classList.remove('error', 'success');
    fieldContainer.classList.remove('error', 'success');
    errorElement.classList.remove('show');
    
    if (isValid && element.value.trim()) {
      element.classList.add('success');
      fieldContainer.classList.add('success');
    } else if (!isValid) {
      element.classList.add('error');
      fieldContainer.classList.add('error');
      if (errorMessage) {
        errorElement.innerHTML = errorMessage;
        errorElement.classList.add('show');
      }
    }
  }
  
  clearFieldError(fieldName) {
    const fieldData = this.fields[fieldName];
    const element = fieldData.element;
    const fieldContainer = element.closest('.form-field');
    const errorElement = fieldContainer.querySelector('.field-error');
    
    errorElement.classList.remove('show');
    setTimeout(() => {
      if (!errorElement.classList.contains('show')) {
        errorElement.innerHTML = '';
      }
    }, 300);
  }
  
  validateRecaptcha() {
    const recaptchaResponse = grecaptcha.getResponse();
    const recaptchaError = document.getElementById('recaptchaError');
    
    if (!recaptchaResponse) {
      recaptchaError.innerHTML = '<i class="fas fa-robot"></i> Por favor, completa la verificación reCAPTCHA';
      recaptchaError.classList.add('show');
      return false;
    }
    
    recaptchaError.classList.remove('show');
    setTimeout(() => {
      recaptchaError.innerHTML = '';
    }, 300);
    return true;
  }
  
  validateAllFields() {
    let allValid = true;
    
    Object.keys(this.fields).forEach(fieldName => {
      if (!this.validateField(fieldName, true)) {
        allValid = false;
      }
    });
    
    return allValid && this.validateRecaptcha();
  }
  
  showFormStatus(type, message) {
    this.formStatus.className = `form-status ${type}`;
    this.formStatus.innerHTML = message;
    this.formStatus.classList.add('show');
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        this.hideFormStatus();
      }, 5000);
    }
  }
  
  hideFormStatus() {
    this.formStatus.classList.remove('show');
    setTimeout(() => {
      this.formStatus.innerHTML = '';
    }, 400);
  }
  
  setSubmitButtonState(loading = false) {
    if (loading) {
      this.submitBtn.disabled = true;
      this.btnText.style.display = 'none';
      this.btnLoader.style.display = 'inline-block';
    } else {
      this.submitBtn.disabled = false;
      this.btnText.style.display = 'inline-block';
      this.btnLoader.style.display = 'none';
    }
  }
  
  setupFormSubmission() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Hide any previous status messages
      this.hideFormStatus();
      
      // Validate all fields
      if (!this.validateAllFields()) {
        this.showFormStatus('error', '<i class="fas fa-exclamation-triangle"></i> Por favor, corrige los errores antes de enviar el formulario');
        return;
      }
      
      // Set loading state
      this.setSubmitButtonState(true);
      this.showFormStatus('info', '<i class="fas fa-paper-plane"></i> Enviando mensaje...');
      
      try {
        // Simulate form submission (replace with actual EmailJS call)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Success
        this.showFormStatus('success', '<i class="fas fa-check-circle"></i> ¡Mensaje enviado exitosamente! Te contactaré pronto.');
        this.form.reset();
        grecaptcha.reset();
        
        // Reset character counters
        Object.keys(this.fields).forEach(fieldName => {
          this.updateCharacterCount(fieldName);
          this.clearFieldError(fieldName);
          // Labels remain always visible - no reset needed
        });
        
        // Clear success states
        setTimeout(() => {
          Object.values(this.fields).forEach(fieldData => {
            fieldData.element.classList.remove('success', 'error');
            fieldData.element.closest('.form-field').classList.remove('success', 'error');
          });
        }, 3000);
        
      } catch (error) {
        this.showFormStatus('error', '<i class="fas fa-exclamation-circle"></i> Error al enviar el mensaje. Por favor, intenta nuevamente.');
        console.error('Form submission error:', error);
      } finally {
        this.setSubmitButtonState(false);
      }
    });
  }
}

// Initialize form validation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const formValidator = new FormValidator('contactForm');
  
  // Reset reCAPTCHA error when user interacts with it
  window.recaptchaCallback = function() {
    const recaptchaError = document.getElementById('recaptchaError');
    recaptchaError.classList.remove('show');
    setTimeout(() => {
      recaptchaError.innerHTML = '';
    }, 300);
  };
  
  // Language-specific error messages
  const originalSetLanguage = window.setLanguage;
  window.setLanguage = function(lang) {
    if (originalSetLanguage) {
      originalSetLanguage(lang);
    }
    
    // Update form validation messages based on language
    if (formValidator) {
      formValidator.currentLanguage = lang;
    }
  };
});