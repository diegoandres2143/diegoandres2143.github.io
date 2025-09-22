/**
 * reCAPTCHA Debug Helper
 * Script para depurar problemas con reCAPTCHA
 */

// Función de depuración para reCAPTCHA
function debugRecaptcha() {
    console.log('🔍 === DEPURACIÓN reCAPTCHA ===');
    
    // Verificar si el elemento existe
    const recaptchaElement = document.querySelector('.g-recaptcha');
    console.log('📍 Elemento .g-recaptcha encontrado:', recaptchaElement);
    
    if (recaptchaElement) {
        console.log('📋 Atributos del elemento:', {
            'data-sitekey': recaptchaElement.getAttribute('data-sitekey'),
            'data-rendered': recaptchaElement.getAttribute('data-rendered'),
            'innerHTML': recaptchaElement.innerHTML.length > 0 ? 'Tiene contenido' : 'Vacío'
        });
    }
    
    // Verificar si grecaptcha está disponible
    console.log('🔧 grecaptcha disponible:', typeof grecaptcha !== 'undefined');
    
    if (typeof grecaptcha !== 'undefined') {
        console.log('✅ grecaptcha métodos disponibles:', {
            render: typeof grecaptcha.render,
            getResponse: typeof grecaptcha.getResponse,
            reset: typeof grecaptcha.reset
        });
    }
    
    // Verificar configuración
    console.log('⚙️ Configuración actual:', window.RECAPTCHA_CONFIG);
    
    // Verificar errores de consola
    console.log('📊 Para ver errores de red, revisa la pestaña Network en DevTools');
}

// Ejecutar depuración automáticamente
setTimeout(debugRecaptcha, 2000); // Después de 2 segundos

// También permitir ejecución manual
window.debugRecaptcha = debugRecaptcha;