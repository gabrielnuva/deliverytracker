# Restaurant Delivery Tracker

Una aplicación web para el seguimiento y registro de tiempos de entrega para los restaurantes Rico's y Pizzamía.

## Descripción

Restaurant Delivery Tracker es una aplicación web diseñada para medir y registrar el tiempo que tardan los deliveristas en completar sus entregas. La aplicación se basa en el registro visual, eliminando el uso de geolocalización. En el inicio de cada entrega, el deliverista captura una imagen del ticket de delivery, lo que activa automáticamente un cronómetro. Al finalizar la entrega, el deliverista selecciona la entrega correspondiente y captura una foto de la fachada del lugar, marcando el fin de la entrega y registrando el tiempo transcurrido.

## Características

### Perfil de Deliverista
- Inicio de sesión con credenciales específicas
- Iniciar nuevas entregas capturando foto del ticket
- Ver lista de entregas pendientes con tiempo transcurrido
- Finalizar entregas capturando foto de la fachada del lugar de entrega
- Visualización del tiempo total de cada entrega

### Perfil de Supervisor
- Inicio de sesión con credenciales de supervisor
- Dashboard con estadísticas de entregas (total, tiempo promedio, más rápida, más lenta)
- Filtrado de entregas por fecha, deliverista y restaurante
- Visualización detallada de cada entrega con imágenes y tiempos
- Auditoría de entregas completadas

## Flujo del Proceso

1. **Inicio de Entrega**:
   - El deliverista captura la foto del ticket de delivery
   - Se registran los metadatos (fecha y hora) y se activa el cronómetro

2. **Finalización de Entrega**:
   - El deliverista accede a su lista de entregas pendientes y selecciona la que desea finalizar
   - Captura una imagen de la fachada del lugar de entrega
   - La aplicación registra el tiempo total de la entrega

3. **Auditoría y Validación**:
   - Los supervisores acceden a un dashboard donde pueden revisar en detalle cada entrega
   - Se pueden aplicar filtros para analizar las entregas según diferentes criterios

## Credenciales de Prueba

### Deliveristas
- Usuario: deliverista1 / Contraseña: password123
- Usuario: deliverista2 / Contraseña: password123

### Supervisor
- Usuario: supervisor1 / Contraseña: password123

## Tecnologías Utilizadas

- HTML5
- CSS3 (con variables CSS para una fácil personalización)
- JavaScript (Vanilla JS)
- API de MediaDevices para acceso a la cámara
- LocalStorage para persistencia de datos (en esta versión de demostración)

## Instalación y Uso

1. Clona este repositorio o descarga los archivos
2. Abre el archivo `index.html` en tu navegador web
3. Inicia sesión con alguna de las credenciales de prueba
4. Explora las funcionalidades según el perfil seleccionado

## Consideraciones

- Esta es una versión de demostración que utiliza almacenamiento local en el navegador
- Para un entorno de producción, se recomienda implementar un backend con base de datos
- La aplicación requiere permisos de cámara para funcionar correctamente
- Se recomienda utilizar un navegador moderno (Chrome, Firefox, Edge) para una mejor experiencia

## Próximas Mejoras

- Implementación de backend con Node.js y MongoDB
- Autenticación segura con JWT
- Análisis de imágenes para verificar autenticidad
- Exportación de reportes en formato CSV/PDF
- Notificaciones en tiempo real
- Aplicación móvil nativa para mejorar la experiencia en dispositivos móviles

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles. 