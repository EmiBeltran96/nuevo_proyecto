
// ======================= MANEJO DE SECCIONES =======================
document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll("nav.menuHorizontal a, nav.navFooter a");
    const secciones = {
        inicio: document.getElementById("inicio"),
        productos: document.getElementById("productos"),
        contacto: document.querySelector(".contenedorContacto"),
        preguntas: document.querySelector(".contenedorPreguntas"),
        carrito: document.querySelector(".carrito")
    };

    function mostrarSeccion(seccion) {
        for (let key in secciones) {
            secciones[key].style.display = "none";
        }
        secciones[seccion].style.display = "block";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Inicial: mostrar solo inicio
    mostrarSeccion("inicio");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const texto = link.textContent.trim().toLowerCase();
            if (texto === "preguntas frecuentes") {
                mostrarSeccion("preguntas");
            } else {
                mostrarSeccion(texto);
            }
        });
    });

    // Icono carrito en header
    const iconoCarrito = document.querySelector(".fa-cart-shopping");
    if (iconoCarrito) {
        iconoCarrito.parentElement.addEventListener("click", (e) => {
            e.preventDefault();
            mostrarSeccion("carrito");
        });
    }

    // ======================= FILTRADO DE CATEGORÍAS =======================
    const botonesCategoria = document.querySelectorAll(".categorias button");
    const gruposProductos = document.querySelectorAll(".productos_novedades");

    function filtrarCategoria(categoria) {
        gruposProductos.forEach(grupo => {
            const categoriasGrupo = grupo.dataset.categoria.split(" ");
            grupo.style.display = categoriasGrupo.includes(categoria) ? "flex" : "none";
        });
    }

    botonesCategoria.forEach(boton => {
        boton.addEventListener("click", () => {
            const categoria = boton.dataset.categoria;
            filtrarCategoria(categoria);
        });
    });

    // Mostrar todos al iniciar
    filtrarCategoria("todos");

    // ======================= CARRITO =======================
    const carrito = {};
    const contenedorCarrito = document.getElementById("itemsCarrito");
    const totalCarrito = document.getElementById("totalCarrito");

    function actualizarCarrito() {
        contenedorCarrito.innerHTML = "";
        let total = 0;

        for (let id in carrito) {
            const item = carrito[id];
            const div = document.createElement("div");
            div.classList.add("item-carrito");
            div.innerHTML = `
            <p class="nombreProductoCarrito">${item.nombre}</p>
            <div class="controlCantidad">
                <button class="btnMenos" data-id="${id}">-</button>
                <span>${item.cantidad}</span>
                <button class="btnMas" data-id="${id}">+</button>
                <button class="btnEliminar" data-id="${id}">❌</button>
            </div>
        `;
            contenedorCarrito.appendChild(div);
            total += item.precio * item.cantidad;
        }
        totalCarrito.textContent = total.toFixed(2);
    }

    document.querySelectorAll(".productos_main").forEach((producto, index) => {
        const nombre = producto.querySelector(".tituloProducto").textContent.trim();
        const precioTexto = producto.querySelector(".precioProducto").textContent.replace("$", "").replace(".", "").replace(",", ".");
        const precio = parseFloat(precioTexto);
        const id = nombre.toLowerCase().replace(/\s+/g, "-") + "-" + index;

        let cantidadSpan = producto.querySelector(".cantidadProducto");
        let cantidad = 1;

        producto.querySelector(".btnMas").addEventListener("click", () => {
            cantidad++;
            cantidadSpan.textContent = cantidad;
        });
        producto.querySelector(".btnMenos").addEventListener("click", () => {
            if (cantidad > 1) {
                cantidad--;
                cantidadSpan.textContent = cantidad;
            }
        });

        producto.querySelector(".btnAgregar").addEventListener("click", () => {
            if (carrito[id]) {
                carrito[id].cantidad += cantidad;
            } else {
                carrito[id] = {
                    nombre,
                    precio,
                    cantidad
                };
            }
            cantidad = 1;
            cantidadSpan.textContent = cantidad;
            actualizarCarrito();
        });
    });

    contenedorCarrito.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("btnMas")) {
            carrito[id].cantidad++;
        } else if (e.target.classList.contains("btnMenos")) {
            if (carrito[id].cantidad > 1) {
                carrito[id].cantidad--;
            }
        } else if (e.target.classList.contains("btnEliminar")) {
            delete carrito[id];
        }
        actualizarCarrito();
    });
});
