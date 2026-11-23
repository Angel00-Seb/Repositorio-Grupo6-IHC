document.addEventListener("DOMContentLoaded", function() {
    var grado = document.getElementById("grado");
    var seccion = document.getElementById("seccion");

    function actualizarSeccion() {
        var esSegundoGrado = grado.value === "2";
        seccion.disabled = !esSegundoGrado;

        if (!esSegundoGrado) {
            seccion.value = "A";
        }
    }

    grado.addEventListener("change", actualizarSeccion);
    actualizarSeccion();
});
