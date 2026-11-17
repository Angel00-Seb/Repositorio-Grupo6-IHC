document.addEventListener("DOMContentLoaded", function() {
     
    // LOGIN
    var loginForm = document.getElementById("login-form");
    var loginSec = document.getElementById("login-section");
    var mainSec = document.getElementById("main-section");
    var btnLogout = document.getElementById("btn-logout");
    var loginError = document.getElementById("login-error");

    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        var user = document.getElementById("usuario").value;
        var pass = document.getElementById("password").value;

        if (user === "directora" && pass === "demo2026") {
            loginSec.classList.add("oculto");
            mainSec.classList.remove("oculto");
            loginError.classList.add("oculto");
            historialVistas = [];
            mostrarPantalla("matricula");
            actualizarBotonVolver();
        } else {
            loginError.classList.remove("oculto");
        }
    });

    btnLogout.addEventListener("click", function() {
        mainSec.classList.add("oculto");
        loginSec.classList.remove("oculto");
        loginForm.reset();
        loginError.classList.add("oculto");
        historialVistas = [];
        mostrarPantalla("matricula");
        actualizarBotonVolver();
    });

    // CARRUSEL
    var slideIndex = 0;
    var slides = document.querySelectorAll(".carousel-slide");
    
    function mostrarSlide(n) {
        for (var i = 0; i < slides.length; i++) {
            slides[i].classList.remove("active");
        }
        if (n >= slides.length) { slideIndex = 0; }
        if (n < 0) { slideIndex = slides.length - 1; }
        slides[slideIndex].classList.add("active");
    }

    document.getElementById("nextBtn").addEventListener("click", function() {
        slideIndex++; mostrarSlide(slideIndex);
    });
    document.getElementById("prevBtn").addEventListener("click", function() {
        slideIndex--; mostrarSlide(slideIndex);
    });

    // MATRÍCULA
    var formMatricula = document.getElementById("matricula-form");
    var alerta = document.getElementById("alerta");

    formMatricula.addEventListener("submit", function(e) {
        e.preventDefault();
        var dniInput = document.getElementById("dni").value;
        var gradoInput = document.getElementById("grado").value;
        var seccionInput = document.getElementById("seccion").value;

        if (seccionInput === "B" && gradoInput !== "2") {
            alerta.innerHTML = "Error: La sección B solo es para 2º de secundaria.";
            alerta.className = "error"; alerta.classList.remove("oculto"); return;
        }
        if (dniInput.length !== 8) {
            alerta.innerHTML = "Error: El DNI debe tener exactamente 8 números.";
            alerta.className = "error"; alerta.classList.remove("oculto"); return;
        }
        alerta.innerHTML = "¡Matrícula guardada correctamente!";
        alerta.className = "exito"; alerta.classList.remove("oculto"); formMatricula.reset();
    });

    // BARRA LATERAL
    var sidebar = document.getElementById("sidebar");
    var sidebarToggle = document.getElementById("sidebar-toggle");

    sidebarToggle.addEventListener("click", function() {
        var collapsed = sidebar.classList.toggle("is-collapsed");
        sidebarToggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
        sidebarToggle.setAttribute("aria-label", collapsed ? "Expandir menú" : "Contraer menú");
    });

    // NAVEGACIÓN ENTRE VISTAS Y BOTÓN VOLVER
    var navItems = document.querySelectorAll(".nav-item");
    var vistas = document.querySelectorAll(".view");
    var reportCards = document.querySelectorAll(".report-card");
    var detalles = document.querySelectorAll(".reporte-detalle");
    var btnVolver = document.getElementById("btn-volver");
    var historialVistas = [];

    function pantallaActual() {
        var detalleAbierto = document.querySelector(".reporte-detalle:not(.oculto)");
        if (detalleAbierto) {
            return detalleAbierto.id;
        }
        var vistaVisible = document.querySelector(".view:not(.oculto)");
        return vistaVisible ? vistaVisible.id.replace("view-", "") : "matricula";
    }

    function actualizarBotonVolver() {
        btnVolver.disabled = historialVistas.length === 0;
    }

    function mostrarPantalla(pantalla) {
        var esDetalle = pantalla.indexOf("detalle-") === 0;
        var vistaBase = esDetalle ? "reportes" : pantalla;

        navItems.forEach(function(nav) {
            var activa = nav.getAttribute("data-vista") === vistaBase;
            nav.classList.toggle("activo", activa);
            if (activa) {
                nav.setAttribute("aria-current", "page");
            } else {
                nav.removeAttribute("aria-current");
            }
        });

        vistas.forEach(function(vista) {
            var visible = vista.id === "view-" + vistaBase;
            vista.classList.toggle("oculto", !visible);
            vista.setAttribute("aria-hidden", visible ? "false" : "true");
        });

        reportCards.forEach(function(card) {
            card.classList.remove("activo");
            card.setAttribute("aria-pressed", "false");
            card.setAttribute("aria-expanded", "false");
        });

        detalles.forEach(function(panel) {
            panel.classList.toggle("oculto", panel.id !== pantalla);
            panel.querySelector(".reporte-error").textContent = mensajeSinCoincidencias;
            panel.querySelectorAll("input").forEach(function(entrada) {
                entrada.value = "";
            });
        });

        if (!esDetalle) {
            return;
        }

        var clave = pantalla.replace("detalle-", "");
        var card = document.querySelector('.report-card[data-panel="' + clave + '"]');
        if (card) {
            card.classList.add("activo");
            card.setAttribute("aria-pressed", "true");
            card.setAttribute("aria-expanded", "true");
        }

        if (clave === "asistencia") {
            document.querySelectorAll(".btn-tipo").forEach(function(boton) {
                boton.setAttribute("aria-pressed", "false");
            });
            document.getElementById("hint-asistencia").classList.remove("oculto");
            document.querySelector("#detalle-asistencia .tabla-registros").classList.add("oculto");
            document.querySelector("#detalle-asistencia .reporte-error").classList.add("oculto");
            return;
        }

        renderizar(clave, configReportes[clave].datos);
    }

    function irA(pantalla) {
        if (pantalla === pantallaActual()) {
            return;
        }
        historialVistas.push(pantallaActual());
        mostrarPantalla(pantalla);
        actualizarBotonVolver();
    }

    navItems.forEach(function(item) {
        item.addEventListener("click", function() {
            irA(item.getAttribute("data-vista"));
        });
    });

    btnVolver.addEventListener("click", function() {
        if (historialVistas.length === 0) {
            return;
        }
        var anterior = historialVistas.pop();
        mostrarPantalla(anterior);
        actualizarBotonVolver();
    });

    // REPORTES: búsqueda y registros
    var mensajeSinCoincidencias = "No se encontraron reportes que coincidan con la búsqueda.";

    var configReportes = {
        matricula: {
            datos: [
                { nombres: "Ana Lucía Quispe", dni: "12345678", grado: "2º de secundaria", seccion: "B", fecha: "14/03/2026" },
                { nombres: "Carlos Daniel Rojas", dni: "87654321", grado: "4º de secundaria", seccion: "A", fecha: "15/03/2026" },
                { nombres: "María Fernanda Vargas", dni: "45678123", grado: "1º de secundaria", seccion: "A", fecha: "16/03/2026" },
                { nombres: "Jorge Alberto Mendoza", dni: "11223344", grado: "2º de secundaria", seccion: "B", fecha: "17/03/2026" },
                { nombres: "Sofía Isabel Campos", dni: "55667788", grado: "5º de secundaria", seccion: "A", fecha: "18/03/2026" },
                { nombres: "Luis Enrique Paredes", dni: "99887766", grado: "3º de secundaria", seccion: "A", fecha: "19/03/2026" }
            ],
            campos: ["nombres", "dni", "grado", "seccion", "fecha"],
            columnas: ["Estudiante", "DNI", "Grado", "Sección", "Fecha"]
        },
        consolidado: {
            datos: [
                { estudiante: "Ana Lucía Quispe", grado: "2º de secundaria", edad: "13 años", seccion: "B", periodo: "2026 - I", promedio: "17.8", asistencia: "96%", conducta: "Excelente" },
                { estudiante: "Carlos Daniel Rojas", grado: "4º de secundaria", edad: "15 años", seccion: "A", periodo: "2026 - I", promedio: "15.4", asistencia: "88%", conducta: "Satisfactoria" },
                { estudiante: "María Fernanda Vargas", grado: "1º de secundaria", edad: "11 años", seccion: "A", periodo: "2026 - I", promedio: "18.5", asistencia: "98%", conducta: "Excelente" },
                { estudiante: "Jorge Alberto Mendoza", grado: "2º de secundaria", edad: "12 años", seccion: "B", periodo: "2026 - I", promedio: "13.9", asistencia: "82%", conducta: "En proceso" },
                { estudiante: "Sofía Isabel Campos", grado: "5º de secundaria", edad: "17 años", seccion: "A", periodo: "2026 - I", promedio: "16.7", asistencia: "94%", conducta: "Satisfactoria" },
                { estudiante: "Luis Enrique Paredes", grado: "3º de secundaria", edad: "14 años", seccion: "A", periodo: "2026 - I", promedio: "14.6", asistencia: "90%", conducta: "En proceso" }
            ],
            campos: ["estudiante", "grado", "edad", "seccion", "periodo", "promedio", "asistencia", "conducta"],
            columnas: ["Estudiante", "Grado", "Edad", "Sección", "Periodo", "Promedio", "Asistencia", "Conducta"]
        },
        asistencia: {
            vistas: {
                diaria: {
                    columnas: ["Docente", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
                    campos: ["docente", "lunes", "martes", "miercoles", "jueves", "viernes"]
                },
                semanal: {
                    columnas: ["Docente", "Semana 1", "Semana 2", "Semana 3", "Semana 4"],
                    campos: ["docente", "semana1", "semana2", "semana3", "semana4"]
                }
            },
            datos: [
                { docente: "Prof. Rosa Mendoza", lunes: "Asistió", martes: "Asistió", miercoles: "Tardanza", jueves: "Asistió", viernes: "Asistió", semana1: "Asistió", semana2: "Asistió", semana3: "Falta", semana4: "Asistió" },
                { docente: "Prof. Javier Ríos", lunes: "Asistió", martes: "Falta", miercoles: "Asistió", jueves: "Asistió", viernes: "Tardanza", semana1: "Asistió", semana2: "Tardanza", semana3: "Asistió", semana4: "Asistió" },
                { docente: "Prof. Elena Torres", lunes: "Tardanza", martes: "Asistió", miercoles: "Asistió", jueves: "Falta", viernes: "Asistió", semana1: "Falta", semana2: "Asistió", semana3: "Asistió", semana4: "Tardanza" }
            ]
        }
    };

    function normalizar(texto) {
        return String(texto)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    function renderizar(clave, filas, vista) {
        var config = vista || configReportes[clave];
        var panel = document.getElementById("detalle-" + clave);
        var tabla = panel.querySelector(".tabla-registros");
        var cabecera = tabla.tHead;
        var cuerpo = tabla.tBodies[0];
        var error = panel.querySelector(".reporte-error");

        cabecera.textContent = "";
        cuerpo.textContent = "";

        var filaCabecera = document.createElement("tr");
        config.columnas.forEach(function(columna) {
            var th = document.createElement("th");
            th.setAttribute("scope", "col");
            th.textContent = columna;
            filaCabecera.appendChild(th);
        });
        cabecera.appendChild(filaCabecera);

        filas.forEach(function(dato) {
            var fila = document.createElement("tr");
            config.campos.forEach(function(campo) {
                var celda = document.createElement("td");
                celda.textContent = dato[campo];
                fila.appendChild(celda);
            });
            cuerpo.appendChild(fila);
        });

        var sinRegistros = filas.length === 0;
        tabla.classList.toggle("oculto", sinRegistros);
        error.classList.toggle("oculto", !sinRegistros);
    }

    reportCards.forEach(function(card) {
        card.addEventListener("click", function() {
            irA("detalle-" + card.getAttribute("data-panel"));
        });
    });

    document.querySelectorAll(".busqueda-form").forEach(function(form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            var clave = form.getAttribute("data-busqueda");
            if (!clave || clave === "asistencia") {
                return;
            }

            var config = configReportes[clave];
            var panel = document.getElementById("detalle-" + clave);
            var error = panel.querySelector(".reporte-error");
            var filas;
            var nombre;
            var dni;
            var gradoSeccion;

            error.textContent = mensajeSinCoincidencias;

            if (clave === "matricula") {
                nombre = normalizar(document.getElementById("buscar-nombre-matricula").value.trim());
                dni = normalizar(document.getElementById("buscar-dni-matricula").value.trim());
                filas = config.datos.filter(function(fila) {
                    var coincideNombre = nombre === "" || normalizar(fila.nombres).indexOf(nombre) !== -1;
                    var coincideDni = dni === "" || normalizar(fila.dni).indexOf(dni) !== -1;
                    return coincideNombre && coincideDni;
                });
            } else {
                nombre = normalizar(document.getElementById("buscar-nombre-consolidado").value.trim());
                gradoSeccion = normalizar(document.getElementById("buscar-grado-seccion-consolidado").value.trim());
                filas = config.datos.filter(function(fila) {
                    var coincideNombre = nombre === "" || normalizar(fila.estudiante).indexOf(nombre) !== -1;
                    var coincideGradoSeccion = gradoSeccion === "" ||
                        normalizar(fila.grado + " " + fila.seccion).indexOf(gradoSeccion) !== -1 ||
                        normalizar(fila.grado).indexOf(gradoSeccion) !== -1 ||
                        normalizar(fila.seccion).indexOf(gradoSeccion) !== -1;
                    return coincideNombre && coincideGradoSeccion;
                });
            }

            renderizar(clave, filas);
        });
    });

    // Asistencia docente: solo dos botones, Diario y Semanal
    document.querySelectorAll(".btn-tipo").forEach(function(boton) {
        boton.addEventListener("click", function() {
            document.querySelectorAll(".btn-tipo").forEach(function(other) {
                other.setAttribute("aria-pressed", "false");
            });
            boton.setAttribute("aria-pressed", "true");

            var tipo = boton.getAttribute("data-tipo");
            var vista = configReportes.asistencia.vistas[tipo];

            document.getElementById("hint-asistencia").classList.add("oculto");
            renderizar("asistencia", configReportes.asistencia.datos, vista);
        });
    });
});
