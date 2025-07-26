# Memory Game

Un juego de memoria interactivo y responsive creado con HTML, JavaScript y TailwindCSS. El objetivo del juego es encontrar todos los pares de cartas coincidentes en el menor tiempo posible y con la menor cantidad de movimientos.

## Características

- Diseño totalmente responsive que se adapta a cualquier dispositivo
- Interfaz de usuario atractiva con animaciones fluidas
- Contador de movimientos y temporizador
- Modal de victoria con estadísticas del juego
- Botones para iniciar y reiniciar el juego

## Tecnologías utilizadas

- HTML5
- CSS3 con animaciones
- JavaScript (ES6+)
- TailwindCSS para estilos responsive

## Cómo jugar

1. Abre el archivo `index.html` en tu navegador web
2. Haz clic en el botón "Iniciar Juego"
3. Voltea las cartas haciendo clic en ellas para encontrar pares coincidentes
4. El juego termina cuando encuentras todos los pares

## Estructura del proyecto

```
├── index.html          # Estructura HTML del juego
├── styles.css          # Estilos CSS adicionales y animaciones
├── script.js           # Lógica del juego en JavaScript
└── README.md           # Documentación del proyecto
```

## Personalización

Puedes personalizar el juego modificando los siguientes aspectos:

- **Cantidad de pares**: Modifica la variable `totalPairs` en el archivo `script.js`
- **Iconos de las cartas**: Cambia los emojis en el array `cardIcons` en `script.js`
- **Colores y estilos**: Modifica las clases de TailwindCSS en `index.html` o los estilos en `styles.css`

## Licencia

Este proyecto está disponible como código abierto bajo los términos de la licencia MIT.

## Changelog

### Versión 1.5
- Agregados 2 nuevos diseños de cartas: Neón y Minimalista
- Agregados 3 conjuntos de iconos para las cartas: Animales, Frutas y Espacio
- Mejorada la pantalla de configuración con opciones de personalización
- Corregido error que impedía mostrar la ventana de victoria
- Optimizaciones de rendimiento y mejoras en la interfaz de usuario

### Versión 1.1
- Implementación inicial del juego
- Diseño responsive con TailwindCSS
- Modos de dificultad: Fácil, Normal y Difícil
- Modos de juego: Normal y Contrarreloj