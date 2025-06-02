# 🧪 Sistema React – Guía de Instalación (Linux)

Este proyecto es una aplicación construida con React. Sigue los pasos a continuación para instalar las dependencias necesarias y ejecutar el proyecto en tu entorno local usando Linux.

---

## ⚙️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- Git
- Una terminal con acceso sudo

---

## 🟢 1. Instalar Node.js y npm

### Usando NodeSource (recomendado)

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

```
Verifia la instalacion 
```bash
node -v
npm -v
```
---
## ⚛️ 2. INstalar React(Create React App)
```bash
npm install -g create-react-app
```
## ⬇️ 3. Clonar el repositorio

```bash
git clone git@github.com:********/CorrespondenciaInterDEVA.git
cd CorrespondenciaInterDEVA
```
Remplaza ******* con tu usuario de GitHub

## 📦 4. Instalar dependencias del proyecto

```bash
npm install
```

## 🚀 5. Iniciar el servidor de desarrollo

```bash
npm start
```
Esto abrirá tu aplicación React en tu navegador predeterminado, generalmente en:
    http://localhost:5173