/* ============================================================
   main.js - Orquestador de vistas

   Convención para el equipo:
   - Cada módulo tiene su bloque marcado con // --- NOMBRE ---
   - Vista nueva = <section id="view-<nombre>" class="view ..."> en index.html
   - El nav usa data-vista="<nombre>"; no hay que registrar nada en JS
   - Si un módulo crece, mover su bloque a js/components/<modulo>.js
     y cargarlo con <script defer> en index.html
   ============================================================ */
document.addEventListener("DOMContentLoaded", function() {

    // --- USUARIO ACTIVO ---
    // Único lugar donde se define el usuario del prototipo.
    // Cuando exista sesión real, reemplazar estos dos valores.
    var usuarioActivo = {
        nombre: "Dra. Iris Saavedra",
        rol: "Directora"
    };
    document.getElementById("nombre-usuario").textContent = usuarioActivo.nombre;
    document.getElementById("rol-usuario").textContent = usuarioActivo.rol;

    // --- MODO OSCURO ---
    // Solo visual y sin persistencia: siempre inicia en modo claro.
    var themeToggle = document.getElementById("theme-toggle");
    var iconMoon = themeToggle.querySelector(".icon-moon");
    var iconSun = themeToggle.querySelector(".icon-sun");

    function aplicarTema(oscuro) {
        document.documentElement.setAttribute("data-theme", oscuro ? "dark" : "light");
        themeToggle.setAttribute("aria-pressed", oscuro ? "true" : "false");
        var etiqueta = oscuro ? "Activar modo claro" : "Activar modo oscuro";
        themeToggle.setAttribute("aria-label", etiqueta);
        themeToggle.setAttribute("title", etiqueta);
        iconMoon.classList.toggle("oculto", oscuro);
        iconSun.classList.toggle("oculto", !oscuro);
    }

    aplicarTema(false);
    themeToggle.addEventListener("click", function() {
        var oscuro = document.documentElement.getAttribute("data-theme") === "dark";
        aplicarTema(!oscuro);
    });

    // --- LOGIN ---
    var loginForm = document.getElementById("login-form");
    var loginSec = document.getElementById("login-section");
    var mainSec = document.getElementById("main-section");
    var btnLogout = document.getElementById("btn-logout");
    var homeLogout = document.getElementById("home-logout");
    var loginError = document.getElementById("login-error");
    var confirmarSalida = document.getElementById("confirmar-salida");
    var ultimoBotonSalida = btnLogout;

    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        var user = document.getElementById("usuario").value;
        var pass = document.getElementById("password").value;

        if (user === "directora" && pass === "demo2026") {
            loginSec.classList.add("oculto");
            mainSec.classList.remove("oculto");
            loginError.classList.add("oculto");
            historialVistas = [];
            mostrarPantalla("inicio");
            actualizarBotonVolver();
            window.location.hash = mainSec.id;
            mainSec.scrollIntoView();
        } else {
            loginError.classList.remove("oculto");
        }
    });

    [btnLogout, homeLogout].forEach(function(boton) {
        boton.addEventListener("click", function() {
            ultimoBotonSalida = boton;
            confirmarSalida.showModal();
        });
    });

    document.getElementById("cancelar-salida").addEventListener("click", function() {
        confirmarSalida.close();
        ultimoBotonSalida.focus();
    });

    document.getElementById("aceptar-salida").addEventListener("click", function() {
        confirmarSalida.close();
        mainSec.classList.add("oculto");
        loginSec.classList.remove("oculto");
        loginForm.reset();
        loginError.classList.add("oculto");
        historialVistas = [];
        mostrarPantalla("inicio");
        actualizarBotonVolver();
        window.location.hash = "";
        loginSec.scrollIntoView();
    });

    // --- CARRUSEL ---
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

    // --- MATRÍCULA ---
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

    // --- CONTROL DE ASISTENCIA DOCENTE ---
    var formularioDocente = document.getElementById("form-docente");
    var dniDocente = document.getElementById("dni-docente");
    var listaDocentes = document.getElementById("lista-docentes");
    var listaAsistencias = document.getElementById("lista-asistencias");
    var buscarDocente = document.getElementById("buscar-docente");
    var botonBuscarDocente = document.getElementById("buscar-docente-btn");
    var seleccionDocente = document.getElementById("docente-asistencia");
    var fechaAsistencia = document.getElementById("fecha-asistencia");
    var horaAsistencia = document.getElementById("hora-asistencia");
    var estadoAsistencia = document.getElementById("estado-asistencia");
    var grupoJustificacion = document.getElementById("grupo-justificacion");
    var justificacionAsistencia = document.getElementById("justificacion-asistencia");
    var formularioAsistencia = document.getElementById("form-asistencia");
    var mensajeDocente = document.getElementById("mensaje-docente");
    var mensajeAsistencia = document.getElementById("mensaje-asistencia");
    var mensajeBusquedaDocente = document.getElementById("mensaje-busqueda-docente");
    var docentes = [];
    var asistencias = [];

    function mostrarMensaje(elemento, mensaje, tipo) {
        elemento.textContent = mensaje;
        elemento.className = "docentes-mensaje " + tipo;
    }

    function limpiarMensaje(elemento) {
        elemento.textContent = "";
        elemento.className = "docentes-mensaje oculto";
    }

    function normalizarBusquedaDocente(texto) {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    function mostrarDocentes() {
        listaDocentes.textContent = "";

        if (docentes.length === 0) {
            var filaVacia = document.createElement("tr");
            var celdaVacia = document.createElement("td");
            celdaVacia.colSpan = 4;
            celdaVacia.textContent = "Aún no hay docentes registrados.";
            filaVacia.appendChild(celdaVacia);
            listaDocentes.appendChild(filaVacia);
            return;
        }

        docentes.forEach(function(docente) {
            var fila = document.createElement("tr");
            [docente.dni, docente.nombres, docente.apellidos, docente.especialidad].forEach(function(valor) {
                var celda = document.createElement("td");
                celda.textContent = valor;
                fila.appendChild(celda);
            });
            listaDocentes.appendChild(fila);
        });
    }

    function buscarDocentePorDni(dni) {
        for (var i = 0; i < docentes.length; i++) {
            if (docentes[i].dni === dni) {
                return docentes[i];
            }
        }
        return null;
    }

    function buscarDocentesRegistrados() {
        var termino = normalizarBusquedaDocente(buscarDocente.value.trim());
        var docentesFiltrados = docentes.filter(function(docente) {
            var nombres = normalizarBusquedaDocente(docente.nombres);
            var apellidos = normalizarBusquedaDocente(docente.apellidos);
            var nombreCompleto = nombres + " " + apellidos;
            return nombreCompleto.indexOf(termino) !== -1 ||
                nombres.indexOf(termino) !== -1 ||
                apellidos.indexOf(termino) !== -1 ||
                docente.dni.indexOf(termino) !== -1;
        });

        seleccionDocente.textContent = "";
        var opcionInicial = document.createElement("option");
        opcionInicial.value = "";
        opcionInicial.textContent = docentes.length === 0
            ? "Primero registre un docente."
            : docentesFiltrados.length === 0
                ? "No se encontraron coincidencias."
                : "Seleccione un docente...";
        seleccionDocente.appendChild(opcionInicial);

        docentesFiltrados.forEach(function(docente) {
            var opcion = document.createElement("option");
            opcion.value = docente.dni;
            opcion.textContent = docente.nombres + " " + docente.apellidos + " — DNI " + docente.dni;
            seleccionDocente.appendChild(opcion);
        });

        if (docentes.length === 0) {
            mostrarMensaje(mensajeBusquedaDocente, "Aún no hay docentes registrados. Registre uno en el catálogo para comenzar.", "error");
        } else if (docentesFiltrados.length === 0) {
            mostrarMensaje(mensajeBusquedaDocente, "No se encontraron docentes que coincidan con el nombre, apellido o DNI.", "error");
        } else {
            mostrarMensaje(mensajeBusquedaDocente, docentesFiltrados.length + " docente(s) encontrado(s). Seleccione uno de la lista.", "exito");
        }
    }

    function fechaLocal(fecha) {
        var anio = fecha.getFullYear();
        var mes = ("0" + (fecha.getMonth() + 1)).slice(-2);
        var dia = ("0" + fecha.getDate()).slice(-2);
        return anio + "-" + mes + "-" + dia;
    }

    function establecerFechaHoraActual() {
        var ahora = new Date();
        fechaAsistencia.value = fechaLocal(ahora);
        horaAsistencia.value = ("0" + ahora.getHours()).slice(-2) + ":" +
            ("0" + ahora.getMinutes()).slice(-2);
    }

    function formatearFecha(fecha) {
        var partes = fecha.split("-");
        return partes.length === 3 ? partes[2] + "/" + partes[1] + "/" + partes[0] : fecha;
    }

    function mostrarAsistencias() {
        listaAsistencias.textContent = "";

        if (asistencias.length === 0) {
            var filaVacia = document.createElement("tr");
            var celdaVacia = document.createElement("td");
            celdaVacia.colSpan = 6;
            celdaVacia.textContent = "Aún no hay asistencias registradas.";
            filaVacia.appendChild(celdaVacia);
            listaAsistencias.appendChild(filaVacia);
            return;
        }

        for (var i = asistencias.length - 1; i >= 0; i--) {
            var asistencia = asistencias[i];
            var fila = document.createElement("tr");
            [
                asistencia.docente,
                asistencia.dni,
                formatearFecha(asistencia.fecha),
                asistencia.hora,
                asistencia.estado,
                asistencia.justificacion || "—"
            ].forEach(function(valor) {
                var celda = document.createElement("td");
                celda.textContent = valor;
                fila.appendChild(celda);
            });
            listaAsistencias.appendChild(fila);
        }
    }

    function actualizarCampoJustificacion() {
        var requiereJustificacion = estadoAsistencia.value === "Falta justificada";
        grupoJustificacion.classList.toggle("oculto", !requiereJustificacion);
        justificacionAsistencia.required = requiereJustificacion;
        if (!requiereJustificacion) {
            justificacionAsistencia.value = "";
        }
    }

    function registrarAsistencia(event) {
        event.preventDefault();
        limpiarMensaje(mensajeAsistencia);

        var docente = buscarDocentePorDni(seleccionDocente.value);
        var fecha = fechaAsistencia.value;
        var hora = horaAsistencia.value;
        var estado = estadoAsistencia.value;
        var justificacion = justificacionAsistencia.value.trim();

        if (!docente || !fecha || !hora || !estado) {
            mostrarMensaje(mensajeAsistencia, "Seleccione un docente y complete la fecha, la hora y el estado.", "error");
            return;
        }
        if (estado === "Falta justificada" && !justificacion) {
            mostrarMensaje(mensajeAsistencia, "Ingrese el motivo para justificar la falta.", "error");
            return;
        }
        if (["Asistencia", "Tardanza", "Falta justificada", "Falta injustificada"].indexOf(estado) === -1) {
            mostrarMensaje(mensajeAsistencia, "Seleccione un estado válido para la asistencia.", "error");
            return;
        }

        asistencias.push({
            docente: docente.nombres + " " + docente.apellidos,
            dni: docente.dni,
            fecha: fecha,
            hora: hora,
            estado: estado,
            justificacion: estado === "Falta justificada" ? justificacion : ""
        });
        mostrarAsistencias();
        formularioAsistencia.reset();
        establecerFechaHoraActual();
        actualizarCampoJustificacion();
        buscarDocente.value = "";
        seleccionDocente.textContent = "";
        var opcionInicial = document.createElement("option");
        opcionInicial.value = "";
        opcionInicial.textContent = docentes.length === 0 ? "Primero registre un docente." : "Busque y seleccione un docente.";
        seleccionDocente.appendChild(opcionInicial);
        limpiarMensaje(mensajeBusquedaDocente);
        mostrarMensaje(mensajeAsistencia, "Asistencia registrada correctamente.", "exito");
    }

    dniDocente.addEventListener("input", function() {
        dniDocente.value = dniDocente.value.replace(/\D/g, "").slice(0, 8);
    });

    formularioDocente.addEventListener("submit", function(event) {
        event.preventDefault();
        limpiarMensaje(mensajeDocente);

        var dni = dniDocente.value.trim();
        var nombres = document.getElementById("nombre-docente").value.trim();
        var apellidos = document.getElementById("apellido-docente").value.trim();
        var especialidad = document.getElementById("especialidad-docente").value.trim();

        if (!/^\d{8}$/.test(dni)) {
            mostrarMensaje(mensajeDocente, "El DNI debe tener exactamente 8 dígitos numéricos. Complete los 8 dígitos.", "error");
            return;
        }
        if (!nombres || !apellidos || !especialidad) {
            mostrarMensaje(mensajeDocente, "Complete los nombres, apellidos y especialidad para registrar al docente.", "error");
            return;
        }
        if (buscarDocentePorDni(dni)) {
            mostrarMensaje(mensajeDocente, "Ya existe un docente registrado con ese DNI.", "error");
            return;
        }

        docentes.push({
            dni: dni,
            nombres: nombres,
            apellidos: apellidos,
            especialidad: especialidad
        });
        mostrarDocentes();
        formularioDocente.reset();
        buscarDocente.value = "";
        seleccionDocente.textContent = "";
        var opcionInicial = document.createElement("option");
        opcionInicial.value = "";
        opcionInicial.textContent = "Busque y seleccione un docente.";
        seleccionDocente.appendChild(opcionInicial);
        limpiarMensaje(mensajeBusquedaDocente);
        mostrarMensaje(mensajeDocente, "Docente registrado correctamente.", "exito");
    });

    botonBuscarDocente.addEventListener("click", buscarDocentesRegistrados);
    buscarDocente.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            buscarDocentesRegistrados();
        }
    });
    estadoAsistencia.addEventListener("change", actualizarCampoJustificacion);
    formularioAsistencia.addEventListener("submit", registrarAsistencia);

    mostrarDocentes();
    establecerFechaHoraActual();
    actualizarCampoJustificacion();
    mostrarAsistencias();

    // --- BARRA LATERAL ---
    var sidebar = document.getElementById("sidebar");
    var sidebarToggle = document.getElementById("sidebar-toggle");

    sidebarToggle.addEventListener("click", function() {
        var collapsed = sidebar.classList.toggle("is-collapsed");
        sidebarToggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
        sidebarToggle.setAttribute("aria-label", collapsed ? "Expandir menú" : "Contraer menú");
    });

    // --- NAVEGACIÓN ENTRE VISTAS Y BOTÓN VOLVER ---
    var navItems = document.querySelectorAll(".nav-item");
    var vistas = document.querySelectorAll(".view");
    var reportCards = document.querySelectorAll(".report-card");
    var reportButtons = document.querySelectorAll(".report-card .btn-solid");
    var detalles = document.querySelectorAll(".reporte-detalle");
    var btnVolver = document.getElementById("btn-volver");
    var historialVistas = [];

    function pantallaActual() {
        var vistaVisible = document.querySelector(".view:not(.oculto)");
        return vistaVisible ? vistaVisible.id.replace("view-", "") : "matricula";
    }

    function actualizarBotonVolver() {
        btnVolver.disabled = historialVistas.length === 0;
    }

    function mostrarPantalla(pantalla) {
        var esReporte = pantalla.indexOf("reporte-") === 0;
        var clave = esReporte ? pantalla.replace("reporte-", "") : "";
        var vistaBase = esReporte ? "reportes" : pantalla;

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
            var visible = vista.id === "view-" + pantalla;
            vista.classList.toggle("oculto", !visible);
            vista.setAttribute("aria-hidden", visible ? "false" : "true");
        });

        reportCards.forEach(function(card) {
            card.classList.remove("activo");
        });

        reportButtons.forEach(function(boton) {
            boton.setAttribute("aria-pressed", "false");
            boton.setAttribute("aria-expanded", "false");
        });

        detalles.forEach(function(panel) {
            var error = panel.querySelector(".reporte-error");
            error.textContent = mensajeSinCoincidencias;
            error.classList.add("oculto");
            error.classList.remove("animation-shake");
            panel.querySelectorAll("input").forEach(function(entrada) {
                entrada.value = "";
                entrada.classList.remove("is-invalid");
            });
        });

        if (pantalla === "reportes") {
            actualizarDashboard();
        }

        if (!esReporte) {
            return;
        }

        var card = document.querySelector('.report-card[data-panel="' + clave + '"]');
        if (card) {
            card.classList.add("activo");
            var botonActivo = card.querySelector(".btn-solid");
            if (botonActivo) {
                botonActivo.setAttribute("aria-pressed", "true");
                botonActivo.setAttribute("aria-expanded", "true");
            }
        }

        if (clave === "asistencia") {
            var selectTipo = document.getElementById("tipo-asistencia");
            var selectMes = document.getElementById("mes-asistencia");
            if (selectTipo) {
                selectTipo.value = "diaria";
            }
            if (selectMes) {
                selectMes.value = "Marzo";
            }
            renderizarAsistenciaActual();
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

    document.querySelectorAll("[data-home-vista]").forEach(function(boton) {
        boton.addEventListener("click", function() {
            irA(boton.getAttribute("data-home-vista"));
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

    // --- REPORTES: búsqueda y registros ---
    var mensajeSinCoincidencias = "No se encontraron reportes que coincidan con la búsqueda.";

    var configReportes = {
        matricula: {
            datos: [
                { id: "E-001", nombres: "Ana Lucía Quispe", dni: "12345678", grado: "2º de secundaria", seccion: "B", fecha: "14/03/2026" },
                { id: "E-002", nombres: "Carlos Daniel Rojas", dni: "87654321", grado: "4º de secundaria", seccion: "A", fecha: "15/03/2026" },
                { id: "E-003", nombres: "María Fernanda Vargas", dni: "45678123", grado: "1º de secundaria", seccion: "A", fecha: "16/03/2026" },
                { id: "E-004", nombres: "Jorge Alberto Mendoza", dni: "11223344", grado: "2º de secundaria", seccion: "B", fecha: "17/03/2026" },
                { id: "E-005", nombres: "Sofía Isabel Campos", dni: "55667788", grado: "5º de secundaria", seccion: "A", fecha: "18/03/2026" },
                { id: "E-006", nombres: "Luis Enrique Paredes", dni: "99887766", grado: "3º de secundaria", seccion: "A", fecha: "19/03/2026" }
            ],
            campos: ["id", "nombres", "dni", "grado", "seccion", "fecha"],
            columnas: ["ID", "Estudiante", "DNI", "Grado", "Sección", "Fecha"]
        },
        consolidado: {
            datos: [
                { id: "E-001", estudiante: "Ana Lucía Quispe", grado: "2º de secundaria", edad: "13 años", seccion: "B", periodo: "2026 - I", promedio: "17.8", asistencia: "96%", conducta: "Excelente" },
                { id: "E-002", estudiante: "Carlos Daniel Rojas", grado: "4º de secundaria", edad: "15 años", seccion: "A", periodo: "2026 - I", promedio: "15.4", asistencia: "88%", conducta: "Satisfactoria" },
                { id: "E-003", estudiante: "María Fernanda Vargas", grado: "1º de secundaria", edad: "11 años", seccion: "A", periodo: "2026 - I", promedio: "18.5", asistencia: "98%", conducta: "Excelente" },
                { id: "E-004", estudiante: "Jorge Alberto Mendoza", grado: "2º de secundaria", edad: "12 años", seccion: "B", periodo: "2026 - I", promedio: "13.9", asistencia: "82%", conducta: "En proceso" },
                { id: "E-005", estudiante: "Sofía Isabel Campos", grado: "5º de secundaria", edad: "17 años", seccion: "A", periodo: "2026 - I", promedio: "16.7", asistencia: "94%", conducta: "Satisfactoria" },
                { id: "E-006", estudiante: "Luis Enrique Paredes", grado: "3º de secundaria", edad: "14 años", seccion: "A", periodo: "2026 - I", promedio: "14.6", asistencia: "90%", conducta: "En proceso" }
            ],
            campos: ["id", "estudiante", "grado", "edad", "seccion", "periodo", "promedio", "asistencia", "conducta"],
            columnas: ["ID", "Estudiante", "Grado", "Edad", "Sección", "Periodo", "Promedio", "Asistencia", "Conducta"]
        },
        asistencia: {
            vistas: {
                diaria: {
                    columnas: ["ID", "Docente", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Asistencia total"],
                    campos: ["id", "docente", "lunes", "martes", "miercoles", "jueves", "viernes", "porcentaje"]
                },
                semanal: {
                    columnas: ["ID", "Docente", "Semana 1", "Semana 2", "Semana 3", "Semana 4", "Asistencia total"],
                    campos: ["id", "docente", "semana1", "semana2", "semana3", "semana4", "total"]
                }
            },
            datosPorMes: {
                "Marzo": [
                    { id: "D-01", docente: "Prof. Rosa Mendoza", lunes: "Asistió", martes: "Asistió", miercoles: "Tardanza", jueves: "Asistió", viernes: "Asistió", semana1: 100, semana2: 80, semana3: 60, semana4: 100 },
                    { id: "D-02", docente: "Prof. Javier Ríos", lunes: "Asistió", martes: "Falta", miercoles: "Asistió", jueves: "Asistió", viernes: "Tardanza", semana1: 100, semana2: 80, semana3: 100, semana4: 100 },
                    { id: "D-03", docente: "Prof. Elena Torres", lunes: "Tardanza", martes: "Asistió", miercoles: "Asistió", jueves: "Falta", viernes: "Asistió", semana1: 60, semana2: 100, semana3: 80, semana4: 100 }
                ],
                "Abril": [
                    { id: "D-01", docente: "Prof. Rosa Mendoza", lunes: "Asistió", martes: "Asistió", miercoles: "Asistió", jueves: "Asistió", viernes: "Falta", semana1: 100, semana2: 100, semana3: 100, semana4: 80 },
                    { id: "D-02", docente: "Prof. Javier Ríos", lunes: "Tardanza", martes: "Asistió", miercoles: "Asistió", jueves: "Falta", viernes: "Asistió", semana1: 80, semana2: 100, semana3: 60, semana4: 100 },
                    { id: "D-03", docente: "Prof. Elena Torres", lunes: "Asistió", martes: "Asistió", miercoles: "Tardanza", jueves: "Asistió", viernes: "Asistió", semana1: 100, semana2: 80, semana3: 100, semana4: 80 }
                ],
                "Mayo": [
                    { id: "D-01", docente: "Prof. Rosa Mendoza", lunes: "Falta", martes: "Asistió", miercoles: "Asistió", jueves: "Tardanza", viernes: "Asistió", semana1: 80, semana2: 60, semana3: 100, semana4: 80 },
                    { id: "D-02", docente: "Prof. Javier Ríos", lunes: "Asistió", martes: "Asistió", miercoles: "Asistió", jueves: "Asistió", viernes: "Asistió", semana1: 100, semana2: 100, semana3: 100, semana4: 80 },
                    { id: "D-03", docente: "Prof. Elena Torres", lunes: "Asistió", martes: "Falta", miercoles: "Falta", jueves: "Asistió", viernes: "Tardanza", semana1: 60, semana2: 80, semana3: 100, semana4: 100 }
                ]
            }
        }
    };

    // Datos visibles actualmente en cada reporte (para la descarga).
    var datosActualesReporte = {
        matricula: { filas: [], columnas: [], campos: [] },
        consolidado: { filas: [], columnas: [], campos: [] },
        asistencia: { filas: [], columnas: [], campos: [] }
    };
    function actualizarDashboard() {
        var matriculas = configReportes.matricula.datos;
        var aforo = 30;
        var secciones = new Map();

        matriculas.forEach(function(registro) {
            var nombre = registro.grado + " · Sección " + registro.seccion;
            secciones.set(nombre, (secciones.get(nombre) || 0) + 1);
        });

        var cifras = [
            [matriculas.length, "Matrículas de ejemplo"],
            [secciones.size, "Grados y secciones con registros"],
            [aforo, "Aforo de referencia por sección"]
        ];
        var contenedorCifras = document.getElementById("resumen-dashboard-cifras");
        contenedorCifras.replaceChildren();
        cifras.forEach(function(cifra) {
            var tarjeta = document.createElement("div");
            tarjeta.className = "resumen-dashboard__cifra";
            var valor = document.createElement("strong");
            valor.textContent = cifra[0];
            var descripcion = document.createElement("span");
            descripcion.textContent = cifra[1];
            tarjeta.append(valor, descripcion);
            contenedorCifras.appendChild(tarjeta);
        });

        var contenedorSecciones = document.getElementById("resumen-dashboard-secciones");
        contenedorSecciones.replaceChildren();
        Array.from(secciones).sort(function(a, b) { return a[0].localeCompare(b[0], "es"); }).forEach(function(seccion) {
            var fila = document.createElement("div");
            fila.className = "resumen-dashboard__seccion";
            var etiqueta = document.createElement("span");
            etiqueta.textContent = seccion[0] + ": " + seccion[1] + " de " + aforo + " estudiantes";
            var barra = document.createElement("progress");
            barra.max = aforo;
            barra.value = seccion[1];
            barra.setAttribute("aria-label", etiqueta.textContent);
            fila.append(etiqueta, barra);
            contenedorSecciones.appendChild(fila);
        });
    }

    function normalizar(texto) {
        return String(texto)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    function datosAsistenciaMes() {
        var selectMes = document.getElementById("mes-asistencia");
        var mes = selectMes ? selectMes.value : "Marzo";
        return configReportes.asistencia.datosPorMes[mes] || [];
    }

    function filasAsistencia(tipo) {
        return datosAsistenciaMes().map(function(dato) {
            if (tipo === "diaria") {
                var camposDias = ["lunes", "martes", "miercoles", "jueves", "viernes"];
                var fila = Object.assign({}, dato);
                var asistidas = camposDias.filter(function(campo) {
                    return normalizar(dato[campo]) !== "falta";
                }).length;
                fila.porcentaje = Math.round((asistidas / camposDias.length) * 100) + "%";
                return fila;
            }

            var semanas = [dato.semana1, dato.semana2, dato.semana3, dato.semana4];
            var total = semanas.reduce(function(suma, valor) {
                return suma + valor;
            }, 0) / semanas.length;

            return {
                id: dato.id,
                docente: dato.docente,
                semana1: dato.semana1 + "%",
                semana2: dato.semana2 + "%",
                semana3: dato.semana3 + "%",
                semana4: dato.semana4 + "%",
                total: Math.round(total) + "%"
            };
        });
    }

    function renderizarAsistenciaActual() {
        var selectTipo = document.getElementById("tipo-asistencia");
        var tipo = selectTipo ? selectTipo.value : "diaria";
        renderizar("asistencia", filasAsistencia(tipo), configReportes.asistencia.vistas[tipo]);
    }

    function renderizar(clave, filas, vista) {
        var config = vista || configReportes[clave];
        var panel = document.getElementById("view-reporte-" + clave);
        var tabla = panel.querySelector(".tabla-registros");
        var cabecera = tabla.tHead;
        var cuerpo = tabla.tBodies[0];
        var error = panel.querySelector(".reporte-error");

        datosActualesReporte[clave] = { filas: filas, columnas: config.columnas, campos: config.campos };

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

        panel.querySelectorAll("input").forEach(function(entrada) {
            entrada.classList.toggle("is-invalid", sinRegistros);
        });

        if (sinRegistros) {
            error.classList.remove("oculto");
            error.classList.remove("animation-shake");
            void error.offsetWidth;
            error.classList.add("animation-shake");
        } else {
            error.classList.add("oculto");
            error.classList.remove("animation-shake");
        }
    }

    function abrirReporte(e) {
        if (e.type === "keydown" && e.key !== " " && e.key !== "Spacebar") {
            return;
        }
        e.preventDefault();
        irA("reporte-" + e.currentTarget.getAttribute("data-panel"));
    }

    reportButtons.forEach(function(boton) {
        boton.addEventListener("click", abrirReporte);
        boton.addEventListener("keydown", abrirReporte);
    });

    document.querySelectorAll(".busqueda-form").forEach(function(form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            var clave = form.getAttribute("data-busqueda");
            if (!clave || clave === "asistencia") {
                return;
            }

            var config = configReportes[clave];
            var panel = document.getElementById("view-reporte-" + clave);
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

    // --- ASISTENCIA DOCENTE: tipo y mes ---
    var selectTipoAsistencia = document.getElementById("tipo-asistencia");
    var selectMesAsistencia = document.getElementById("mes-asistencia");
    if (selectTipoAsistencia) {
        selectTipoAsistencia.addEventListener("change", function() {
            renderizarAsistenciaActual();
        });
    }
    if (selectMesAsistencia) {
        selectMesAsistencia.addEventListener("change", function() {
            renderizarAsistenciaActual();
        });
    }

    // --- REPORTES: descarga de datos ---
    function valorCSV(valor) {
        var texto = String(valor == null ? "" : valor);
        if (/[",\n\r]/.test(texto)) {
            return '"' + texto.replace(/"/g, '""') + '"';
        }
        return texto;
    }

    function descargarCSV(nombreArchivo, columnas, campos, filas) {
        var lineas = [];
        lineas.push(columnas.map(valorCSV).join(","));
        filas.forEach(function(fila) {
            lineas.push(campos.map(function(campo) {
                return valorCSV(fila[campo]);
            }).join(","));
        });
        var contenido = "\uFEFF" + lineas.join("\r\n");
        var blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
        var url = URL.createObjectURL(blob);
        var enlace = document.createElement("a");
        enlace.href = url;
        enlace.download = nombreArchivo;
        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);
        URL.revokeObjectURL(url);
    }

    document.querySelectorAll(".btn-descargar").forEach(function(boton) {
        boton.addEventListener("click", function() {
            var clave = boton.getAttribute("data-reporte");
            var actual = datosActualesReporte[clave];
            var panel = document.getElementById("view-reporte-" + clave);

            if (!actual || actual.columnas.length === 0) {
                var error = panel.querySelector(".reporte-error");
                error.textContent = "Seleccione Diario o Semanal antes de descargar los datos.";
                error.classList.remove("oculto");
                error.classList.remove("animation-shake");
                void error.offsetWidth;
                error.classList.add("animation-shake");
                return;
            }

            descargarCSV("reporte-" + clave + ".csv", actual.columnas, actual.campos, actual.filas);
        });
    });
});
