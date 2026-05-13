# ❖ WebGL 2 Engine Project

This repository documents the development of a low-level graphics engine built with **WebGL 2**, **TypeScript**, and **Astro**, focused on graphics programming, applied linear algebra, and rendering optimization.

---

## Δ Core Concepts & Math

Unlike projects that rely on libraries like `gl-matrix`, this engine implements all math utilities from scratch for full control over the rendering pipeline.

### Transformation Matrices

The engine uses a 4x4 matrix system to handle translation, scale, and rotation. Rotations follow Euler angles applied in Z-Y-X order:

$$R_z(\theta) = \begin{bmatrix} \cos\theta & -\sin\theta & 0 & 0 \\ \sin\theta & \cos\theta & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

### CPU vs GPU Architecture

Performance is structured around the **MVP (Model-View-Projection)** pattern:

* **CPU:** Multiplies transformation and projection matrices once per frame per object.
* **GPU:** The Vertex Shader receives the final matrix via `uniform` and applies it
  to each vertex, eliminating per-vertex trigonometric overhead.

---

## ⌘ Tech Stack

* **Astro & Vite:** Fast dev environment with Hot Module Replacement (HMR).
* **TypeScript:** Strict typing to prevent common buffer and array manipulation errors.
* **WebGL 2:** GLSL ES 3.00 shaders and modern features like Vertex Array Objects (VAO).

---

## ⬡ Roadmap

* [x] Buffer and shader setup.
* [x] Dynamic transformation system.
* [x] Directional light with translation.
* [x] `.obj` file parser with triangulation support.
* [x] Camera with translation.
* [ ] Refactor for dynamic object rendering.
* [ ] Uniform validation.
* [ ] Experimental WebAssembly integration for heavy particle systems.

---

## ⚙ Getting Started

```bash
# Instalar dependências
npm install

# Rodar ambiente de desenvolvimento
npm run dev

# Build para produção
npm run build
```

---

> **Portfolio note:** This project started as a study on WebGL and ended up going
> deeper than expected — covering how data moves between system memory and the GPU,
> why matrix multiplication order matters, and how small decisions like texture size
> or buffer layout affect real performance. Everything here was written and reasoned
> about manually, without abstractions hiding the details.