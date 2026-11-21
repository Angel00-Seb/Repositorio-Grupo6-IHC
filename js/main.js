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
            mostrarPantalla("inicio");
            actualizarBotonVolver();
            window.location.hash = mainSec.id;
            mainSec.scrollIntoView();
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
    var formularioAsistencia = document.getElementById("form-asistencia");
    var listaDocentes = document.getElementById("lista-docentes");
    var listaAsistencias = document.getElementById("lista-asistencias");
    var buscarDocente = document.getElementById("buscar-docente");
    var botonBuscarDocente = document.getElementById("buscar-docente-btn");
    var seleccionDocente = document.getElementById("docente-asistencia");
    var fechaAsistencia = document.getElementById("fecha-asistencia");
    var horaAsistencia = document.getElementById("hora-asistencia");
    var estadoAsistencia = document.getElementById("estado-asistencia");
    var mensajeDocente = document.getElementById("mensaje-docente");
    var mensajeAsistencia = document.getElementById("mensaje-asistencia");
    var mensajeBusquedaDocente = document.getElementById("mensaje-busqueda-docente");
    var docentes = [];
    var asistencias = [];
    var estadosAsistencia = [
        "Asistencia",
        "Tardanza",
        "Falta justificada",
        "Falta injustificada"
    ];

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

    function actualizarOpcionesDocentes() {
        var termino = normalizarBusquedaDocente(buscarDocente.value.trim());
        var dniSeleccionado = seleccionDocente.value;
        var docentesFiltrados = docentes.filter(function(docente) {
            var nombreCompleto = normalizarBusquedaDocente(docente.nombres + " " + docente.apellidos);
            return nombreCompleto.indexOf(termino) !== -1 || docente.dni.indexOf(termino) !== -1;
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

        seleccionDocente.value = dniSeleccionado;
        if (seleccionDocente.value !== dniSeleccionado) {
            seleccionDocente.value = "";
        }
    }

    function buscarDocentesRegistrados() {
        actualizarOpcionesDocentes();

        if (docentes.length === 0) {
            mostrarMensaje(mensajeBusquedaDocente, "Aún no hay docentes registrados para buscar.", "error");
            return;
        }

        var coincidencias = seleccionDocente.options.length - 1;
        if (coincidencias === 0) {
            mostrarMensaje(mensajeBusquedaDocente, "No se encontraron docentes. Revise el nombre, apellido o DNI.", "error");
            return;
        }

        limpiarMensaje(mensajeBusquedaDocente);
    }

    function fechaLocal(fecha) {
        var anio = fecha.getFullYear();
        var mes = ("0" + (fecha.getMonth() + 1)).slice(-2);
        var dia = ("0" + fecha.getDate()).slice(-2);
        return anio + "-" + mes + "-" + dia;
    }

    function horaLocal(fecha) {
        var horas = ("0" + fecha.getHours()).slice(-2);
        var minutos = ("0" + fecha.getMinutes()).slice(-2);
        return horas + ":" + minutos;
    }

    function establecerFechaHoraActual() {
        var ahora = new Date();
        fechaAsistencia.value = fechaLocal(ahora);
        horaAsistencia.value = horaLocal(ahora);
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
            celdaVacia.colSpan = 5;
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
                asistencia.estado
            ].forEach(function(valor) {
                var celda = document.createElement("td");
                celda.textContent = valor;
                fila.appendChild(celda);
            });
            listaAsistencias.appendChild(fila);
        }
    }

    function buscarDocentePorDni(dni) {
        for (var i = 0; i < docentes.length; i++) {
            if (docentes[i].dni === dni) {
                return docentes[i];
            }
        }
        return null;
    }

    formularioDocente.addEventListener("submit", function(event) {
        event.preventDefault();
        limpiarMensaje(mensajeDocente);

        var dni = document.getElementById("dni-docente").value.trim();
        var nombres = document.getElementById("nombre-docente").value.trim();
        var apellidos = document.getElementById("apellido-docente").value.trim();
        var especialidad = document.getElementById("especialidad-docente").value.trim();

        if (!dni || !nombres || !apellidos || !especialidad) {
            mostrarMensaje(mensajeDocente, "Complete todos los campos para registrar al docente.", "error");
            return;
        }
        if (!/^\d{8}$/.test(dni)) {
            mostrarMensaje(mensajeDocente, "El DNI debe tener exactamente 8 dígitos numéricos.", "error");
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
        actualizarOpcionesDocentes();
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

    formularioAsistencia.addEventListener("submit", function(event) {
        event.preventDefault();
        limpiarMensaje(mensajeAsistencia);

        var docente = buscarDocentePorDni(seleccionDocente.value);
        var fecha = fechaAsistencia.value;
        var hora = horaAsistencia.value;
        var estado = estadoAsistencia.value;

        if (!docente || !fecha || !hora || estadosAsistencia.indexOf(estado) === -1) {
            mostrarMensaje(mensajeAsistencia, "Seleccione un docente y complete la fecha, la hora y el estado.", "error");
            return;
        }

        asistencias.push({
            docente: docente.nombres + " " + docente.apellidos,
            dni: docente.dni,
            fecha: fecha,
            hora: hora,
            estado: estado
        });
        mostrarAsistencias();
        formularioAsistencia.reset();
        buscarDocente.value = "";
        actualizarOpcionesDocentes();
        establecerFechaHoraActual();
        mostrarMensaje(mensajeAsistencia, "Asistencia registrada correctamente.", "exito");
    });

    establecerFechaHoraActual();
    mostrarDocentes();
    actualizarOpcionesDocentes();
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
            document.querySelectorAll(".btn-tipo").forEach(function(boton) {
                boton.setAttribute("aria-pressed", "false");
            });
            document.getElementById("hint-asistencia").classList.remove("oculto");
            document.querySelector("#view-reporte-asistencia .tabla-registros").classList.add("oculto");
            document.querySelector("#view-reporte-asistencia .reporte-error").classList.add("oculto");
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

    // --- REPORTES: búsqueda y registros ---
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
        var panel = document.getElementById("view-reporte-" + clave);
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

    // --- ASISTENCIA DOCENTE: solo dos botones, Diario y Semanal ---
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
