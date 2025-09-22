/**
 * EmailJS Simple Configuration
 * Lightweight email service for Diego's Portfolio
 */

// Inicializa EmailJS con tu Public Key
(function(){
    emailjs.init('62nNQ8b8sSnPvlDDb');
})();

// Configuración de EmailJS
window.EMAIL_CONFIG = {
    serviceID: 'service_4wd2m6d',
    templateNotification: 'template_i1hm3i3',    // Template que recibes TÚ
    templateAutoResponse: 'template_6t965vt'     // Template que recibe el USUARIO
};

// Función para enviar ambos emails (notificación + respuesta automática)
function enviarCorreo(templateParams) {
    const timestamp = new Date().toLocaleString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const paramsConTimestamp = {
        ...templateParams,
        timestamp: timestamp
    };
    
    // Enviar notificación a ti (Diego)
    const notificationPromise = emailjs.send(
        window.EMAIL_CONFIG.serviceID,
        window.EMAIL_CONFIG.templateNotification,
        paramsConTimestamp
    );
    
    // Enviar respuesta automática al usuario
    const autoResponsePromise = emailjs.send(
        window.EMAIL_CONFIG.serviceID,
        window.EMAIL_CONFIG.templateAutoResponse,
        paramsConTimestamp
    );
    
    return Promise.all([notificationPromise, autoResponsePromise])
        .then(function(responses) {
            console.log('Ambos correos enviados con éxito!', responses);
            showNotification('¡Mensaje enviado correctamente!', 'success');
        })
        .catch(function(error) {
            console.error('Error al enviar los correos:', error);
            showNotification('Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
        });
}

// Configurar EmailJS con tus parámetros
function configurarEmailJS(publicKey, serviceID, templateID) {
    emailjs.init(publicKey);
    window.EMAIL_CONFIG = {
        serviceID: serviceID,
        templateID: templateID
    };
    console.log('EmailJS configurado correctamente');
}