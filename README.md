# Gateway de servicios con Traefik

Este proyecto implementa un **reverse proxy con Traefik** para exponer una API Node.js conectada a **Neo4j**, asegurando balanceo de carga, middlewares de seguridad y un dashboard de monitoreo protegido con autenticación básica.

---

## 📌 Topología

![Arquitectura](diagram.png)

- **Clientes** acceden vía:
  - `http://api.localhost` → API.
  - `http://ops.localhost/dashboard/` → dashboard Traefik (requiere credenciales).
- **Traefik** funciona como reverse proxy y balanceador.
- **API** (2 réplicas) desarrollada en Node.js + Express.
- **Neo4j** como base de datos, accesible solo desde la red Docker.

---

## 📂 Estructura del proyecto

traefik-project/
├─ docker-compose.yml
├─ api/
│ ├─ Dockerfile
│ ├─ package.json
│ └─ index.js
└─ diagram.png

## ⚙️ Hosts configurados

En `/etc/hosts` se agregaron:
127.0.0.1 api.localhost
127.0.0.1 ops.localhost


## Pruebas

Se encuentran en la carpeta evidencias

