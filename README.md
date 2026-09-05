# Simulación de un Mini-Proyecto Ágil con Integración Continua

> **Aviso sobre generación de código con IA:** el código de este repositorio fue generado y/o asistido mediante herramientas de inteligencia artificial (Claude Code). Se declara esto de forma explícita por transparencia y fines académicos.

Práctica de la asignatura de Marcos de Trabajo Ágil, Ciclo 4, UEES.

## Descripción

Aplicación de calculadora básica (suma, resta, multiplicación y división) construida con React y TypeScript, utilizada como caso de práctica para configurar un flujo de integración continua (linting, formateo, pruebas y build automatizados).

## Prácticas ágiles implementadas en este repositorio

### Qué práctica aplicaste.
- Coding Standards: Se configuró Linter (Oxlint) + Formater (Prettier). Se configuraron ambas comprobaciones como pasos del code review, de esta manera se garantiza que el proyecto cumple los estándares antes de proceder a hacer merge de los cambios.
- Tests Automatizados: Se agregó un paso en el flujo de Code Review para ejecutar las suites de test unitarios del proyecto.
- Branching: Se implementó el modelo de branching conocido como GitFlow para mantener ramas separadas por ambiente y que las integraciones de código a la rama principal ocurran por medio de releases controlados.
- Ruleset para protección de las ramas main y develop: Se bloquean los push directos a dichas ramas, todas las integraciones de código deben pasar primero por una PR que garantice la ejecución de las validaciones establecidas en el flujo de Code Review de GitHub Actions. Con respecto a esta práctica, una mejora a implementar sería establecer un mínimo de aprobaciones requeridas para poder hacer merge, pero no se ha configurado de esa forma debido a que solo hay una persona trabajándolo.

### Qué problema evita (ejemplo: errores de estilo, integración tardía, etc.).
Evitan riesgos de seguridad y rendimiento introducidas en código sin inspeccionar, incompatibilidades al momento de integrar cambios entre diferentes desarrolladores, funcionalidades impactadas o borradas por una resolución de conflictos mal ejecutada, etc.

Por otra parte, incrementa la calidad del código definiendo reglas estándar para escribir código de React que siga las mejores prácticas de la industria.

### Cómo se relaciona con lo discutido en clase (ejemplo: evitar el “Big Bang” o reducir retrabajo).
Estas prácticas evitan que lleguemos a una integración "Big Bang" donde los conflictos resueltos de manera incorrecta impactan el código productivo. Ayudan a que el código sea más fácil de mantener. Permiten optimizar el tiempo que el equipo de desarrollo invierte en realizar la integración de sus cambios, de la misma manera el equipo de QA no se ve en la necesidad de realizar pruebas de regresión completas ante la incertidumbre de que una integración rompa el sistema.

## Stack tecnológico

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) 6
- [Vite](https://vitejs.dev/) 8
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react) + jsdom (pruebas)
- [Oxlint](https://oxc.rs/) (linting)
- [Prettier](https://prettier.io/) (formateo)
- [pnpm](https://pnpm.io/) (gestor de paquetes)

## Requisitos previos

- Node.js 22 o superior
- pnpm (versión fijada en `packageManager` dentro de `package.json`)

## Instalación

```bash
pnpm install
```

## Ejecución

Levantar el servidor de desarrollo:

```bash
pnpm dev
```

Generar el build de producción:

```bash
pnpm build
```

Previsualizar el build de producción:

```bash
pnpm preview
```

## Pruebas y calidad de código

```bash
pnpm test           # ejecutar pruebas una vez
pnpm test:watch     # ejecutar pruebas en modo watch
pnpm lint           # analizar el código con Oxlint
pnpm format:check   # verificar formateo con Prettier
pnpm format         # aplicar formateo con Prettier
```

## Integración continua

En cada `push` o `pull request` hacia `main` o `develop`, GitHub Actions ejecuta automáticamente, en orden: verificación de formato, linting, pruebas y build (`.github/workflows/format-check.yml`).
