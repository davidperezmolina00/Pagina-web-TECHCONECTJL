// SIMULACIÓN DE BASE DE DATOS (Cuando tengáis la real, esto se cambiará por una consulta)
const productosBD = [
    { id: 1, nombre: "Consola PlayStation 5", categoria: "consolas", url: "consolas.html", precio: 450 },
    { id: 2, nombre: "Mando DualSense PS5", categoria: "accesorios", url: "accesorios.html", precio: 70 },
    { id: 3, nombre: "iPhone 15 Pro Max", categoria: "moviles", url: "moviles.html", precio: 1000 },
    { id: 4, nombre: "Cargador Carga Rápida", categoria: "accesorios", url: "accesorios.html", precio: 25 },
    { id: 5, nombre: "Nintendo Switch OLED", categoria: "consolas", url: "consolas.html", precio: 320 }
];

// FUNCIÓN QUE SE EJECUTA AL BUSCAR
function ejecutarBusqueda() {
    const input = document.getElementById('searchInput');
    const consulta = input.value.trim().toLowerCase();

    if (consulta === "") {
        alert("Por favor, escribe algo para buscar.");
        return;
    }

    // OPCIÓN A: Si tienes una página de resultados (ej. resultados.html?q=tu-busqueda)
    // window.location.href = `resultados.html?q=${encodeURIComponent(consulta)}`;

    // OPCIÓN B: Si quieres filtrar en la misma página (ej. moviles.html)
    // Aquí puedes añadir la lógica que recorra tus productos y oculte los que no coincidan
    console.log("Buscando producto:", consulta);
    
    // Ejemplo de filtrado genérico si estás en la página de listado:
    filtrarProductos(consulta);
}

function filtrarProductos(consulta) {
    // Esto es un ejemplo de cómo buscar en cualquier tarjeta de producto de tu web
    const productos = document.querySelectorAll('.product-card'); // Asumiendo que tus tarjetas tienen esta clase
    
    productos.forEach(card => {
        const textoProducto = card.innerText.toLowerCase();
        if (textoProducto.includes(consulta)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

    // 2. Filtramos el array buscando coincidencias en el nombre o la categoría
    const resultados = productosBD.filter(producto => {
        return producto.nombre.toLowerCase().includes(textoUsuario) || 
               producto.categoria.toLowerCase().includes(textoUsuario);
    });

    // 3. ¿Qué hacemos con los resultados? 
    // De momento, como no hay base de datos, vamos a redirigir al usuario de forma inteligente:
    if (resultados.length > 0) {
        // Si encuentra productos, nos lleva a la página de su categoría (ej: consolas.html)
        alert(`¡Encontrados ${resultados.length} productos! Redirigiendo...`);
        window.location.href = resultados[0].url; 
    } else {
        // Si no encuentra nada
        alert("No se encontraron productos que coincidan con tu búsqueda.");
    }
