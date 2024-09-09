# Aplicación de Control de Viajes Uber

## Descripción

Esta aplicación web está diseñada para ayudar a los conductores de Uber a registrar y analizar sus viajes diarios. Permite a los usuarios ingresar información sobre cada viaje, incluyendo la fecha, kilómetros recorridos, horas trabajadas e ingresos diarios. Además, proporciona informes semanales y mensuales que resumen la actividad del conductor, así como visualizaciones gráficas de los datos.

## Tecnologías Utilizadas

- React: Biblioteca de JavaScript para construir interfaces de usuario.
- Vite: Herramienta de compilación que proporciona una experiencia de desarrollo más rápida.
- CSS: Para el diseño y estilo de la aplicación.
- JavaScript (ES6+): Para la lógica de la aplicación.
- Firebase: Para la autenticación de usuarios y el almacenamiento de datos en tiempo real.
- React Icons: Para la inclusión de iconos en la interfaz.
- React Firebase Hooks: Para facilitar la integración con Firebase.
- Chart.js y React-Chartjs-2: Para la creación de gráficos interactivos.

## Características Principales

1. Formulario de registro de viajes diarios con cálculo automático de ingresos.
2. Informe semanal con cálculos de ingresos totales, kilómetros recorridos, horas trabajadas e ingreso por hora.
3. Informe mensual con resumen de actividad y comparativas.
4. Interfaz de usuario intuitiva y responsive con diseño moderno.
5. Sistema de autenticación de usuarios mediante Firebase.
6. Almacenamiento en tiempo real de datos en Firebase Firestore.
7. Visualización de datos mediante gráficos interactivos.
8. Lista de viajes con opción de editar y eliminar registros.

## Mejoras a Desarrollar

1. Implementar una función de exportación de datos a formatos como CSV o PDF.
2. Desarrollar un sistema de notificaciones para recordar al usuario registrar sus viajes diarios.
3. Crear una versión móvil de la aplicación para facilitar el registro en tiempo real.
4. Implementar un sistema de cálculo automático de gastos (combustible, mantenimiento, etc.) para obtener ganancias netas.
5. Añadir soporte para múltiples idiomas.
6. Implementar una función de copia de seguridad y restauración de datos.
7. Añadir más tipos de gráficos y opciones de personalización para la visualización de datos.
8. Implementar un sistema de metas y logros para motivar a los conductores.
9. Añadir una función de comparación de rendimiento entre diferentes períodos de tiempo.
10. Integrar con la API de Uber para obtener datos de viajes automáticamente.

## Cómo Ejecutar la Aplicación

1. Clonar el repositorio
2. Instalar las dependencias con `npm install`
3. Configurar las variables de entorno para Firebase en un archivo `.env`
4. Ejecutar la aplicación en modo desarrollo con `npm run dev`
5. Abrir `http://localhost:5173` en el navegador