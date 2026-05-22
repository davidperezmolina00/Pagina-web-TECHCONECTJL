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
    // 1. Capturamos lo que el usuario ha escrito en el input y lo pasamos a minúsculas
    const textoUsuario = document.getElementById("searchInput").value.toLowerCase().trim();
    
    // Si el usuario le da a buscar con la barra vacía, no hacemos nada
    if (textoUsuario === "") {
        alert("Por favor, escribe algo para buscar.");
        return;
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
}