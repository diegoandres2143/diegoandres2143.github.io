/**
 * reCAPTCHA v2 Configuration
 * Configuración centralizada para Google reCAPTCHA v2
 */

// Configuración de reCAPTCHA v2
window.RECAPTCHA_CONFIG = {
    siteKey: '6LcREa8rAAAAAAbobuz8FGo9BVKJznZjycCgOfNX',
    theme: 'light', // 'light' o 'dark'
    size: 'normal'  // 'normal' o 'compact'
};

// Variable para almacenar el widget ID
let recaptchaWidgetId = null;

// Función para inicializar reCAPTCHA explícitamente
function initRecaptcha() {
    console.log('🔧 Inicializando reCAPTCHA...');
    
    if (typeof grecaptcha !== 'undefined') {
        const recaptchaElement = document.querySelector('.g-recaptcha');
        
        if (recaptchaElement && !recaptchaElement.hasAttribute('data-rendered')) {
            try {
                // Renderizar reCAPTCHA explícitamente
                recaptchaWidgetId = grecaptcha.render(recaptchaElement, {
                    'sitekey': window.RECAPTCHA_CONFIG.siteKey,
                    'theme': window.RECAPTCHA_CONFIG.theme,
                    'size': window.RECAPTCHA_CONFIG.size,
                    'callback': function(response) {
                        console.log('✅ reCAPTCHA completado:', response.substring(0, 20) + '...');
                    },
                    'expired-callback': function() {
                        console.log('⚠️ reCAPTCHA expirado');
                    },
                    'error-callback': function() {
                        console.log('❌ Error en reCAPTCHA');
                    }
                });
                
                recaptchaElement.setAttribute('data-rendered', 'true');
                console.log('✅ reCAPTCHA renderizado correctamente con ID:', recaptchaWidgetId);
                
            } catch (error) {
                console.error('❌ Error al renderizar reCAPTCHA:', error);
            }
        }
    } else {
        console.warn('⚠️ grecaptcha no está disponible aún');
        // Reintentar inmediatamente
        setTimeout(initRecaptcha, 100);
    }
}

// Función para obtener el token de reCAPTCHA
function getRecaptchaToken() {
    if (typeof grecaptcha !== 'undefined') {
        if (recaptchaWidgetId !== null) {
            return grecaptcha.getResponse(recaptchaWidgetId);
        } else {
            return grecaptcha.getResponse();
        }
    }
    return null;
}

// Función para resetear reCAPTCHA
function resetRecaptcha() {
    if (typeof grecaptcha !== 'undefined') {
        if (recaptchaWidgetId !== null) {
            grecaptcha.reset(recaptchaWidgetId);
        } else {
            grecaptcha.reset();
        }
    }
}

// Función para verificar si reCAPTCHA está completado
function isRecaptchaCompleted() {
    const token = getRecaptchaToken();
    return token && token.length > 0;
}

// Función de compatibilidad para main.js
function validateRecaptcha() {
    return isRecaptchaCompleted();
}

// Callback global para cuando reCAPTCHA se carga
window.onRecaptchaLoad = function() {
    console.log('🚀 reCAPTCHA API cargada, inicializando...');
    initRecaptcha();
};

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM cargado, verificando reCAPTCHA...');
    
    // Intentar inicializar inmediatamente
    if (typeof grecaptcha !== 'undefined') {
        initRecaptcha();
    } else {
        // Si no está disponible, esperar a que se cargue
        console.log('⏳ Esperando a que se cargue reCAPTCHA...');
        
        // Reintentar cada 100ms hasta que esté disponible
        const checkRecaptcha = setInterval(() => {
            if (typeof grecaptcha !== 'undefined') {
                clearInterval(checkRecaptcha);
                initRecaptcha();
            }
        }, 100);
        
        // Timeout después de 10 segundos
        setTimeout(() => {
            clearInterval(checkRecaptcha);
            if (typeof grecaptcha === 'undefined') {
                console.error('❌ reCAPTCHA no se pudo cargar después de 10 segundos');
            }
        }, 10000);
    }
});