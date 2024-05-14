# TMDAD_2024_front
Frontend del chat distribuido para la asignatura "Tecnologías y modelos para el desarrollo de aplicaciones distribuidas"

Máster Universitario en Ingeniería Informatica de la Universidad de Zaragoza

Curso 2023-2024

## Instalación

Descarga e instala Node.js (v20.12.1 (LTS)): https://nodejs.org/en/download

En el wizard de instalación, marca la opción "Instalar automáticamente las herramientas necesarias...".


Clona el repositorio:

```
git clone https://github.com/gcruz-UZ/TMDAD_2024_front.git
```

Navega dentro del directorio:

```
cd TMDAD_2024_front
```

Instala las dependencias:

```
npm install
```

Y ejecuta el servidor:

```
npm run server
```

Accede en un navegador a través de:

```
http://localhost:3000
```

## Compilar

Al desarrollar, para que los cambios tengan efecto en el navegador, hay que navegar al directorio:

```
cd TMDAD_2024_front/public
```

y ejecutar:

```
npm run build
```

Tras ello, se puede volver a lanzar el servidor con el comando de la sección anterior.

## Para que funcione WebSockets, importante (StompJS)

Navega dentro del directorio:

```
cd TMDAD_2024_front
```

Instala:

```
npm install @stomp/stompjs sockjs-client
```

Y luego vuelve a compilar como se explica en la sección *Compilar*

## Para que funcionen los modales

Navega dentro del directorio:

```
cd TMDAD_2024_front
```

Instala:

```
npm install react-modal
```

Y luego vuelve a compilar como se explica en la sección *Compilar*

