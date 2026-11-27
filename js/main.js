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
    var usuarioActivo = {
        nombre: "Dir.a Iris Saavedra",
        rol: "Directora"
    };
    document.getElementById("nombre-usuario").textContent = usuarioActivo.nombre;
    document.getElementById("rol-usuario").textContent = usuarioActivo.rol;

    // --- MODO OSCURO ---
    var themeToggle = document.getElementById("theme-toggle");
    var iconMoon = themeToggle.querySelector(".icon-moon");
    var iconSun = themeToggle.querySelector(".icon-sun");

    function aplicarTema(oscuro) {
        document.documentElement.setAttribute("data-theme", oscuro ? "dark" : "light");
        themeToggle.setAttribute("aria-pressed", oscuro ? "true" : "false");
        var etiqueta = oscuro ? "Activar modo claro" : "Activar modo oscuro";
        themeToggle.setAttribute("aria-label", etiqueta);
        themeToggle.setAttribute("title", etiqueta);
        document.getElementById("theme-toggle-label").textContent = etiqueta;
        iconMoon.classList.toggle("oculto", oscuro);
        iconSun.classList.toggle("oculto", !oscuro);
    }

    aplicarTema(false);
    themeToggle.addEventListener("click", function() {
        var oscuro = document.documentElement.getAttribute("data-theme") === "dark";
        aplicarTema(!oscuro);
    });

    // --- PANEL DE ACCESIBILIDAD ---
    var accessibilityToggle = document.getElementById("accessibility-toggle");
    var accessibilityPanel = document.getElementById("accessibility-panel");
    var accessibilityZoom = document.getElementById("accessibility-zoom");
    var accessibilityVision = document.getElementById("accessibility-color-vision");
    var accessibilityContrast = document.getElementById("accessibility-contrast");
    var accessibilitySaturation = document.getElementById("accessibility-saturation");
    var accessibilityZoomValue = document.getElementById("accessibility-zoom-value");
    var accessibilityContrastValue = document.getElementById("accessibility-contrast-value");
    var accessibilitySaturationValue = document.getElementById("accessibility-saturation-value");
    var accessibilityColorFilters = {
        none: "none",
        protanopia: 'url("#filter-protanopia")',
        deuteranopia: 'url("#filter-deuteranopia")',
        tritanopia: 'url("#filter-tritanopia")'
    };

    function aplicarFiltrosAccesibilidad() {
        var filtros = [];
        var filtroColor = accessibilityColorFilters[accessibilityVision.value];
        var contraste = Number(accessibilityContrast.value) / 100;
        var saturacion = Number(accessibilitySaturation.value) / 100;

        if (filtroColor !== "none") {
            filtros.push(filtroColor);
        }
        if (contraste !== 1) {
            filtros.push("contrast(" + contraste + ")");
        }
        if (saturacion !== 1) {
            filtros.push("saturate(" + saturacion + ")");
        }

        document.documentElement.style.setProperty(
            "--accessibility-filter",
            filtros.length ? filtros.join(" ") : "none"
        );
    }

    function cerrarPanelAccesibilidad(devolverFoco) {
        accessibilityPanel.classList.add("oculto");
        accessibilityToggle.setAttribute("aria-expanded", "false");
        accessibilityToggle.setAttribute("aria-label", "Abrir opciones de accesibilidad");
        if (devolverFoco) {
            accessibilityToggle.focus();
        }
    }

    accessibilityToggle.addEventListener("click", function() {
        var abrir = accessibilityPanel.classList.contains("oculto");
        accessibilityPanel.classList.toggle("oculto", !abrir);
        accessibilityToggle.setAttribute("aria-expanded", abrir ? "true" : "false");
        accessibilityToggle.setAttribute("aria-label", abrir ? "Cerrar opciones de accesibilidad" : "Abrir opciones de accesibilidad");
        if (abrir) {
            accessibilityZoom.focus();
        }
    });

    document.getElementById("accessibility-close").addEventListener("click", function() {
        cerrarPanelAccesibilidad(true);
    });

    accessibilityPanel.addEventListener("keydown", function(evento) {
        if (evento.key === "Escape") {
            cerrarPanelAccesibilidad(true);
        }
    });

    accessibilityZoom.addEventListener("input", function() {
        var zoom = Number(accessibilityZoom.value);
        document.documentElement.style.setProperty("--accessibility-zoom", String(zoom / 100));
        accessibilityZoomValue.value = zoom + "%";
    });

    accessibilityVision.addEventListener("change", function() {
        aplicarFiltrosAccesibilidad();
    });

    accessibilityContrast.addEventListener("input", function() {
        var contraste = Number(accessibilityContrast.value);
        accessibilityContrastValue.value = contraste + "%";
        aplicarFiltrosAccesibilidad();
    });

    accessibilitySaturation.addEventListener("input", function() {
        var saturacion = Number(accessibilitySaturation.value);
        accessibilitySaturationValue.value = saturacion + "%";
        aplicarFiltrosAccesibilidad();
    });

    document.getElementById("accessibility-reset").addEventListener("click", function() {
        accessibilityZoom.value = "100";
        document.documentElement.style.setProperty("--accessibility-zoom", "1");
        accessibilityZoomValue.value = "100%";
        accessibilityVision.value = "none";
        accessibilityContrast.value = "100";
        accessibilityContrastValue.value = "100%";
        accessibilitySaturation.value = "100";
        accessibilitySaturationValue.value = "100%";
        aplicarFiltrosAccesibilidad();
        aplicarTema(false);
    });

    // --- LOGIN ---
    var loginForm = document.getElementById("login-form");
    var loginSec = document.getElementById("login-section");
    var mainSec = document.getElementById("main-section");
    var btnLogout = document.getElementById("btn-logout");
    var homeLogout = document.getElementById("home-logout");
    var loginError = document.getElementById("login-error");
    var loginAutocompletar = document.getElementById("login-autocompletar");
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
            mostrarPantalla("inicio");
            window.location.hash = mainSec.id;
            mainSec.scrollIntoView();
        } else {
            loginError.classList.remove("oculto");
        }
    });

    loginAutocompletar.addEventListener("click", function() {
        document.getElementById("usuario").value = "directora";
        document.getElementById("password").value = "demo2026";
        loginError.classList.add("oculto");
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
        mostrarPantalla("inicio");
        window.location.hash = "";
        loginSec.scrollIntoView();
    });

    // --- CARRUSEL ---
    // El carrusel de Inicio usa el mismo componente de Bootstrap que el login
    // (`.carousel slide carousel-fade` con data-bs-ride), por lo que no requiere
    // lógica propia: el bundle 5.3.8 se encarga del avance automático.

    // --- CONTROL DE ASISTENCIA DOCENTE ---
    var formularioDocente = document.getElementById("form-docente");
    var dniDocente = document.getElementById("dni-docente");
    var listaDocentes = document.getElementById("lista-docentes");
    var listaAsistencias = document.getElementById("lista-asistencias");
    var buscarDocente = document.getElementById("buscar-docente");
    var botonBuscarDocente = document.getElementById("buscar-docente-btn");
    var resultadosBusquedaDocente = document.getElementById("resultados-busqueda-docente");
    var seleccionDocente = document.getElementById("docente-asistencia");
    var docenteAsistenciaSeleccionado = document.getElementById("docente-asistencia-seleccionado");
    var fechaAsistencia = document.getElementById("fecha-asistencia");
    var horaAsistencia = document.getElementById("hora-asistencia");
    var periodoAsistencia = document.getElementById("periodo-asistencia");
    var horaSalida = document.getElementById("hora-salida");
    var periodoSalida = document.getElementById("periodo-salida");
    var estadoAsistencia = document.getElementById("estado-asistencia");
    var grupoJustificacion = document.getElementById("grupo-justificacion");
    var justificacionAsistencia = document.getElementById("justificacion-asistencia");
    var grupoArchivoJustificacion = document.getElementById("grupo-archivo-justificacion");
    var archivoJustificacion = document.getElementById("archivo-justificacion");
    var nombreArchivoJustificacion = document.getElementById("nombre-archivo-justificacion");
    var formularioAsistencia = document.getElementById("form-asistencia");
    var botonGuardarAsistencia = document.getElementById("guardar-asistencia-dialog");
    var dialogoAsistencia = document.getElementById("dialog-registrar-asistencia");
    var botonCancelarEdicionAsistencia = document.getElementById("cancelar-edicion-asistencia");
    var mensajeDocente = document.getElementById("mensaje-docente");
    var mensajeAsistencia = document.getElementById("mensaje-asistencia");
    var botonSeleccionarArchivo = document.getElementById("seleccionar-archivo-justificacion");
    var buscarDocenteHorario = document.getElementById("buscar-docente-horario");
    var botonBuscarDocenteHorario = document.getElementById("buscar-docente-horario-btn");
    var resultadosDocenteHorario = document.getElementById("resultados-docente-horario");
    var mensajeHorarioDocente = document.getElementById("mensaje-horario-docente");
    var contenedorTablaHorario = document.getElementById("tabla-horario-docente-contenedor");
    var tituloHorarioDocente = document.getElementById("titulo-horario-docente");
    var tablaHorarioDocente = document.getElementById("tabla-horario-docente");
    var nombreDocenteHorario = document.getElementById("horario-nombre-docente");
    var dniDocenteHorario = document.getElementById("horario-dni-docente");
    var especialidadDocenteHorario = document.getElementById("horario-especialidad-docente");
    var camposTextoDocente = [
        { elemento: document.getElementById("nombre-docente"), etiqueta: "Nombres" },
        { elemento: document.getElementById("apellido-docente"), etiqueta: "Apellidos" },
        { elemento: document.getElementById("especialidad-docente"), etiqueta: "Especialidad" }
    ];
    var patronTextoDocente = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/;
    var errorTextoDocenteVisible = false;
    var docentes = [];
    var asistencias = [];
    var indiceAsistenciaEnEdicion = null;
    var archivoOriginalEnEdicion = null;
    var urlArchivoOriginalEnEdicion = "";
    var diasHorario = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
    var nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    var horasHorario = [
        "07:30 – 08:30",
        "08:30 – 09:30",
        "09:30 – 10:30",
        "10:30 – 11:00",
        "11:00 – 12:00",
        "12:00 – 13:00"
    ];
    var bloqueReceso = "10:30 – 11:00";
    var coloresAula = {
        "1-A": "horario-celda--aula-1",
        "2-A": "horario-celda--aula-2",
        "2-B": "horario-celda--aula-3",
        "3-A": "horario-celda--aula-4",
        "4-A": "horario-celda--aula-5",
        "5-A": "horario-celda--aula-6"
    };
    var asignaturasHorario = [
        { asignatura: "Comunicación", docente: "Ana María Torres", dni: "70000001", area: "Comunicación" },
        { asignatura: "Matemática", docente: "Carlos Mendoza", dni: "70000002", area: "Matemática" },
        { asignatura: "Ciencia y Tecnología", docente: "Rosa Sánchez", dni: "70000003", area: "Ciencia y Tecnología" },
        { asignatura: "Ciencias Sociales", docente: "Luis Paredes", dni: "70000004", area: "Ciencias Sociales" },
        { asignatura: "Inglés", docente: "Marta Ríos", dni: "70000005", area: "Inglés" },
        { asignatura: "Educación Física", docente: "Jorge Salazar", dni: "70000006", area: "Educación Física" }
    ];
    var aulasHorario = [
        { grado: "1", seccion: "A", indice: 0 },
        { grado: "2", seccion: "A", indice: 1 },
        { grado: "2", seccion: "B", indice: 2 },
        { grado: "3", seccion: "A", indice: 3 },
        { grado: "4", seccion: "A", indice: 4 },
        { grado: "5", seccion: "A", indice: 5 }
    ];

    function mostrarMensaje(elemento, mensaje, tipo) {
        elemento.textContent = mensaje;
        elemento.className = "docentes-mensaje " + tipo;
    }

    function limpiarMensaje(elemento) {
        elemento.textContent = "";
        elemento.className = "docentes-mensaje oculto";
    }

    function validarTextoDocenteEnEntrada(event) {
        var campo = event.currentTarget;
        var campoConfig = camposTextoDocente.filter(function(config) {
            return config.elemento === campo;
        })[0];

        if (campo.value && !patronTextoDocente.test(campo.value)) {
            campo.setAttribute("aria-invalid", "true");
            errorTextoDocenteVisible = true;
            mostrarMensaje(
                mensajeDocente,
                campoConfig.etiqueta + " solo permite letras, tildes, ñ y espacios. Quite los números y otros caracteres.",
                "error"
            );
            return;
        }

        campo.removeAttribute("aria-invalid");
        var hayTextoInvalido = camposTextoDocente.some(function(config) {
            return config.elemento.value && !patronTextoDocente.test(config.elemento.value);
        });
        if (errorTextoDocenteVisible && !hayTextoInvalido) {
            errorTextoDocenteVisible = false;
            limpiarMensaje(mensajeDocente);
        }
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

    function obtenerHorarioAula(aula) {
        var registros = [];
        diasHorario.forEach(function(dia, indiceDia) {
            horasHorario.forEach(function(hora, indiceBloque) {
                if (hora === bloqueReceso) {
                    return;
                }
                var indiceAsignatura = (aula.indice + indiceDia + indiceBloque) % asignaturasHorario.length;
                var clase = asignaturasHorario[indiceAsignatura];
                var sinClase = (aula.indice + indiceDia * 2 + indiceBloque) % 6 === 5;
                if (sinClase) {
                    return;
                }
                registros.push({
                    dia: dia,
                    hora: hora,
                    grado: aula.grado,
                    seccion: aula.seccion,
                    asignatura: clase.asignatura,
                    docente: clase.docente,
                    dni: clase.dni,
                    area: clase.area
                });
            });
        });
        return registros;
    }

    function ocultarSugerenciasDocenteHorario() {
        resultadosDocenteHorario.textContent = "";
        resultadosDocenteHorario.classList.add("oculto");
        buscarDocenteHorario.setAttribute("aria-expanded", "false");
    }

    function restablecerPanelDocenteHorario() {
        nombreDocenteHorario.textContent = "Seleccione un docente";
        dniDocenteHorario.textContent = "—";
        especialidadDocenteHorario.textContent = "—";
    }

    function limpiarHorario() {
        tablaHorarioDocente.textContent = "";
        tituloHorarioDocente.textContent = "";
        contenedorTablaHorario.classList.add("oculto");
        restablecerPanelDocenteHorario();
    }

    function especialidadDelDocente(docenteHorario) {
        var registrado = buscarDocentePorDni(docenteHorario.dni);
        return registrado ? registrado.especialidad : docenteHorario.area;
    }

    function renderizarHorario(docenteHorario, clases) {
        tablaHorarioDocente.textContent = "";
        tituloHorarioDocente.textContent = "Horario semanal de " + docenteHorario.docente;
        nombreDocenteHorario.textContent = docenteHorario.docente;
        dniDocenteHorario.textContent = docenteHorario.dni;
        especialidadDocenteHorario.textContent = especialidadDelDocente(docenteHorario);

        horasHorario.forEach(function(bloque) {
            var fila = document.createElement("tr");
            if (bloque === bloqueReceso) {
                fila.classList.add("horario-fila-receso");
            }
            var celdaBloque = document.createElement("th");
            celdaBloque.scope = "row";
            celdaBloque.textContent = bloque === bloqueReceso ? bloque + " · Receso" : bloque;
            fila.appendChild(celdaBloque);

            diasHorario.forEach(function(dia) {
                var celda = document.createElement("td");
                var clasesCelda = clases.filter(function(clase) {
                    return clase.dia === dia && clase.hora === bloque;
                });

                if (clasesCelda.length === 0) {
                    celda.textContent = "—";
                    celda.classList.add("horario-celda-vacia");
                } else {
                    clasesCelda.forEach(function(clase) {
                        var etiquetaClase = clase.grado + "° " + clase.seccion;
                        var chip = document.createElement("span");
                        chip.className = "horario-celda " + (coloresAula[clase.grado + "-" + clase.seccion] || "");
                        chip.textContent = etiquetaClase;
                        chip.title = clase.asignatura + " — " + dia + " " + bloque;
                        chip.setAttribute("aria-label", etiquetaClase + ", " + clase.asignatura + ", " + dia + " " + bloque);
                        celda.appendChild(chip);
                    });
                }
                fila.appendChild(celda);
            });
            tablaHorarioDocente.appendChild(fila);
        });

        mensajeHorarioDocente.textContent = "";
        contenedorTablaHorario.classList.remove("oculto");
    }

    function mostrarSugerenciasDocenteHorario() {
        var termino = normalizar(buscarDocenteHorario.value.trim());
        resultadosDocenteHorario.textContent = "";

        if (!termino) {
            ocultarSugerenciasDocenteHorario();
            return;
        }

        var coincidencias = asignaturasHorario.filter(function(clase) {
            return normalizar(clase.docente).indexOf(termino) !== -1;
        });

        resultadosDocenteHorario.classList.remove("oculto");
        buscarDocenteHorario.setAttribute("aria-expanded", "true");

        if (coincidencias.length === 0) {
            var sinResultados = document.createElement("li");
            sinResultados.className = "docentes-busqueda__sin-resultados";
            sinResultados.textContent = "No se encontraron docentes";
            resultadosDocenteHorario.appendChild(sinResultados);
            return;
        }

        coincidencias.forEach(function(docenteHorario) {
            var resultado = document.createElement("li");
            resultado.setAttribute("role", "option");
            var boton = document.createElement("button");
            boton.type = "button";
            boton.className = "docentes-busqueda__resultado";
            boton.setAttribute("aria-label", docenteHorario.docente + ", DNI " + docenteHorario.dni + ", " + docenteHorario.area);

            var nombre = document.createElement("span");
            nombre.textContent = docenteHorario.docente;
            var detalle = document.createElement("small");
            detalle.textContent = "DNI: " + docenteHorario.dni + " — " + docenteHorario.area;
            boton.appendChild(nombre);
            boton.appendChild(detalle);
            resultado.appendChild(boton);
            resultadosDocenteHorario.appendChild(resultado);

            boton.addEventListener("click", function() {
                buscarDocenteHorario.value = docenteHorario.docente;
                ocultarSugerenciasDocenteHorario();
                consultarHorarioPorDocente(docenteHorario);
            });
        });
    }

    function consultarHorarioPorDocente(docenteSeleccionado) {
        limpiarHorario();
        ocultarSugerenciasDocenteHorario();

        var termino = normalizar(buscarDocenteHorario.value.trim());
        var docenteHorario = docenteSeleccionado || null;

        if (!docenteHorario && termino) {
            docenteHorario = asignaturasHorario.filter(function(clase) {
                return normalizar(clase.docente).indexOf(termino) !== -1;
            })[0];
        }

        if (!docenteHorario) {
            mensajeHorarioDocente.textContent = termino
                ? "No se encontró un horario para un docente con ese nombre."
                : "Escriba el nombre del docente o elija una coincidencia.";
            return;
        }

        var clases = [];
        aulasHorario.forEach(function(aula) {
            obtenerHorarioAula(aula).forEach(function(clase) {
                if (clase.docente === docenteHorario.docente) {
                    clases.push(clase);
                }
            });
        });

        if (clases.length === 0) {
            mensajeHorarioDocente.textContent = "El docente no tiene clases asignadas en el horario semanal.";
            return;
        }

        renderizarHorario(docenteHorario, clases);
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
        var termino = normalizar(buscarDocente.value.trim());
        resultadosBusquedaDocente.textContent = "";
        seleccionDocente.value = "";
        docenteAsistenciaSeleccionado.textContent = "No hay docente seleccionado";
        if (!termino) {
            resultadosBusquedaDocente.classList.add("oculto");
            return;
        }

        var docentesFiltrados = docentes.filter(function(docente) {
            var nombres = normalizar(docente.nombres);
            var apellidos = normalizar(docente.apellidos);
            var nombreCompleto = nombres + " " + apellidos;
            return nombreCompleto.indexOf(termino) !== -1 ||
                nombres.indexOf(termino) !== -1 ||
                apellidos.indexOf(termino) !== -1 ||
                docente.dni.indexOf(termino) !== -1;
        });

        resultadosBusquedaDocente.classList.remove("oculto");
        if (docentesFiltrados.length === 0) {
            var sinResultados = document.createElement("li");
            sinResultados.className = "docentes-busqueda__sin-resultados";
            sinResultados.textContent = "No se encontraron docentes";
            resultadosBusquedaDocente.appendChild(sinResultados);
            return;
        }

        docentesFiltrados.forEach(function(docente) {
            var resultado = document.createElement("li");
            var botonResultado = document.createElement("button");
            var nombreCompleto = docente.nombres + " " + docente.apellidos;
            botonResultado.type = "button";
            botonResultado.className = "docentes-busqueda__resultado";
            botonResultado.setAttribute("aria-label", nombreCompleto + ", DNI " + docente.dni + ", " + docente.especialidad);

            var nombre = document.createElement("span");
            nombre.textContent = nombreCompleto;
            var detalleDni = document.createElement("small");
            detalleDni.textContent = "DNI: " + docente.dni;
            var detalleArea = document.createElement("small");
            detalleArea.textContent = "Área o especialidad: " + docente.especialidad;
            botonResultado.appendChild(nombre);
            botonResultado.appendChild(detalleDni);
            botonResultado.appendChild(detalleArea);
            resultado.appendChild(botonResultado);
            resultadosBusquedaDocente.appendChild(resultado);

            botonResultado.addEventListener("click", function() {
                seleccionDocente.value = docente.dni;
                docenteAsistenciaSeleccionado.textContent = nombreCompleto + " — DNI " + docente.dni + " — " + docente.especialidad;
                resultadosBusquedaDocente.classList.add("oculto");
            });
        });
    }

    function fechaLocal(fecha) {
        var anio = fecha.getFullYear();
        var mes = ("0" + (fecha.getMonth() + 1)).slice(-2);
        var dia = ("0" + fecha.getDate()).slice(-2);
        return anio + "-" + mes + "-" + dia;
    }

    function establecerFechaHoraPredeterminada() {
        var ahora = new Date();
        fechaAsistencia.value = fechaLocal(ahora);
        horaAsistencia.value = "07:00";
        periodoAsistencia.value = "AM";
    }

    function convertirHoraEnMinutos(hora, periodo) {
        var partes = /^(\d{1,2}):([0-5]\d)$/.exec(hora);
        if (!partes) {
            return null;
        }
        var horas = Number(partes[1]);
        var minutos = Number(partes[2]);
        if (horas < 1 || horas > 12) {
            return null;
        }
        return (horas % 12 + (periodo === "PM" ? 12 : 0)) * 60 + minutos;
    }

    function formatearHora(hora, periodo) {
        var partes = hora.split(":");
        var horas = ("0" + partes[0]).slice(-2);
        return horas + ":" + partes[1] + (periodo === "PM" ? " p. m." : " a. m.");
    }

    function formatearFecha(fecha) {
        var partes = fecha.split("-");
        return partes.length === 3 ? partes[2] + "/" + partes[1] + "/" + partes[0] : fecha;
    }

    function sembrarDatosDemoDocentes() {
        var hoy = new Date();
        var ultimoDiaDelMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
        var lunes = new Date(ultimoDiaDelMes.getFullYear(), ultimoDiaDelMes.getMonth(), ultimoDiaDelMes.getDate());
        while (lunes.getDay() !== 1 || lunes.getDate() + 4 > ultimoDiaDelMes.getDate()) {
            lunes.setDate(lunes.getDate() - 1);
        }
        var fechas = [];
        for (var indiceDia = 0; indiceDia < 5; indiceDia++) {
            fechas.push(fechaLocal(new Date(lunes.getFullYear(), lunes.getMonth(), lunes.getDate() + indiceDia)));
        }

        var docentesDemo = [
            { dni: "70000001", nombres: "Ana María", apellidos: "Torres", especialidad: "Comunicación" },
            { dni: "70000002", nombres: "Carlos", apellidos: "Mendoza", especialidad: "Matemática" },
            { dni: "70000003", nombres: "Rosa", apellidos: "Sánchez", especialidad: "Ciencia y Tecnología" },
            { dni: "70000004", nombres: "Luis", apellidos: "Paredes", especialidad: "Ciencias Sociales" }
        ];
        var estadosDemo = [
            ["Asistencia", "Tardanza", "Asistencia", "Asistencia", "Asistencia"],
            ["Asistencia", "Falta justificada", "Asistencia", "Tardanza", "Asistencia"],
            ["Tardanza", "Asistencia", "Falta injustificada", "Asistencia", "Asistencia"],
            ["Asistencia", "Asistencia", "Asistencia", "Falta justificada", "Asistencia"]
        ];

        docentesDemo.forEach(function(docente, indiceDocente) {
            docentes.push(Object.assign({}, docente));
            estadosDemo[indiceDocente].forEach(function(estado, indiceDia) {
                asistencias.push({
                    docente: docente.nombres + " " + docente.apellidos,
                    dni: docente.dni,
                    fecha: fechas[indiceDia],
                    horaIngreso: "07:00",
                    periodoIngreso: "AM",
                    horaSalida: "03:00",
                    periodoSalida: "PM",
                    estado: estado,
                    justificacion: estado === "Falta justificada" ? "Motivo de demostración" : "",
                    archivo: null,
                    archivoNombre: "",
                    archivoUrl: ""
                });
            });
        });
    }

    function mostrarAsistencias() {
        listaAsistencias.textContent = "";

        if (asistencias.length === 0) {
            var filaVacia = document.createElement("tr");
            var celdaVacia = document.createElement("td");
            celdaVacia.colSpan = 8;
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
                formatearHora(asistencia.horaIngreso, asistencia.periodoIngreso),
                asistencia.horaSalida
                    ? formatearHora(asistencia.horaSalida, asistencia.periodoSalida)
                    : "—",
                asistencia.estado
            ].forEach(function(valor) {
                var celda = document.createElement("td");
                celda.textContent = valor;
                fila.appendChild(celda);
            });

            var celdaJustificacion = document.createElement("td");
            var motivo = document.createElement("div");
            motivo.textContent = asistencia.justificacion || "—";
            var adjunto = document.createElement("div");
            adjunto.textContent = "Archivo: ";
            if (asistencia.archivoNombre) {
                var enlaceArchivo = document.createElement("a");
                enlaceArchivo.href = asistencia.archivoUrl;
                enlaceArchivo.target = "_blank";
                enlaceArchivo.rel = "noopener";
                enlaceArchivo.textContent = asistencia.archivoNombre;
                adjunto.appendChild(enlaceArchivo);
            } else {
                adjunto.appendChild(document.createTextNode("—"));
            }
            celdaJustificacion.appendChild(motivo);
            celdaJustificacion.appendChild(adjunto);
            fila.appendChild(celdaJustificacion);

            var celdaAcciones = document.createElement("td");
            var botonEditar = document.createElement("button");
            botonEditar.type = "button";
            botonEditar.className = "docentes-editar";
            botonEditar.setAttribute("aria-label", "Editar asistencia de " + asistencia.docente);
            botonEditar.textContent = "✎ Editar";
            (function(indice) {
                botonEditar.addEventListener("click", function() {
                    iniciarEdicionAsistencia(indice);
                });
            })(i);
            celdaAcciones.appendChild(botonEditar);
            fila.appendChild(celdaAcciones);
            listaAsistencias.appendChild(fila);
        }
    }

    function actualizarCampoJustificacion() {
        var requiereJustificacion = estadoAsistencia.value === "Falta justificada";
        grupoJustificacion.classList.toggle("oculto", !requiereJustificacion);
        grupoArchivoJustificacion.classList.toggle("oculto", !requiereJustificacion);
        justificacionAsistencia.required = requiereJustificacion;
        horaSalida.required = estadoAsistencia.value === "Asistencia" || estadoAsistencia.value === "Tardanza";
        if (!requiereJustificacion) {
            justificacionAsistencia.value = "";
            archivoJustificacion.value = "";
            nombreArchivoJustificacion.textContent = "";
        } else if (indiceAsistenciaEnEdicion !== null && archivoOriginalEnEdicion) {
            nombreArchivoJustificacion.textContent = "Archivo actual: " + archivoOriginalEnEdicion.name;
        }
    }

    function restablecerFormularioAsistencia() {
        indiceAsistenciaEnEdicion = null;
        archivoOriginalEnEdicion = null;
        urlArchivoOriginalEnEdicion = "";
        formularioAsistencia.reset();
        buscarDocente.disabled = false;
        botonBuscarDocente.disabled = false;
        fechaAsistencia.disabled = false;
        botonGuardarAsistencia.textContent = "Registrar asistencia";
        botonCancelarEdicionAsistencia.classList.add("oculto");
        establecerFechaHoraPredeterminada();
        actualizarCampoJustificacion();
        buscarDocente.value = "";
        seleccionDocente.value = "";
        docenteAsistenciaSeleccionado.textContent = "No hay docente seleccionado";
        resultadosBusquedaDocente.textContent = "";
        resultadosBusquedaDocente.classList.add("oculto");
    }

    function iniciarEdicionAsistencia(indice) {
        var asistencia = asistencias[indice];
        if (!asistencia) {
            return;
        }

        indiceAsistenciaEnEdicion = indice;
        archivoOriginalEnEdicion = asistencia.archivo || null;
        urlArchivoOriginalEnEdicion = asistencia.archivoUrl || "";
        formularioAsistencia.reset();
        buscarDocente.disabled = true;
        botonBuscarDocente.disabled = true;
        fechaAsistencia.disabled = true;
        seleccionDocente.value = asistencia.dni;
        docenteAsistenciaSeleccionado.textContent =
            asistencia.docente + " — DNI " + asistencia.dni;
        fechaAsistencia.value = asistencia.fecha;
        horaAsistencia.value = asistencia.horaIngreso;
        periodoAsistencia.value = asistencia.periodoIngreso;
        horaSalida.value = asistencia.horaSalida;
        periodoSalida.value = asistencia.periodoSalida || "AM";
        estadoAsistencia.value = asistencia.estado;
        actualizarCampoJustificacion();
        justificacionAsistencia.value = asistencia.justificacion || "";
        nombreArchivoJustificacion.textContent = archivoOriginalEnEdicion
            ? "Archivo actual: " + archivoOriginalEnEdicion.name
            : "";
        botonGuardarAsistencia.textContent = "Guardar cambios";
        botonCancelarEdicionAsistencia.classList.remove("oculto");
        limpiarMensaje(mensajeAsistencia);
        abrirDialogo(dialogoAsistencia);
    }

    function registrarAsistencia(event) {
        event.preventDefault();
        limpiarMensaje(mensajeAsistencia);

        var docente = buscarDocentePorDni(seleccionDocente.value);
        var fecha = fechaAsistencia.value;
        var ingreso = horaAsistencia.value;
        var periodoIngreso = periodoAsistencia.value;
        var salida = horaSalida.value;
        var periodoSalidaSeleccionado = periodoSalida.value;
        var estado = estadoAsistencia.value;
        var justificacion = justificacionAsistencia.value.trim();
        var ingresoMinutos = convertirHoraEnMinutos(ingreso, periodoIngreso);
        var salidaMinutos = salida ? convertirHoraEnMinutos(salida, periodoSalidaSeleccionado) : null;

        if (!docente || !fecha || !ingreso || !estado) {
            mostrarMensaje(mensajeAsistencia, "Seleccione un docente y complete la fecha, la hora de ingreso y el estado.", "error");
            return;
        }
        if (ingresoMinutos === null) {
            mostrarMensaje(mensajeAsistencia, "Ingrese una hora de ingreso válida entre 01:00 y 12:59 y seleccione a. m. o p. m.", "error");
            return;
        }
        if ((estado === "Asistencia" || estado === "Tardanza") && !salida) {
            mostrarMensaje(mensajeAsistencia, "Ingrese la hora de salida para registrar la asistencia.", "error");
            return;
        }
        if (salida && salidaMinutos === null) {
            mostrarMensaje(mensajeAsistencia, "Ingrese una hora de salida válida entre 01:00 y 12:59 y seleccione a. m. o p. m.", "error");
            return;
        }
        if (salida && salidaMinutos < ingresoMinutos) {
            mostrarMensaje(mensajeAsistencia, "La hora de salida no puede ser anterior a la hora de ingreso.", "error");
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

        var registroAnterior = indiceAsistenciaEnEdicion !== null
            ? asistencias[indiceAsistenciaEnEdicion]
            : null;
        var archivoNuevo = archivoJustificacion.files[0] || null;
        var archivoSeleccionado = estado === "Falta justificada"
            ? archivoNuevo || (registroAnterior ? archivoOriginalEnEdicion : null)
            : null;
        var urlArchivo = "";
        if (archivoSeleccionado) {
            urlArchivo = archivoSeleccionado === archivoOriginalEnEdicion
                ? urlArchivoOriginalEnEdicion
                : URL.createObjectURL(archivoSeleccionado);
        }

        var registro = {
            docente: registroAnterior ? registroAnterior.docente : docente.nombres + " " + docente.apellidos,
            dni: registroAnterior ? registroAnterior.dni : docente.dni,
            fecha: registroAnterior ? registroAnterior.fecha : fecha,
            horaIngreso: ingreso,
            periodoIngreso: periodoIngreso,
            horaSalida: salida,
            periodoSalida: periodoSalidaSeleccionado,
            estado: estado,
            justificacion: estado === "Falta justificada" ? justificacion : "",
            archivo: archivoSeleccionado,
            archivoNombre: archivoSeleccionado ? archivoSeleccionado.name : "",
            archivoUrl: urlArchivo
        };
        if (registroAnterior) {
            asistencias[indiceAsistenciaEnEdicion] = registro;
            if (registroAnterior.archivoUrl && registroAnterior.archivoUrl !== urlArchivo) {
                URL.revokeObjectURL(registroAnterior.archivoUrl);
            }
        } else {
            asistencias.push(registro);
        }

        mostrarAsistencias();
        actualizarDashboardReportes();
        var estabaEditando = registroAnterior !== null;
        restablecerFormularioAsistencia();
        mostrarMensaje(
            mensajeAsistencia,
            estabaEditando ? "Los cambios se guardaron correctamente." : "Asistencia registrada correctamente.",
            "exito"
        );
    }

    dniDocente.addEventListener("input", function() {
        dniDocente.value = dniDocente.value.replace(/\D/g, "").slice(0, 8);
    });

    archivoJustificacion.addEventListener("change", function() {
        var archivo = archivoJustificacion.files[0];
        nombreArchivoJustificacion.textContent = archivo ? "Archivo seleccionado: " + archivo.name : "";
    });

    botonSeleccionarArchivo.addEventListener("click", function() {
        archivoJustificacion.click();
    });

    camposTextoDocente.forEach(function(config) {
        config.elemento.addEventListener("input", validarTextoDocenteEnEntrada);
    });

    formularioDocente.addEventListener("submit", function(event) {
        event.preventDefault();
        limpiarMensaje(mensajeDocente);

        var dni = dniDocente.value.trim();
        var nombres = camposTextoDocente[0].elemento.value.trim();
        var apellidos = camposTextoDocente[1].elemento.value.trim();
        var especialidad = camposTextoDocente[2].elemento.value.trim();

        if (!/^\d{8}$/.test(dni)) {
            mostrarMensaje(mensajeDocente, "El DNI debe tener exactamente 8 dígitos numéricos. Complete los 8 dígitos.", "error");
            return;
        }
        if (!nombres || !apellidos || !especialidad) {
            mostrarMensaje(mensajeDocente, "Complete los nombres, apellidos y especialidad para registrar al docente.", "error");
            return;
        }
        if (!patronTextoDocente.test(nombres)) {
            camposTextoDocente[0].elemento.setAttribute("aria-invalid", "true");
            mostrarMensaje(mensajeDocente, "Nombres solo permite letras, tildes, ñ y espacios; no incluya números ni otros caracteres.", "error");
            return;
        }
        if (!patronTextoDocente.test(apellidos)) {
            camposTextoDocente[1].elemento.setAttribute("aria-invalid", "true");
            mostrarMensaje(mensajeDocente, "Apellidos solo permite letras, tildes, ñ y espacios; no incluya números ni otros caracteres.", "error");
            return;
        }
        if (!patronTextoDocente.test(especialidad)) {
            camposTextoDocente[2].elemento.setAttribute("aria-invalid", "true");
            mostrarMensaje(mensajeDocente, "Especialidad solo permite letras, tildes, ñ y espacios; no incluya números ni otros caracteres.", "error");
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
        camposTextoDocente.forEach(function(config) {
            config.elemento.removeAttribute("aria-invalid");
        });
        errorTextoDocenteVisible = false;
        buscarDocente.value = "";
        seleccionDocente.value = "";
        docenteAsistenciaSeleccionado.textContent = "No hay docente seleccionado";
        resultadosBusquedaDocente.textContent = "";
        resultadosBusquedaDocente.classList.add("oculto");
        mostrarMensaje(mensajeDocente, "Docente registrado correctamente.", "exito");
    });

    botonBuscarDocente.addEventListener("click", buscarDocentesRegistrados);
    buscarDocente.addEventListener("input", function() {
        resultadosBusquedaDocente.textContent = "";
        resultadosBusquedaDocente.classList.add("oculto");
        seleccionDocente.value = "";
        docenteAsistenciaSeleccionado.textContent = "No hay docente seleccionado";
    });
    buscarDocente.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
        }
    });
    estadoAsistencia.addEventListener("change", actualizarCampoJustificacion);
    botonCancelarEdicionAsistencia.addEventListener("click", function() {
        restablecerFormularioAsistencia();
        mostrarMensaje(mensajeAsistencia, "Edición cancelada.", "exito");
    });
    botonBuscarDocenteHorario.addEventListener("click", function() {
        consultarHorarioPorDocente();
    });
    document.querySelectorAll(".docentes-tabs-contenedor").forEach(function(contenedor) {
        var pestañasRegistro = contenedor.querySelectorAll(".docentes-tabs .docentes-tab");
        var panelesRegistro = contenedor.querySelectorAll(".docentes-tab-panel");
        pestañasRegistro.forEach(function(pestaña) {
            pestaña.addEventListener("click", function() {
                var nombrePanel = pestaña.getAttribute("data-tab");
                pestañasRegistro.forEach(function(otra) {
                    var activa = otra === pestaña;
                    otra.classList.toggle("activo", activa);
                    otra.setAttribute("aria-selected", activa ? "true" : "false");
                });
                panelesRegistro.forEach(function(panel) {
                    if (panel.getAttribute("data-panel") === nombrePanel) {
                        panel.classList.remove("oculto", "show");
                        void panel.offsetWidth;
                        panel.classList.add("show");
                    } else {
                        panel.classList.add("oculto");
                        panel.classList.remove("show");
                    }
                });
            });
        });
    });
    buscarDocenteHorario.addEventListener("input", function() {
        limpiarHorario();
        mensajeHorarioDocente.textContent = "Escriba el nombre del docente o elija una coincidencia para ver su horario semanal.";
        mostrarSugerenciasDocenteHorario();
    });
    buscarDocenteHorario.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            var primeraCoincidencia = resultadosDocenteHorario.querySelector(".docentes-busqueda__resultado");
            if (primeraCoincidencia && !resultadosDocenteHorario.classList.contains("oculto")) {
                primeraCoincidencia.click();
            } else {
                consultarHorarioPorDocente();
            }
        }
    });
    document.addEventListener("click", function(event) {
        if (!event.target.closest(".horario-docente-busqueda__campo")) {
            ocultarSugerenciasDocenteHorario();
        }
    });
    formularioAsistencia.addEventListener("submit", registrarAsistencia);

    // --- DIÁLOGOS NATIVOS (Bootstrap 5.3.8 aún no incluye el plugin de <dialog>) ---
    function abrirDialogo(dialogo) {
        if (dialogo && !dialogo.open && typeof dialogo.showModal === "function") {
            dialogo.showModal();
        }
    }

    function cerrarDialogo(dialogo) {
        if (dialogo && dialogo.open && typeof dialogo.close === "function") {
            dialogo.close();
        }
    }

    document.querySelectorAll('[data-bs-toggle="dialog"]').forEach(function(boton) {
        boton.addEventListener("click", function() {
            var dialogo = document.querySelector(boton.getAttribute("data-bs-target"));
            if (dialogo === dialogoAsistencia) {
                restablecerFormularioAsistencia();
            }
            if (dialogo && dialogo.id === "dialog-registrar-estudiante") {
                limpiarEdicionEstudiante();
                ocultarAlertaMatricula(alertaEstudiante);
            }
            if (dialogo && dialogo.id === "dialog-registrar-apoderado") {
                limpiarEdicionApoderado();
                ocultarAlertaMatricula(alertaApoderado);
            }
            if (dialogo && dialogo.id === "dialog-registrar-asociacion") {
                limpiarEdicionAsociacion();
                ocultarAlertaMatricula(alertaAsociacion);
            }
            abrirDialogo(dialogo);
        });
    });

    document.querySelectorAll('[data-bs-dismiss="dialog"]').forEach(function(boton) {
        boton.addEventListener("click", function() {
            cerrarDialogo(boton.closest("dialog"));
        });
    });

    document.querySelectorAll("dialog").forEach(function(dialogo) {
        dialogo.addEventListener("click", function(event) {
            if (event.target === dialogo) {
                cerrarDialogo(dialogo);
            }
        });
    });

    document.getElementById("guardar-docente-dialog").addEventListener("click", function() {
        document.getElementById("form-docente").requestSubmit();
    });

    botonGuardarAsistencia.addEventListener("click", function() {
        formularioAsistencia.requestSubmit();
    });

    sembrarDatosDemoDocentes();
    mostrarDocentes();
    establecerFechaHoraPredeterminada();
    actualizarCampoJustificacion();
    mostrarAsistencias();
    actualizarOpcionesMesesAsistencia();


    // --- BARRA LATERAL ---
    var sidebar = document.getElementById("sidebar");
    var sidebarToggle = document.getElementById("sidebar-toggle");

    sidebarToggle.addEventListener("click", function() {
        var collapsed = sidebar.classList.toggle("is-collapsed");
        sidebarToggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
        sidebarToggle.setAttribute("aria-label", collapsed ? "Expandir menú" : "Contraer menú");
    });

    // --- NAVEGACIÓN ENTRE VISTAS ---
    var navItems = document.querySelectorAll(".nav-item[data-vista]");
    var vistas = document.querySelectorAll(".view");

    // Única fuente de iconos: barra lateral, cabecera y tarjetas de «Módulos del sistema».
    var ICONOS_MODULO = {
        inicio: "bi-house-door",
        matricula: "bi-people",
        docentes: "bi-mortarboard",
        reportes: "bi-bar-chart"
    };

    function sincronizarIconosModulo() {
        navItems.forEach(function(nav) {
            var icono = nav.querySelector(".bi-icono");
            var clase = ICONOS_MODULO[nav.getAttribute("data-vista")];
            if (icono && clase) {
                icono.className = "bi " + clase + " bi-icono";
            }
        });

        document.querySelectorAll(".report-card--modulo[data-home-vista]").forEach(function(tarjeta) {
            var icono = tarjeta.querySelector(".report-card__icon");
            var clase = ICONOS_MODULO[tarjeta.getAttribute("data-home-vista")];
            if (icono && clase) {
                icono.className = "bi " + clase + " report-card__icon";
            }
        });
    }

    sincronizarIconosModulo();

    // Solo las tarjetas de reportes (con data-panel) abren un detalle. Las
    // tarjetas de «Módulos del sistema» también usan .report-card/.btn-solid
    // pero navegan con data-home-vista y no deben caer en este listener.
    var reportCards = document.querySelectorAll(".report-card[data-panel]");
    var reportButtons = document.querySelectorAll(".report-card[data-panel] .btn-solid");
    var detalles = document.querySelectorAll(".reporte-detalle");

    function pantallaActual() {
        var vistaVisible = document.querySelector(".view:not(.oculto)");
        return vistaVisible ? vistaVisible.id.replace("view-", "") : "matricula";
    }

    function mostrarPantalla(pantalla) {
        var esReporte = pantalla.indexOf("reporte-") === 0;
        var clave = esReporte ? pantalla.replace("reporte-", "") : "";
        var vistaBase = esReporte ? "reportes" : pantalla;

        document.querySelectorAll("dialog[open]").forEach(function(dialogo) {
            cerrarDialogo(dialogo);
        });

        var headerLogo = document.getElementById("header-logo");
        var headerModulo = document.getElementById("header-modulo");
        var headerModuloIcono = document.getElementById("header-modulo-icono");
        var headerModuloTitulo = document.getElementById("header-modulo-titulo");
        var headerModuloSubtitulo = document.getElementById("header-modulo-subtitulo");
        var titulosModulo = {
            matricula: {
                icono: '<i class="bi ' + ICONOS_MODULO.matricula + ' bi-icono" aria-hidden="true"></i>',
                titulo: "Módulo de Matrícula",
                subtitulo: "Registrar estudiantes, consultar matrículas y gestionar información."
            },
            docentes: {
                icono: '<i class="bi ' + ICONOS_MODULO.docentes + ' bi-icono" aria-hidden="true"></i>',
                titulo: "Módulo de Docentes",
                subtitulo: "Registrar docentes, controlar asistencia y consultar horarios."
            },
            reportes: {
                icono: '<i class="bi ' + ICONOS_MODULO.reportes + ' bi-icono" aria-hidden="true"></i>',
                titulo: "Módulo de Reportes",
                subtitulo: "Consultar reportes de matrícula, consolidado de estudiantes y asistencia docente."
            }
        };
        var infoModulo = titulosModulo[vistaBase];
        if (headerLogo && headerModulo && headerModuloIcono && headerModuloTitulo && headerModuloSubtitulo) {
            if (infoModulo) {
                headerLogo.classList.add("oculto");
                headerModulo.classList.remove("oculto");
                headerModuloIcono.innerHTML = infoModulo.icono;
                headerModuloTitulo.textContent = infoModulo.titulo;
                headerModuloSubtitulo.textContent = infoModulo.subtitulo;
            } else {
                headerLogo.classList.remove("oculto");
                headerModulo.classList.add("oculto");
                headerModuloIcono.innerHTML = "";
                headerModuloTitulo.textContent = "";
                headerModuloSubtitulo.textContent = "";
            }
        }

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

        // Al cambiar de vista se vuelve al inicio del contenido para no caer
        // en un área en blanco cuando se venía desplazado por el dashboard.
        var contentBody = document.querySelector(".content-body");
        if (contentBody) {
            contentBody.scrollTop = 0;
        }

        reportCards.forEach(function(card) {
            card.classList.remove("activo");
        });

        reportButtons.forEach(function(boton) {
            boton.setAttribute("aria-pressed", "false");
            boton.setAttribute("aria-expanded", "false");
        });

        function limpiarDetalleReporte(panel) {
            var error = panel.querySelector(".reporte-error");
            error.textContent = mensajeSinCoincidencias;
            error.classList.add("oculto");
            error.classList.remove("animation-shake");
            panel.querySelectorAll("input").forEach(function(entrada) {
                entrada.value = "";
                entrada.classList.remove("is-invalid");
            });
        }

        if (pantalla === "inicio") {
            actualizarDashboardInicio();
            return;
        }

        if (pantalla === "matricula") {
            // El gráfico de aulas se calcula aquí para que esté listo al abrir
            // el módulo, tanto desde el menú como desde las tarjetas de Inicio.
            actualizarDashboard();
            return;
        }

        if (pantalla === "reportes") {
            detalles.forEach(limpiarDetalleReporte);
            actualizarDashboard();
            return;
        }

        if (!esReporte) {
            return;
        }

        var panelDetalle = document.getElementById("view-reporte-" + clave);
        if (panelDetalle) {
            limpiarDetalleReporte(panelDetalle);
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
            renderizarAsistenciaActual();
            return;
        }

        renderizar(clave, configReportes[clave].datos);
    }

    function irA(pantalla) {
        if (pantalla === pantallaActual()) {
            return;
        }
        mostrarPantalla(pantalla);
    }

    navItems.forEach(function(item) {
        item.addEventListener("click", function() {
            irA(item.getAttribute("data-vista"));
        });
    });

    document.querySelectorAll("[data-home-vista]").forEach(function(boton) {
        boton.addEventListener("click", function(evento) {
            // La tarjeta y su botón comparten el destino; evitamos que el clic
            // del botón se propague y dispare dos veces la navegación.
            evento.stopPropagation();
            irA(boton.getAttribute("data-home-vista"));
        });
    });

    // --- REPORTES: búsqueda y registros ---
    var mensajeSinCoincidencias = "No se encontraron reportes que coincidan con la búsqueda.";

    var estudiantesDemoBase = [
        { id: "E0001", codigoModular: "1234567", nombres: "Ana Lucía", apellidoPaterno: "Quispe", apellidoMaterno: "Rojas", dni: "12345678", fechaNacimiento: "2013-04-14", grado: "2", seccion: "B", fecha: "14/03/2026", edad: 13, periodo: "2026 - I", genero: "Femenino", historialEnfermedades: "Ninguna", celular: "987654321", procedencia: "Conchán" },
        { id: "E0002", codigoModular: "1234567", nombres: "Carlos Daniel", apellidoPaterno: "Rojas", apellidoMaterno: "Mendoza", dni: "87654321", fechaNacimiento: "2010-08-15", grado: "4", seccion: "A", fecha: "15/03/2026", edad: 15, periodo: "2026 - I", genero: "Masculino", historialEnfermedades: "Ninguna", celular: "987654322", procedencia: "Conchán" },
        { id: "E0003", codigoModular: "1234567", nombres: "María Fernanda", apellidoPaterno: "Vargas", apellidoMaterno: "Salazar", dni: "45678123", fechaNacimiento: "2014-03-16", grado: "1", seccion: "A", fecha: "16/03/2026", edad: 11, periodo: "2026 - I", genero: "Femenino", historialEnfermedades: "Ninguna", celular: "987654323", procedencia: "Chota" },
        { id: "E0004", codigoModular: "1234567", nombres: "Jorge Alberto", apellidoPaterno: "Mendoza", apellidoMaterno: "Cruz", dni: "11223344", fechaNacimiento: "2013-03-17", grado: "2", seccion: "B", fecha: "17/03/2026", edad: 12, periodo: "2026 - I", genero: "Masculino", historialEnfermedades: "Ninguna", celular: "987654324", procedencia: "Conchán" },
        { id: "E0005", codigoModular: "1234567", nombres: "Sofía Isabel", apellidoPaterno: "Campos", apellidoMaterno: "Díaz", dni: "55667788", fechaNacimiento: "2008-03-18", grado: "5", seccion: "A", fecha: "18/03/2026", edad: 17, periodo: "2026 - I", genero: "Femenino", historialEnfermedades: "Ninguna", celular: "987654325", procedencia: "Chota" },
        { id: "E0006", codigoModular: "1234567", nombres: "Luis Enrique", apellidoPaterno: "Paredes", apellidoMaterno: "Vega", dni: "99887766", fechaNacimiento: "2012-03-19", grado: "3", seccion: "A", fecha: "19/03/2026", edad: 14, periodo: "2026 - I", genero: "Masculino", historialEnfermedades: "Ninguna", celular: "987654326", procedencia: "Conchán" }
    ];

    var matriculas = estudiantesDemoBase.map(function(estudiante) {
        return Object.assign({}, estudiante);
    });

    function obtenerDatosReporteMatricula() {
        return matriculas.map(function(estudiante) {
            return {
                id: estudiante.id,
                nombres: nombreCompleto(estudiante),
                dni: estudiante.dni,
                grado: etiquetaGrado(estudiante.grado),
                seccion: estudiante.seccion,
                fecha: estudiante.fecha
            };
        });
    }

    function obtenerDatosReporteConsolidado() {
        return matriculas.map(function(estudiante) {
            return {
                id: estudiante.id,
                estudiante: nombreCompleto(estudiante),
                grado: etiquetaGrado(estudiante.grado),
                edad: estudiante.edad ? estudiante.edad + " años" : "—",
                seccion: estudiante.seccion,
                periodo: estudiante.periodo || "2026 - I",
                genero: estudiante.genero || "—"
            };
        });
    }

    function sincronizarReportesMatricula() {
        configReportes.matricula.datos = obtenerDatosReporteMatricula();
        configReportes.consolidado.datos = obtenerDatosReporteConsolidado();
    }

    var configReportes = {
        matricula: {
            datos: [],
            campos: ["id", "nombres", "dni", "grado", "seccion", "fecha"],
            columnas: ["ID", "Estudiante", "DNI", "Grado", "Sección", "Fecha"]
        },
        consolidado: {
            datos: [],
            campos: ["id", "estudiante", "grado", "edad", "seccion", "periodo", "genero"],
            columnas: ["ID", "Estudiante", "Grado", "Edad", "Sección", "Periodo", "Género"]
        }
    };

    sincronizarReportesMatricula();

    var datosActualesReporte = {
        matricula: { filas: [], columnas: [], campos: [] },
        consolidado: { filas: [], columnas: [], campos: [] },
        asistencia: { filas: [], columnas: [], campos: [] }
    };
    function obtenerConteoAulasDashboard() {
        var aforo = 30;
        var seccionesObjetivo = [
            { etiqueta: "1°A", grado: "1º de secundaria", seccion: "A" },
            { etiqueta: "2°A", grado: "2º de secundaria", seccion: "A" },
            { etiqueta: "2°B", grado: "2º de secundaria", seccion: "B" },
            { etiqueta: "3°A", grado: "3º de secundaria", seccion: "A" },
            { etiqueta: "4°A", grado: "4º de secundaria", seccion: "A" },
            { etiqueta: "5°A", grado: "5º de secundaria", seccion: "A" }
        ];

        var conteos = seccionesObjetivo.map(function(objetivo) {
            var cantidad = matriculas.filter(function(estudiante) {
                return Number.parseInt(estudiante.grado, 10) === Number.parseInt(objetivo.grado, 10) && estudiante.seccion === objetivo.seccion;
            }).length;
            return { etiqueta: objetivo.etiqueta, cantidad: cantidad };
        });

        return { aforo: aforo, secciones: seccionesObjetivo, conteos: conteos };
    }

    function renderizarGraficoAulas(idContenedor, conteos, aforo) {
        var contenedorSecciones = document.getElementById(idContenedor);
        if (!contenedorSecciones) {
            return;
        }
        contenedorSecciones.replaceChildren();
        conteos.forEach(function(item) {
            var columna = document.createElement("div");
            columna.className = "resumen-dashboard__seccion";
            var descripcionBarra = item.etiqueta + ": " + item.cantidad + " de " + aforo + " estudiantes";
            columna.setAttribute("role", "img");
            columna.setAttribute("aria-label", descripcionBarra);

            var valor = document.createElement("span");
            valor.className = "resumen-dashboard__valor";
            valor.textContent = item.cantidad;

            var barra = document.createElement("div");
            barra.className = "resumen-dashboard__barra";
            barra.setAttribute("aria-hidden", "true");

            var relleno = document.createElement("div");
            relleno.className = "resumen-dashboard__relleno";
            var porcentaje = Math.min((item.cantidad / aforo) * 100, 100);
            relleno.style.height = porcentaje + "%";
            barra.appendChild(relleno);

            var etiqueta = document.createElement("span");
            etiqueta.className = "resumen-dashboard__etiqueta";
            etiqueta.textContent = item.etiqueta;
            etiqueta.setAttribute("aria-hidden", "true");

            columna.append(valor, barra, etiqueta);
            contenedorSecciones.appendChild(columna);
        });
    }

    function actualizarDashboard() {
        var datosAulas = obtenerConteoAulasDashboard();
        var aforo = datosAulas.aforo;
        var seccionesObjetivo = datosAulas.secciones;
        var conteos = datosAulas.conteos;

        var cifras = [
            {
                icono: '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>',
                valor: String(matriculas.length),
                texto: "Estudiantes matriculados"
            },
            {
                icono: '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>',
                valor: String(docentes.length),
                texto: "Docentes registrados"
            },
            {
                icono: '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 3h18v18H3z" /><path d="M9 3v18" /><path d="M15 12h2" /></svg>',
                valor: String(seccionesObjetivo.length),
                texto: "Aulas disponibles"
            },
            {
                icono: '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 21h18" /><path d="M5 21V7l8-4 8 4v14" /><path d="M9 10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v11H9z" /></svg>',
                valor: String(aforo * seccionesObjetivo.length),
                texto: "Capacidad institucional"
            }
        ];
        var contenedorCifras = document.getElementById("resumen-dashboard-cifras");
        if (contenedorCifras) {
            contenedorCifras.replaceChildren();
            cifras.forEach(function(cifra) {
                var tarjeta = document.createElement("div");
                tarjeta.className = "resumen-dashboard__cifra";

                var icono = document.createElement("div");
                icono.className = "resumen-dashboard__cifra-icono";
                icono.innerHTML = cifra.icono;

                var divisor = document.createElement("span");
                divisor.className = "resumen-dashboard__cifra-divisor";
                divisor.setAttribute("aria-hidden", "true");

                var info = document.createElement("div");
                info.className = "resumen-dashboard__cifra-info";

                var valor = document.createElement("strong");
                valor.textContent = cifra.valor;
                var texto = document.createElement("span");
                texto.textContent = cifra.texto;
                info.append(valor, texto);

                tarjeta.append(icono, divisor, info);
                contenedorCifras.appendChild(tarjeta);
            });
        }

        renderizarGraficoAulas("resumen-dashboard-secciones", conteos, aforo);
        actualizarDashboardReportes();
    }

    function actualizarDashboardReportes() {
        var contenedor = document.getElementById("resumen-reportes-cifras");
        if (!contenedor) {
            return;
        }
        var pendientesSiagie = matriculas.filter(function(estudiante) { return !estudiante.sincronizadoSiagie; }).length;
        var cifras = [
            {
                icono: '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8M16 17H8M10 9H8" /></svg>',
                valor: "3",
                texto: "Reportes disponibles"
            },
            {
                icono: '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>',
                valor: String(matriculas.length),
                texto: "Estudiantes en matrícula"
            },
            {
                icono: '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.6 9a7 7 0 0 1 11.8-2L20 12M4 12l2.6 5a7 7 0 0 0 11.8-2" /></svg>',
                valor: String(pendientesSiagie),
                texto: "Pendientes de envío SIAGIE"
            },
            {
                icono: '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /><path d="M9 16l2 2 4-4" /></svg>',
                valor: String(asistencias.length),
                texto: "Asistencias registradas"
            }
        ];
        contenedor.replaceChildren();
        cifras.forEach(function(cifra) {
            var tarjeta = document.createElement("div");
            tarjeta.className = "resumen-dashboard__cifra";
            var icono = document.createElement("div");
            icono.className = "resumen-dashboard__cifra-icono";
            icono.innerHTML = cifra.icono;
            var divisor = document.createElement("span");
            divisor.className = "resumen-dashboard__cifra-divisor";
            divisor.setAttribute("aria-hidden", "true");
            var info = document.createElement("div");
            info.className = "resumen-dashboard__cifra-info";
            var valor = document.createElement("strong");
            valor.textContent = cifra.valor;
            var texto = document.createElement("span");
            texto.textContent = cifra.texto;
            info.append(valor, texto);
            tarjeta.append(icono, divisor, info);
            contenedor.appendChild(tarjeta);
        });
        actualizarDashboardInicio();
    }

    // --- INICIO: dashboard del colegio ---
    function crearTarjetaKpiInicio(datos) {
        var columna = document.createElement("div");
        columna.className = "col-12 col-sm-6 col-lg-4";

        var tarjeta = document.createElement("article");
        tarjeta.className = "card h-100 inicio-kpi inicio-kpi--" + datos.clave;

        var cuerpo = document.createElement("div");
        cuerpo.className = "card-body";

        var cifra = document.createElement("div");
        cifra.className = "inicio-kpi__cifra";

        var icono = document.createElement("div");
        icono.className = "resumen-dashboard__cifra-icono";
        icono.innerHTML = datos.icono;

        var divisor = document.createElement("span");
        divisor.className = "resumen-dashboard__cifra-divisor";
        divisor.setAttribute("aria-hidden", "true");

        var info = document.createElement("div");
        info.className = "resumen-dashboard__cifra-info";

        var valor = document.createElement("strong");
        valor.textContent = datos.valor;

        var texto = document.createElement("span");
        texto.textContent = datos.texto;

        info.append(valor, texto);
        cifra.append(icono, divisor, info);
        cuerpo.appendChild(cifra);
        tarjeta.appendChild(cuerpo);
        columna.appendChild(tarjeta);
        return columna;
    }

    function actualizarKpisInicio() {
        var contenedor = document.getElementById("inicio-kpis");
        if (!contenedor) {
            return;
        }

        var datosAulas = obtenerConteoAulasDashboard();
        var totalAulas = datosAulas.secciones.length;
        var ocupacion = totalAulas ? Math.round((matriculas.length / (datosAulas.aforo * totalAulas)) * 100) : 0;

        var kpis = [
            {
                clave: "heading",
                valor: String(matriculas.length),
                texto: "Estudiantes matriculados",
                icono: '<i class="bi bi-person-badge bi-icono" aria-hidden="true"></i>'
            },
            {
                clave: "accent",
                valor: String(docentes.length),
                texto: "Docentes registrados",
                icono: '<i class="bi bi-person-check bi-icono" aria-hidden="true"></i>'
            },
            {
                clave: "heading",
                valor: ocupacion + "%",
                texto: "Ocupación de aulas",
                icono: '<i class="bi bi-speedometer2 bi-icono" aria-hidden="true"></i>'
            }
        ];

        contenedor.replaceChildren();
        kpis.forEach(function(kpi) {
            contenedor.appendChild(crearTarjetaKpiInicio(kpi));
        });
    }

    function renderizarDonaGeneroInicio() {
        var dona = document.getElementById("inicio-dona-genero");
        var leyenda = document.getElementById("inicio-leyenda-genero");
        if (!dona || !leyenda) {
            return;
        }

        var total = matriculas.length;
        var partes = [
            { etiqueta: "Femenino", cantidad: matriculas.filter(function(item) { return item.genero === "Femenino"; }).length, color: "var(--color-chart-ocean)" },
            { etiqueta: "Masculino", cantidad: matriculas.filter(function(item) { return item.genero === "Masculino"; }).length, color: "var(--color-chart-magenta)" },
            { etiqueta: "Sin registrar", cantidad: matriculas.filter(function(item) { return item.genero !== "Femenino" && item.genero !== "Masculino"; }).length, color: "var(--color-chart-yellow)" }
        ].filter(function(parte) { return parte.cantidad > 0; });

        var centro = document.createElement("span");
        centro.className = "dashboard-dona__centro";
        var numero = document.createElement("strong");
        numero.textContent = String(total);
        var etiquetaTotal = document.createElement("span");
        etiquetaTotal.textContent = "estudiantes";
        centro.append(numero, etiquetaTotal);
        dona.replaceChildren(centro);

        if (total === 0) {
            dona.style.background = "var(--color-muted)";
            dona.setAttribute("aria-label", "Sin estudiantes registrados");
        } else {
            var acumulado = 0;
            var segmentos = partes.map(function(parte) {
                var desde = (acumulado / total) * 100;
                acumulado += parte.cantidad;
                var hasta = (acumulado / total) * 100;
                return parte.color + " " + desde.toFixed(1) + "% " + hasta.toFixed(1) + "%";
            });
            dona.style.background = "conic-gradient(" + segmentos.join(", ") + ")";
            dona.setAttribute("aria-label", "Distribución por género: " + partes.map(function(parte) {
                return parte.etiqueta + " " + parte.cantidad;
            }).join(", "));
        }

        leyenda.replaceChildren();
        partes.forEach(function(parte) {
            var item = document.createElement("li");
            item.className = "dashboard-leyenda__item";
            var color = document.createElement("span");
            color.className = "dashboard-leyenda__color";
            color.style.background = parte.color;
            color.setAttribute("aria-hidden", "true");
            var texto = document.createElement("span");
            texto.textContent = parte.etiqueta + ": " + parte.cantidad + " (" + Math.round((parte.cantidad / total) * 100) + "%)";
            item.append(color, texto);
            leyenda.appendChild(item);
        });
    }

    function renderizarGraficoGradoAulaInicio() {
        var contenedor = document.getElementById("inicio-barras-grado-aula");
        if (!contenedor) {
            return;
        }

        var datosAulas = obtenerConteoAulasDashboard();
        var aforo = datosAulas.aforo;
        var total = matriculas.length;
        contenedor.replaceChildren();

        datosAulas.conteos.forEach(function(item) {
            var porcentaje = total ? Math.round((item.cantidad / total) * 100) : 0;
            var columna = document.createElement("div");
            columna.className = "resumen-dashboard__seccion";
            columna.setAttribute("role", "img");
            columna.setAttribute("aria-label", item.etiqueta + ": " + item.cantidad + " de " + aforo + " estudiantes, " + porcentaje + "% del total");

            var valor = document.createElement("span");
            valor.className = "resumen-dashboard__valor";
            valor.textContent = item.cantidad + " (" + porcentaje + "%)";

            var barra = document.createElement("div");
            barra.className = "resumen-dashboard__barra";
            barra.setAttribute("aria-hidden", "true");

            var relleno = document.createElement("div");
            relleno.className = "resumen-dashboard__relleno";
            relleno.style.height = Math.min((item.cantidad / aforo) * 100, 100) + "%";
            barra.appendChild(relleno);

            var etiqueta = document.createElement("span");
            etiqueta.className = "resumen-dashboard__etiqueta";
            etiqueta.textContent = item.etiqueta;
            etiqueta.setAttribute("aria-hidden", "true");

            columna.append(valor, barra, etiqueta);
            contenedor.appendChild(columna);
        });
    }

    function renderizarAsistenciaInicio() {
        var porcentajeElemento = document.getElementById("inicio-asistencia-porcentaje");
        var barra = document.getElementById("inicio-asistencia-barra");
        var progreso = document.getElementById("inicio-asistencia-progreso");
        var detalle = document.getElementById("inicio-asistencia-detalle");
        var lista = document.getElementById("inicio-asistencia-estados");
        if (!porcentajeElemento || !barra || !progreso || !detalle || !lista) {
            return;
        }

        var estados = [
            { etiqueta: "Asistencia", clase: "exito" },
            { etiqueta: "Tardanza", clase: "advertencia" },
            { etiqueta: "Falta justificada", clase: "informacion" },
            { etiqueta: "Falta injustificada", clase: "error" }
        ];
        var total = asistencias.length;
        var puntuales = asistencias.filter(function(registro) { return registro.estado === "Asistencia"; }).length;
        var porcentaje = total ? Math.round((puntuales / total) * 100) : 0;

        porcentajeElemento.textContent = porcentaje + "%";
        detalle.textContent = puntuales + " de " + total + " registros con asistencia puntual";
        barra.style.width = porcentaje + "%";
        progreso.setAttribute("aria-label", "Asistencia puntual: " + porcentaje + "%, " + puntuales + " de " + total + " registros");

        lista.replaceChildren();
        estados.forEach(function(estado) {
            var cantidad = asistencias.filter(function(registro) { return registro.estado === estado.etiqueta; }).length;
            var item = document.createElement("li");
            item.className = "inicio-estado";
            var punto = document.createElement("span");
            punto.className = "inicio-estado__punto inicio-estado__punto--" + estado.clase;
            punto.setAttribute("aria-hidden", "true");
            var texto = document.createElement("span");
            texto.textContent = estado.etiqueta;
            var valor = document.createElement("strong");
            valor.textContent = cantidad + (total ? " (" + Math.round((cantidad / total) * 100) + "%)" : "");
            item.append(punto, texto, valor);
            lista.appendChild(item);
        });
    }

    function actualizarDashboardInicio() {
        var saludo = document.getElementById("inicio-saludo");
        if (!saludo) {
            return;
        }
        saludo.textContent = "Bienvenida, " + usuarioActivo.nombre;

        var fecha = document.getElementById("inicio-fecha");
        if (fecha) {
            fecha.textContent = new Intl.DateTimeFormat("es-PE", {
                weekday: "long", day: "numeric", month: "long", year: "numeric"
            }).format(new Date());
        }

        actualizarKpisInicio();
        renderizarGraficoGradoAulaInicio();
        renderizarDonaGeneroInicio();
        renderizarAsistenciaInicio();
    }

    function normalizar(texto) {
        return String(texto).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    function nombreMes(fechaISO) {
        var partes = String(fechaISO || "").split("-");
        var indice = Number(partes[1]) - 1;
        return indice >= 0 && indice < nombresMeses.length ? nombresMeses[indice] : "";
    }

    function semanaDelMes(fechaISO) {
        var dia = Number(String(fechaISO || "").split("-")[2]);
        return dia >= 1 && dia <= 31 ? Math.ceil(dia / 7) : 0;
    }

    function porcentajeAsistencia(registros) {
        if (registros.length === 0) {
            return "—";
        }
        var asistidos = registros.filter(function(registro) {
            return registro.estado.indexOf("Falta") !== 0;
        }).length;
        return Math.round((asistidos / registros.length) * 100) + "%";
    }

    function agruparAsistenciasPorDocente(registros) {
        var grupos = [];
        registros.forEach(function(registro) {
            var grupo = grupos.find(function(item) { return item.dni === registro.dni; });
            if (!grupo) {
                grupo = { id: registro.dni, docente: registro.docente, registros: [] };
                grupos.push(grupo);
            }
            grupo.registros.push(registro);
        });
        return grupos;
    }

    function actualizarOpcionesMesesAsistencia() {
        var select = document.getElementById("mes-asistencia");
        if (!select) {
            return;
        }
        var seleccionActual = select.value;
        var meses = [];
        asistencias.forEach(function(registro) {
            var mes = nombreMes(registro.fecha);
            if (mes && meses.indexOf(mes) === -1) {
                meses.push(mes);
            }
        });
        var mesActual = nombresMeses[new Date().getMonth()];
        if (meses.indexOf(mesActual) === -1) {
            meses.push(mesActual);
        }
        meses.sort(function(a, b) { return nombresMeses.indexOf(a) - nombresMeses.indexOf(b); });
        if (meses.indexOf(seleccionActual) === -1) {
            seleccionActual = mesActual;
        }
        select.replaceChildren();
        meses.forEach(function(mes) {
            var opcion = document.createElement("option");
            opcion.value = mes;
            opcion.textContent = mes;
            select.appendChild(opcion);
        });
        select.value = seleccionActual;
    }

    function datosAsistenciaMes() {
        var selectMes = document.getElementById("mes-asistencia");
        var mes = selectMes ? selectMes.value : nombresMeses[new Date().getMonth()];
        return asistencias.filter(function(registro) {
            return nombreMes(registro.fecha) === mes;
        });
    }

    function diaSemanaFecha(fechaISO) {
        var partes = String(fechaISO || "").split("-");
        var anio = Number(partes[0]);
        var mes = Number(partes[1]) - 1;
        var dia = Number(partes[2]);
        if (!anio || mes < 0 || mes > 11 || !dia) {
            return 0;
        }
        var diaSemana = new Date(anio, mes, dia).getDay();
        return diaSemana >= 1 && diaSemana <= 5 ? diaSemana : 0;
    }

    function etiquetaEstadoCelda(estado) {
        if (estado === "Asistencia") {
            return "Asistió";
        }
        return estado;
    }

    function ultimaSemanaConRegistros(registros) {
        var semanaMasReciente = 0;
        registros.forEach(function(registro) {
            var semana = semanaDelMes(registro.fecha);
            if (semana > semanaMasReciente) {
                semanaMasReciente = semana;
            }
        });
        return semanaMasReciente;
    }

    function vistaAsistencia(registros) {
        var selectTipo = document.getElementById("tipo-asistencia");
        var esSemanal = selectTipo && selectTipo.value === "semanal";
        var dias = [
            { columna: "Lunes", campo: "lunes", numero: 1 },
            { columna: "Martes", campo: "martes", numero: 2 },
            { columna: "Miércoles", campo: "miercoles", numero: 3 },
            { columna: "Jueves", campo: "jueves", numero: 4 },
            { columna: "Viernes", campo: "viernes", numero: 5 }
        ];
        var columnas = ["ID", "Docente"];
        var campos = ["id", "docente"];
        dias.forEach(function(dia) {
            columnas.push(dia.columna);
            campos.push(dia.campo);
        });
        columnas.push("Asistencia total");
        campos.push("porcentaje");

        var semana = ultimaSemanaConRegistros(registros);
        var registrosVista = esSemanal
            ? registros
            : registros.filter(function(registro) { return semanaDelMes(registro.fecha) === semana; });
        var filas = [];

        agruparAsistenciasPorDocente(registrosVista).forEach(function(grupo) {
            var fila = { id: grupo.id, docente: grupo.docente };
            dias.forEach(function(dia) {
                var registrosDelDia = grupo.registros.filter(function(registro) {
                    return diaSemanaFecha(registro.fecha) === dia.numero;
                });
                if (esSemanal) {
                    fila[dia.campo] = porcentajeAsistencia(registrosDelDia);
                } else if (registrosDelDia.length > 0) {
                    fila[dia.campo] = etiquetaEstadoCelda(registrosDelDia[registrosDelDia.length - 1].estado);
                } else {
                    fila[dia.campo] = "—";
                }
            });
            fila.porcentaje = porcentajeAsistencia(grupo.registros);
            filas.push(fila);
        });

        return { columnas: columnas, campos: campos, filas: filas };
    }

    function renderizarAsistenciaActual() {
        actualizarOpcionesMesesAsistencia();
        var registros = datosAsistenciaMes();
        var vista = vistaAsistencia(registros);
        var panel = document.getElementById("view-reporte-asistencia");
        var error = panel ? panel.querySelector(".reporte-error") : null;
        if (error) {
            error.textContent = "No hay asistencias registradas para el mes seleccionado.";
        }
        renderizar("asistencia", vista.filas, vista);
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
        if (e.type === "keydown" && e.key !== " " && e.key !== "Spacebar") { return; }
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
            if (!clave || clave === "asistencia") { return; }

            var config = configReportes[clave];
            var panel = document.getElementById("view-reporte-" + clave);
            var error = panel.querySelector(".reporte-error");
            var filas, nombre, dni, gradoSeccion;

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
                    var coincideGradoSeccion = gradoSeccion === "" || normalizar(fila.grado + " " + fila.seccion).indexOf(gradoSeccion) !== -1 || normalizar(fila.grado).indexOf(gradoSeccion) !== -1 || normalizar(fila.seccion).indexOf(gradoSeccion) !== -1;
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
        selectTipoAsistencia.addEventListener("change", function() { renderizarAsistenciaActual(); });
    }
    if (selectMesAsistencia) {
        selectMesAsistencia.addEventListener("change", function() { renderizarAsistenciaActual(); });
    }

    // --- REPORTES: descarga de datos ---
    function valorCSV(valor) {
        var texto = String(valor == null ? "" : valor);
        if (/[",\n\r]/.test(texto)) { return '"' + texto.replace(/"/g, '""') + '"'; }
        return texto;
    }

    function descargarCSV(nombreArchivo, columnas, campos, filas) {
        var lineas = [];
        lineas.push(columnas.map(valorCSV).join(","));
        filas.forEach(function(fila) {
            lineas.push(campos.map(function(campo) { return valorCSV(fila[campo]); }).join(","));
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

    document.querySelectorAll(".btn-volver-reportes").forEach(function(boton) {
        boton.addEventListener("click", function() {
            irA("reportes");
        });
    });

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
            var fechaDescarga = new Date().toISOString().slice(0, 10);
            descargarCSV("reporte-" + clave + "-" + fechaDescarga + ".csv", actual.columnas, actual.campos, actual.filas);
        });
    });

    // ==========================================
    // --- REGISTRO Y ASOCIACIÓN DE MATRÍCULA ---
    // ==========================================
    var formMatricula = document.getElementById("matricula-form");
    var formApoderado = document.getElementById("apoderado-form");
    var formAsociacion = document.getElementById("asociacion-form");
    var alertaEstudiante = document.getElementById("alerta");
    var alertaApoderado = document.getElementById("alerta-apoderado");
    var alertaAsociacion = document.getElementById("alerta-asociacion");
    var tablaEstudiantes = document.getElementById("tabla-estudiantes");
    var tablaApoderados = document.getElementById("tabla-apoderados");
    var tablaRelaciones = document.getElementById("tabla-relaciones");
    var campoFechaNacimiento = document.getElementById("fecha-nacimiento");
    var selectGrado = document.getElementById("grado");
    var selectSeccion = document.getElementById("seccion");
    var apoderados = [
        { id: "P0001", nombres: "Rosa Elena", apellidoPaterno: "Quispe", apellidoMaterno: "Rojas", dni: "22334455", sexo: "Femenino", celular: "987654111", procedencia: "Conchán" },
        { id: "P0002", nombres: "José Manuel", apellidoPaterno: "Rojas", apellidoMaterno: "Mendoza", dni: "66778899", sexo: "Masculino", celular: "987654112", procedencia: "Conchán" },
        { id: "P0003", nombres: "Elena María", apellidoPaterno: "Vargas", apellidoMaterno: "Salazar", dni: "77889900", sexo: "Femenino", celular: "987654113", procedencia: "Chota" },
        { id: "P0004", nombres: "Pedro Antonio", apellidoPaterno: "Mendoza", apellidoMaterno: "Cruz", dni: "33445566", sexo: "Masculino", celular: "987654114", procedencia: "Conchán" },
        { id: "P0005", nombres: "Carmen Luz", apellidoPaterno: "Campos", apellidoMaterno: "Díaz", dni: "44557788", sexo: "Femenino", celular: "987654115", procedencia: "Chota" },
        { id: "P0006", nombres: "Miguel Ángel", apellidoPaterno: "Paredes", apellidoMaterno: "Vega", dni: "88990011", sexo: "Masculino", celular: "987654116", procedencia: "Conchán" }
    ];
    var asociaciones = [
        { id: "R001", estudianteId: "E0001", apoderadoId: "P0001", parentesco: "Madre", fecha: "2026-03-14", observacion: "Contacto principal" },
        { id: "R002", estudianteId: "E0002", apoderadoId: "P0002", parentesco: "Padre", fecha: "2026-03-15", observacion: "Autoriza trámites" },
        { id: "R003", estudianteId: "E0003", apoderadoId: "P0003", parentesco: "Madre", fecha: "2026-03-16", observacion: "Contacto alternativo" },
        { id: "R004", estudianteId: "E0004", apoderadoId: "P0004", parentesco: "Padre", fecha: "2026-03-17", observacion: "Contacto principal" }
    ];
    var estudianteEnEdicion = null;
    var apoderadoEnEdicion = null;
    var asociacionEnEdicion = null;
    var fechaHoy = fechaLocal(new Date());
    document.getElementById("estudiante-id").value = siguienteId(matriculas, "E");
    document.getElementById("ap-id").value = siguienteId(apoderados, "P");
    document.getElementById("asociacion-fecha").value = fechaHoy;
    campoFechaNacimiento.max = fechaHoy;

    var simulacionesReniec = {
        estudiante: {
            "12345678": { nombres: "Ana Lucía", paterno: "Quispe", materno: "Rojas", fechaNacimiento: "2013-04-14", sexo: "Femenino" },
            "87654321": { nombres: "Carlos Daniel", paterno: "Rojas", materno: "Mendoza", fechaNacimiento: "2010-08-15", sexo: "Masculino" },
            "44556677": { nombres: "Lucía Fernanda", paterno: "Huamán", materno: "Vega", fechaNacimiento: "2014-02-20", sexo: "Femenino" }
        },
        apoderado: {
            "22334455": { nombres: "Rosa Elena", paterno: "Quispe", materno: "Rojas", sexo: "Femenino" },
            "66778899": { nombres: "José Manuel", paterno: "Huamán", materno: "Vega", sexo: "Masculino" },
            "77889900": { nombres: "Carmen Luz", paterno: "Mendoza", materno: "Salazar", sexo: "Femenino" }
        }
    };

    function paresAlertaMatricula(elemento) {
        var pares = {
            "alerta": "alerta-estudiante-dialogo",
            "alerta-estudiante-dialogo": "alerta",
            "alerta-apoderado": "alerta-apoderado-dialogo",
            "alerta-apoderado-dialogo": "alerta-apoderado",
            "alerta-asociacion": "alerta-asociacion-dialogo",
            "alerta-asociacion-dialogo": "alerta-asociacion"
        };
        var par = pares[elemento.id] ? document.getElementById(pares[elemento.id]) : null;
        return par ? [elemento, par] : [elemento];
    }

    function mostrarAlertaMatricula(elemento, mensaje, tipo) {
        paresAlertaMatricula(elemento).forEach(function(alerta) {
            alerta.textContent = mensaje;
            alerta.classList.remove("oculto", "error", "exito");
            alerta.classList.add(tipo);
        });
    }

    function ocultarAlertaMatricula(elemento) {
        paresAlertaMatricula(elemento).forEach(function(alerta) {
            alerta.classList.add("oculto");
            alerta.classList.remove("error", "exito");
            alerta.textContent = "";
        });
    }

    function limitarEntradaNumerica(elemento, maximo) {
        elemento.addEventListener("input", function() {
            elemento.value = elemento.value.replace(/\D/g, "").slice(0, maximo);
        });
    }

    function limitarEntradaLetras(elemento) {
        elemento.addEventListener("input", function() {
            elemento.value = elemento.value.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]/g, "");
        });
    }

    function nombreCompleto(registro) {
        if (registro.apellidoPaterno || registro.apellidoMaterno) {
            return [registro.nombres, registro.apellidoPaterno, registro.apellidoMaterno].filter(Boolean).join(" ");
        }
        return registro.nombres || "Sin nombre";
    }

    function codigoGrado(grado) {
        var coincidencia = String(grado || "").match(/\d/);
        return coincidencia ? coincidencia[0] : "";
    }

    function etiquetaGrado(grado) {
        var codigo = codigoGrado(grado);
        return codigo ? codigo + "º de secundaria" : (grado || "—");
    }

    function edadDesdeFecha(fecha) {
        if (!fecha) {
            return "";
        }
        var nacimiento = new Date(fecha + "T00:00:00");
        var hoy = new Date();
        var edad = hoy.getFullYear() - nacimiento.getFullYear();
        if (hoy.getMonth() < nacimiento.getMonth() || (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate())) {
            edad -= 1;
        }
        return edad >= 0 ? edad : "";
    }

    function siguienteId(registros, prefijo) {
        var numero = registros.length + 1;
        var id = prefijo + String(numero).padStart(4, "0");
        while (registros.some(function(registro) { return registro.id === id; })) {
            numero += 1;
            id = prefijo + String(numero).padStart(4, "0");
        }
        return id;
    }

    function textoCelda(fila, texto) {
        var celda = document.createElement("td");
        celda.textContent = texto || "—";
        fila.appendChild(celda);
        return celda;
    }

    function agregarAccion(fila, accion, etiqueta, dibujo) {
        var boton = document.createElement("button");
        boton.type = "button";
        boton.className = "matricula-accion";
        boton.dataset.accion = accion;
        boton.setAttribute("aria-label", etiqueta);
        boton.title = etiqueta;
        boton.innerHTML = '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + dibujo + "</svg>";
        fila.lastElementChild.appendChild(boton);
    }

    function celdaAcciones(fila) {
        var celda = document.createElement("td");
        celda.className = "matricula-acciones";
        fila.appendChild(celda);
    }

    var iconosAccion = {
        consultar: '<circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" />',
        editar: '<path d="m15 5 4 4M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16z" />',
        eliminar: '<path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />',
        enviar: '<path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.6 9a7 7 0 0 1 11.8-2L20 12M4 12l2.6 5a7 7 0 0 0 11.8-2" />'
    };

    function renderizarEstudiantes() {
        var termino = normalizar(document.getElementById("filtro-estudiante").value.trim());
        var gradoFiltro = document.getElementById("filtro-grado").value;
        var sexoFiltro = document.getElementById("filtro-sexo-estudiante").value;
        var filtrados = matriculas.filter(function(estudiante) {
            var coincideTexto = normalizar(nombreCompleto(estudiante) + " " + estudiante.dni).includes(termino);
            return coincideTexto && (!gradoFiltro || codigoGrado(estudiante.grado) === gradoFiltro) && (!sexoFiltro || estudiante.genero === sexoFiltro);
        });
        tablaEstudiantes.replaceChildren();
        if (!filtrados.length) {
            var vacio = document.createElement("tr");
            var celdaVacia = textoCelda(vacio, "No hay estudiantes que coincidan con los filtros.");
            celdaVacia.colSpan = 7;
            celdaVacia.className = "tabla-registros__vacio";
            tablaEstudiantes.appendChild(vacio);
            return;
        }
        filtrados.forEach(function(estudiante) {
            var fila = document.createElement("tr");
            textoCelda(fila, estudiante.id);
            textoCelda(fila, nombreCompleto(estudiante));
            textoCelda(fila, estudiante.dni);
            textoCelda(fila, (codigoGrado(estudiante.grado) ? codigoGrado(estudiante.grado) + "º" : "—") + " / " + (estudiante.seccion || "—"));
            textoCelda(fila, estudiante.edad ? estudiante.edad + " años" : "—");
            textoCelda(fila, estudiante.sincronizadoSiagie ? "Enviado" : "Pendiente");
            celdaAcciones(fila);
            agregarAccion(fila, "consultar", "Consultar " + estudiante.id, iconosAccion.consultar);
            agregarAccion(fila, "editar", "Editar " + estudiante.id, iconosAccion.editar);
            agregarAccion(fila, "eliminar", "Eliminar " + estudiante.id, iconosAccion.eliminar);
            if (!estudiante.sincronizadoSiagie) {
                agregarAccion(fila, "enviar", "Simular envío de " + estudiante.id + " a SIAGIE", iconosAccion.enviar);
            }
            tablaEstudiantes.appendChild(fila);
        });
    }

    function renderizarApoderados() {
        var termino = normalizar(document.getElementById("filtro-apoderado").value.trim());
        var sexoFiltro = document.getElementById("filtro-sexo-apoderado").value;
        var filtrados = apoderados.filter(function(apoderado) {
            return normalizar(nombreCompleto(apoderado) + " " + apoderado.dni).includes(termino) && (!sexoFiltro || apoderado.sexo === sexoFiltro);
        });
        tablaApoderados.replaceChildren();
        if (!filtrados.length) {
            var vacio = document.createElement("tr");
            var celdaVacia = textoCelda(vacio, apoderados.length ? "No hay apoderados que coincidan con los filtros." : "Aún no hay apoderados registrados.");
            celdaVacia.colSpan = 7;
            celdaVacia.className = "tabla-registros__vacio";
            tablaApoderados.appendChild(vacio);
            return;
        }
        filtrados.forEach(function(apoderado) {
            var fila = document.createElement("tr");
            textoCelda(fila, apoderado.id);
            textoCelda(fila, nombreCompleto(apoderado));
            textoCelda(fila, apoderado.dni);
            textoCelda(fila, apoderado.sexo);
            textoCelda(fila, apoderado.celular);
            textoCelda(fila, apoderado.procedencia);
            celdaAcciones(fila);
            agregarAccion(fila, "consultar", "Consultar " + apoderado.id, iconosAccion.consultar);
            agregarAccion(fila, "editar", "Editar " + apoderado.id, iconosAccion.editar);
            agregarAccion(fila, "eliminar", "Eliminar " + apoderado.id, iconosAccion.eliminar);
            tablaApoderados.appendChild(fila);
        });
    }

    function renderizarOpcionesAsociacion() {
        var filtroEstudiante = normalizar(document.getElementById("buscar-estudiante-asociacion").value.trim());
        var filtroApoderado = normalizar(document.getElementById("buscar-apoderado-asociacion").value.trim());
        var selectEstudiante = document.getElementById("asociacion-estudiante");
        var selectApoderado = document.getElementById("asociacion-apoderado");
        var estudianteSeleccionado = selectEstudiante.value;
        var apoderadoSeleccionado = selectApoderado.value;

        selectEstudiante.replaceChildren(new Option("Seleccione un estudiante...", ""));
        matriculas.filter(function(estudiante) {
            return normalizar(nombreCompleto(estudiante) + " " + estudiante.dni).includes(filtroEstudiante);
        }).forEach(function(estudiante) {
            selectEstudiante.add(new Option(nombreCompleto(estudiante) + " · DNI " + estudiante.dni, estudiante.id));
        });
        selectApoderado.replaceChildren(new Option("Seleccione un apoderado...", ""));
        apoderados.filter(function(apoderado) {
            return normalizar(nombreCompleto(apoderado) + " " + apoderado.dni).includes(filtroApoderado);
        }).forEach(function(apoderado) {
            selectApoderado.add(new Option(nombreCompleto(apoderado) + " · DNI " + apoderado.dni, apoderado.id));
        });
        if (Array.from(selectEstudiante.options).some(function(opcion) { return opcion.value === estudianteSeleccionado; })) {
            selectEstudiante.value = estudianteSeleccionado;
        }
        if (Array.from(selectApoderado.options).some(function(opcion) { return opcion.value === apoderadoSeleccionado; })) {
            selectApoderado.value = apoderadoSeleccionado;
        }
    }

    function renderizarAsociaciones() {
        var termino = normalizar(document.getElementById("filtro-asociacion").value.trim());
        var filtradas = asociaciones.filter(function(asociacion) {
            var estudiante = matriculas.find(function(item) { return item.id === asociacion.estudianteId; });
            var apoderado = apoderados.find(function(item) { return item.id === asociacion.apoderadoId; });
            return normalizar(
                (estudiante ? nombreCompleto(estudiante) + " " + estudiante.dni : "") + " " +
                (apoderado ? nombreCompleto(apoderado) + " " + apoderado.dni : "")
            ).includes(termino);
        });
        tablaRelaciones.replaceChildren();
        if (!filtradas.length) {
            var vacio = document.createElement("tr");
            var celdaVacia = textoCelda(vacio, asociaciones.length ? "No hay asociaciones que coincidan con el filtro." : "Aún no hay asociaciones registradas.");
            celdaVacia.colSpan = 8;
            celdaVacia.className = "tabla-registros__vacio";
            tablaRelaciones.appendChild(vacio);
            return;
        }
        filtradas.forEach(function(asociacion) {
            var estudiante = matriculas.find(function(item) { return item.id === asociacion.estudianteId; });
            var apoderado = apoderados.find(function(item) { return item.id === asociacion.apoderadoId; });
            var fila = document.createElement("tr");
            fila.dataset.id = asociacion.id;
            textoCelda(fila, estudiante ? nombreCompleto(estudiante) : "Registro no disponible");
            textoCelda(fila, estudiante ? estudiante.dni : "—");
            textoCelda(fila, apoderado ? nombreCompleto(apoderado) : "Registro no disponible");
            textoCelda(fila, apoderado ? apoderado.dni : "—");
            textoCelda(fila, asociacion.parentesco);
            textoCelda(fila, asociacion.fecha);
            textoCelda(fila, asociacion.observacion || "—");
            celdaAcciones(fila);
            agregarAccion(fila, "consultar", "Consultar asociación", iconosAccion.consultar);
            agregarAccion(fila, "editar", "Modificar asociación", iconosAccion.editar);
            agregarAccion(fila, "eliminar", "Eliminar asociación", iconosAccion.eliminar);
            tablaRelaciones.appendChild(fila);
        });
    }

    function actualizarListasMatricula() {
        renderizarEstudiantes();
        renderizarApoderados();
        renderizarOpcionesAsociacion();
        renderizarAsociaciones();
    }

    function iniciarEdicionEstudiante(estudiante) {
        estudianteEnEdicion = estudiante.id;
        document.getElementById("estudiante-id").value = estudiante.id;
        document.getElementById("codigo-modular").value = estudiante.codigoModular || "";
        document.getElementById("nombres").value = estudiante.nombres || "";
        document.getElementById("apellido-paterno").value = estudiante.apellidoPaterno || "";
        document.getElementById("apellido-materno").value = estudiante.apellidoMaterno || "";
        document.getElementById("dni").value = estudiante.dni || "";
        campoFechaNacimiento.value = estudiante.fechaNacimiento || "";
        document.getElementById("genero").value = estudiante.genero || "";
        document.getElementById("historial-enfermedades").value = estudiante.historialEnfermedades || "No registrado (dato de demostración)";
        document.getElementById("celular-estudiante").value = estudiante.celular || "";
        document.getElementById("procedencia-estudiante").value = estudiante.procedencia || "";
        selectGrado.value = codigoGrado(estudiante.grado);
        selectSeccion.value = estudiante.seccion || "";
        document.getElementById("guardar-estudiante").textContent = "Guardar cambios";
        document.getElementById("cancelar-edicion-estudiante").classList.remove("oculto");
        var dialogoEstudiante = document.getElementById("dialog-registrar-estudiante");
        var tituloEstudiante = document.getElementById("dialog-registrar-estudiante-label");
        if (tituloEstudiante) { tituloEstudiante.textContent = "Editar estudiante"; }
        abrirDialogo(dialogoEstudiante);
    }

    function limpiarEdicionEstudiante() {
        estudianteEnEdicion = null;
        formMatricula.reset();
        document.getElementById("estudiante-id").value = siguienteId(matriculas, "E");
        document.getElementById("guardar-estudiante").textContent = "Guardar matrícula";
        document.getElementById("cancelar-edicion-estudiante").classList.add("oculto");
        var tituloEstudiante = document.getElementById("dialog-registrar-estudiante-label");
        if (tituloEstudiante) { tituloEstudiante.textContent = "Registrar estudiante"; }
    }

    function iniciarEdicionApoderado(apoderado) {
        apoderadoEnEdicion = apoderado.id;
        document.getElementById("ap-id").value = apoderado.id;
        document.getElementById("ap_nombres").value = apoderado.nombres;
        document.getElementById("ap-apellido-paterno").value = apoderado.apellidoPaterno;
        document.getElementById("ap-apellido-materno").value = apoderado.apellidoMaterno;
        document.getElementById("ap_dni").value = apoderado.dni;
        document.getElementById("ap-sexo").value = apoderado.sexo;
        document.getElementById("ap_telefono").value = apoderado.celular;
        document.getElementById("ap-procedencia").value = apoderado.procedencia;
        document.getElementById("guardar-apoderado").textContent = "Guardar cambios";
        document.getElementById("cancelar-edicion-apoderado").classList.remove("oculto");
        var dialogoApoderado = document.getElementById("dialog-registrar-apoderado");
        var tituloApoderado = document.getElementById("dialog-registrar-apoderado-label");
        if (tituloApoderado) { tituloApoderado.textContent = "Editar apoderado"; }
        abrirDialogo(dialogoApoderado);
    }

    function limpiarEdicionApoderado() {
        apoderadoEnEdicion = null;
        formApoderado.reset();
        document.getElementById("ap-id").value = siguienteId(apoderados, "P");
        document.getElementById("guardar-apoderado").textContent = "Guardar apoderado";
        document.getElementById("cancelar-edicion-apoderado").classList.add("oculto");
        var tituloApoderado = document.getElementById("dialog-registrar-apoderado-label");
        if (tituloApoderado) { tituloApoderado.textContent = "Registrar apoderado"; }
    }

    function iniciarEdicionAsociacion(asociacion) {
        asociacionEnEdicion = asociacion.id;
        document.getElementById("buscar-estudiante-asociacion").value = "";
        document.getElementById("buscar-apoderado-asociacion").value = "";
        renderizarOpcionesAsociacion();
        document.getElementById("asociacion-estudiante").value = asociacion.estudianteId;
        document.getElementById("asociacion-apoderado").value = asociacion.apoderadoId;
        document.getElementById("asociacion-parentesco").value = asociacion.parentesco;
        document.getElementById("asociacion-fecha").value = asociacion.fecha;
        document.getElementById("asociacion-observacion").value = asociacion.observacion || "";
        document.getElementById("guardar-asociacion").textContent = "Guardar cambios";
        document.getElementById("cancelar-edicion-asociacion").classList.remove("oculto");
        var dialogoAsociacion = document.getElementById("dialog-registrar-asociacion");
        var tituloAsociacion = document.getElementById("dialog-registrar-asociacion-label");
        if (tituloAsociacion) { tituloAsociacion.textContent = "Editar asociación"; }
        abrirDialogo(dialogoAsociacion);
    }

    function limpiarEdicionAsociacion() {
        asociacionEnEdicion = null;
        formAsociacion.reset();
        document.getElementById("asociacion-fecha").value = fechaLocal(new Date());
        document.getElementById("guardar-asociacion").textContent = "Asociar estudiante";
        document.getElementById("cancelar-edicion-asociacion").classList.add("oculto");
        var tituloAsociacion = document.getElementById("dialog-registrar-asociacion-label");
        if (tituloAsociacion) { tituloAsociacion.textContent = "Nueva asociación"; }
        renderizarOpcionesAsociacion();
    }

    function consultarRegistro(titulo, registro, persona) {
        var detalles = persona
            ? "Nombre: " + nombreCompleto(registro) + "\nDNI: " + registro.dni + "\nSexo: " + (registro.sexo || registro.genero || "—") +
                "\nCelular: " + (registro.celular || "—") + "\nProcedencia: " + (registro.procedencia || "—")
            : "Estudiante: " + (matriculas.find(function(item) { return item.id === registro.estudianteId; }) ?
                nombreCompleto(matriculas.find(function(item) { return item.id === registro.estudianteId; })) : "No disponible") +
                "\nApoderado: " + (apoderados.find(function(item) { return item.id === registro.apoderadoId; }) ?
                    nombreCompleto(apoderados.find(function(item) { return item.id === registro.apoderadoId; })) : "No disponible") +
                "\nParentesco: " + registro.parentesco + "\nFecha de asignación: " + registro.fecha +
                "\nObservación: " + (registro.observacion || "—");
        window.alert(titulo + "\n\n" + detalles);
    }

    function buscarSimulacionReniec(tipo, campoDni, campos, alerta) {
        var dni = document.getElementById(campoDni).value.trim();
        if (!/^\d{8}$/.test(dni)) {
            mostrarAlertaMatricula(alerta, "Ingrese un DNI de 8 dígitos para iniciar la simulación.", "error");
            return;
        }
        var resultado = simulacionesReniec[tipo][dni];
        if (!resultado) {
            mostrarAlertaMatricula(alerta, "No hay datos de prueba para este DNI. No se consultó RENIEC.", "error");
            return;
        }
        Object.keys(campos).forEach(function(clave) {
            document.getElementById(campos[clave]).value = resultado[clave] || "";
        });
        mostrarAlertaMatricula(alerta, "Simulación RENIEC exitosa: datos de prueba autocompletados. No se consultó el servicio real.", "exito");
    }

    [document.getElementById("dni"), document.getElementById("ap_dni")].forEach(function(campo) {
        limitarEntradaNumerica(campo, 8);
    });
    limitarEntradaNumerica(document.getElementById("codigo-modular"), 7);
    [document.getElementById("celular-estudiante"), document.getElementById("ap_telefono")].forEach(function(campo) {
        limitarEntradaNumerica(campo, 9);
    });
    [
        "nombres",
        "apellido-paterno",
        "apellido-materno",
        "ap_nombres",
        "ap-apellido-paterno",
        "ap-apellido-materno"
    ].forEach(function(id) {
        limitarEntradaLetras(document.getElementById(id));
    });

    document.getElementById("buscar-reniec-estudiante").addEventListener("click", function() {
        buscarSimulacionReniec("estudiante", "dni", {
            nombres: "nombres",
            paterno: "apellido-paterno",
            materno: "apellido-materno",
            fechaNacimiento: "fecha-nacimiento",
            sexo: "genero"
        }, alertaEstudiante);
    });
    document.getElementById("buscar-reniec-apoderado").addEventListener("click", function() {
        buscarSimulacionReniec("apoderado", "ap_dni", {
            nombres: "ap_nombres",
            paterno: "ap-apellido-paterno",
            materno: "ap-apellido-materno",
            sexo: "ap-sexo"
        }, alertaApoderado);
    });

    selectGrado.addEventListener("change", function() {
        if (this.value !== "2" && selectSeccion.value === "B") {
            selectSeccion.value = "A";
        }
        var opcionB = selectSeccion.querySelector('option[value="B"]');
        opcionB.disabled = this.value !== "2";
        if (this.value === "2") {
            opcionB.disabled = false;
        }
    });

    formMatricula.addEventListener("submit", function(evento) {
        evento.preventDefault();
        var idActual = estudianteEnEdicion;
        var dni = document.getElementById("dni").value.trim();
        var edad = edadDesdeFecha(campoFechaNacimiento.value);
        var dniDuplicado = matriculas.some(function(estudiante) {
            return estudiante.dni === dni && estudiante.id !== idActual;
        });
        if (dniDuplicado) {
            mostrarAlertaMatricula(alertaEstudiante, "Ya existe un estudiante registrado con ese DNI.", "error");
            return;
        }
        if (edad === "" || edad > 120) {
            mostrarAlertaMatricula(alertaEstudiante, "Verifique la fecha de nacimiento para calcular una edad válida.", "error");
            return;
        }
        var grado = selectGrado.value;
        var seccion = selectSeccion.value;
        if (seccion === "B" && grado !== "2") {
            mostrarAlertaMatricula(alertaEstudiante, "La sección B solo está disponible para 2º de secundaria.", "error");
            return;
        }
        var registro = {
            id: idActual || siguienteId(matriculas, "E"),
            codigoModular: document.getElementById("codigo-modular").value.trim(),
            nombres: document.getElementById("nombres").value.trim(),
            apellidoPaterno: document.getElementById("apellido-paterno").value.trim(),
            apellidoMaterno: document.getElementById("apellido-materno").value.trim(),
            dni: dni,
            fechaNacimiento: campoFechaNacimiento.value,
            edad: edad,
            genero: document.getElementById("genero").value,
            historialEnfermedades: document.getElementById("historial-enfermedades").value.trim(),
            celular: document.getElementById("celular-estudiante").value.trim(),
            procedencia: document.getElementById("procedencia-estudiante").value.trim(),
            grado: grado,
            seccion: seccion,
            fecha: idActual ? (matriculas.find(function(item) { return item.id === idActual; }).fecha || fechaHoy.split("-").reverse().join("/")) : fechaHoy.split("-").reverse().join("/"),
            periodo: "2026 - I",
            sincronizadoSiagie: false
        };
        if (idActual) {
            var indice = matriculas.findIndex(function(estudiante) { return estudiante.id === idActual; });
            matriculas[indice] = registro;
        } else {
            matriculas.push(registro);
        }
        sincronizarReportesMatricula();
        actualizarDashboard();
        actualizarListasMatricula();
        limpiarEdicionEstudiante();
        cerrarDialogo(document.getElementById("dialog-registrar-estudiante"));
        mostrarAlertaMatricula(alertaEstudiante, idActual ? "Cambios del estudiante guardados." : "Estudiante matriculado correctamente.", "exito");
    });

    formApoderado.addEventListener("submit", function(evento) {
        evento.preventDefault();
        var idActual = apoderadoEnEdicion;
        var dni = document.getElementById("ap_dni").value.trim();
        if (apoderados.some(function(apoderado) { return apoderado.dni === dni && apoderado.id !== idActual; })) {
            mostrarAlertaMatricula(alertaApoderado, "Ya existe un apoderado registrado con ese DNI.", "error");
            return;
        }
        var registro = {
            id: idActual || siguienteId(apoderados, "P"),
            nombres: document.getElementById("ap_nombres").value.trim(),
            apellidoPaterno: document.getElementById("ap-apellido-paterno").value.trim(),
            apellidoMaterno: document.getElementById("ap-apellido-materno").value.trim(),
            dni: dni,
            sexo: document.getElementById("ap-sexo").value,
            celular: document.getElementById("ap_telefono").value.trim(),
            procedencia: document.getElementById("ap-procedencia").value.trim()
        };
        if (idActual) {
            var indice = apoderados.findIndex(function(apoderado) { return apoderado.id === idActual; });
            apoderados[indice] = registro;
        } else {
            apoderados.push(registro);
        }
        actualizarListasMatricula();
        limpiarEdicionApoderado();
        cerrarDialogo(document.getElementById("dialog-registrar-apoderado"));
        mostrarAlertaMatricula(alertaApoderado, idActual ? "Cambios del apoderado guardados." : "Apoderado registrado correctamente.", "exito");
    });

    formAsociacion.addEventListener("submit", function(evento) {
        evento.preventDefault();
        var estudianteId = document.getElementById("asociacion-estudiante").value;
        var apoderadoId = document.getElementById("asociacion-apoderado").value;
        var duplicada = asociaciones.some(function(asociacion) {
            return asociacion.estudianteId === estudianteId && asociacion.apoderadoId === apoderadoId && asociacion.id !== asociacionEnEdicion;
        });
        if (duplicada) {
            mostrarAlertaMatricula(alertaAsociacion, "Esta asociación ya existe.", "error");
            return;
        }
        var estabaEditando = Boolean(asociacionEnEdicion);
        var registro = {
            id: asociacionEnEdicion || siguienteId(asociaciones, "R"),
            estudianteId: estudianteId,
            apoderadoId: apoderadoId,
            parentesco: document.getElementById("asociacion-parentesco").value,
            fecha: document.getElementById("asociacion-fecha").value,
            observacion: document.getElementById("asociacion-observacion").value.trim()
        };
        if (asociacionEnEdicion) {
            var indice = asociaciones.findIndex(function(asociacion) { return asociacion.id === asociacionEnEdicion; });
            asociaciones[indice] = registro;
        } else {
            asociaciones.push(registro);
        }
        actualizarListasMatricula();
        limpiarEdicionAsociacion();
        cerrarDialogo(document.getElementById("dialog-registrar-asociacion"));
        mostrarAlertaMatricula(alertaAsociacion, estabaEditando ? "Asociación actualizada." : "Estudiante y apoderado asociados correctamente.", "exito");
    });

    function manejarAccionesTabla(evento, tipo) {
        var boton = evento.target.closest("button[data-accion]");
        if (!boton) {
            return;
        }
        var fila = boton.closest("tr");
        var accion = boton.dataset.accion;
        if (tipo === "estudiante") {
            var estudiante = matriculas.find(function(item) { return item.id === textoCeldaId(fila); });
            if (!estudiante) {
                return;
            }
            if (accion === "consultar") {
                consultarRegistro("Detalle del estudiante", estudiante, true);
            } else if (accion === "editar") {
                iniciarEdicionEstudiante(estudiante);
            } else if (accion === "eliminar" && window.confirm("¿Eliminar la matrícula de " + nombreCompleto(estudiante) + "?")) {
                matriculas = matriculas.filter(function(item) { return item.id !== estudiante.id; });
                asociaciones = asociaciones.filter(function(item) { return item.estudianteId !== estudiante.id; });
                sincronizarReportesMatricula();
                actualizarDashboard();
                actualizarListasMatricula();
                mostrarAlertaMatricula(alertaEstudiante, "Estudiante y sus asociaciones eliminados.", "exito");
            } else if (accion === "enviar") {
                estudiante.sincronizadoSiagie = true;
                renderizarEstudiantes();
                mostrarAlertaMatricula(alertaEstudiante, "Simulación SIAGIE exitosa: datos de " + estudiante.id + " enviados correctamente. No se realizó una conexión real.", "exito");
            }
        } else if (tipo === "apoderado") {
            var apoderado = apoderados.find(function(item) { return item.id === textoCeldaId(fila); });
            if (!apoderado) {
                return;
            }
            if (accion === "consultar") {
                consultarRegistro("Detalle del apoderado", apoderado, true);
            } else if (accion === "editar") {
                iniciarEdicionApoderado(apoderado);
            } else if (accion === "eliminar" && window.confirm("¿Eliminar el registro de " + nombreCompleto(apoderado) + "?")) {
                apoderados = apoderados.filter(function(item) { return item.id !== apoderado.id; });
                asociaciones = asociaciones.filter(function(item) { return item.apoderadoId !== apoderado.id; });
                actualizarListasMatricula();
                mostrarAlertaMatricula(alertaApoderado, "Apoderado y sus asociaciones eliminados.", "exito");
            }
        } else {
            var asociacion = asociaciones.find(function(item) { return item.id === fila.dataset.id; });
            if (!asociacion) {
                return;
            }
            if (accion === "consultar") {
                consultarRegistro("Detalle de la asociación", asociacion, false);
            } else if (accion === "editar") {
                iniciarEdicionAsociacion(asociacion);
            } else if (accion === "eliminar" && window.confirm("¿Eliminar esta asociación?")) {
                asociaciones = asociaciones.filter(function(item) { return item.id !== asociacion.id; });
                actualizarListasMatricula();
                mostrarAlertaMatricula(alertaAsociacion, "Asociación eliminada.", "exito");
            }
        }
    }

    function textoCeldaId(fila) {
        return fila.cells[0].textContent;
    }

    tablaEstudiantes.addEventListener("click", function(evento) { manejarAccionesTabla(evento, "estudiante"); });
    tablaApoderados.addEventListener("click", function(evento) { manejarAccionesTabla(evento, "apoderado"); });
    tablaRelaciones.addEventListener("click", function(evento) { manejarAccionesTabla(evento, "asociacion"); });

    document.getElementById("sincronizar-siagie").addEventListener("click", function() {
        var pendientes = matriculas.filter(function(estudiante) { return !estudiante.sincronizadoSiagie; });
        pendientes.forEach(function(estudiante) { estudiante.sincronizadoSiagie = true; });
        renderizarEstudiantes();
        mostrarAlertaMatricula(
            alertaEstudiante,
            pendientes.length
                ? "Simulación SIAGIE exitosa: " + pendientes.length + " registro(s) enviados. No se realizó una conexión real."
                : "No hay registros pendientes por simular.",
            "exito"
        );
    });

    document.getElementById("cancelar-edicion-estudiante").addEventListener("click", function() {
        limpiarEdicionEstudiante();
        cerrarDialogo(document.getElementById("dialog-registrar-estudiante"));
    });
    document.getElementById("cancelar-edicion-apoderado").addEventListener("click", function() {
        limpiarEdicionApoderado();
        cerrarDialogo(document.getElementById("dialog-registrar-apoderado"));
    });
    document.getElementById("cancelar-edicion-asociacion").addEventListener("click", function() {
        limpiarEdicionAsociacion();
        cerrarDialogo(document.getElementById("dialog-registrar-asociacion"));
    });

    ["dialog-registrar-estudiante", "dialog-registrar-apoderado", "dialog-registrar-asociacion"].forEach(function(idDialogo) {
        var dialogoMatricula = document.getElementById(idDialogo);
        if (dialogoMatricula) {
            dialogoMatricula.addEventListener("close", function() {
                if (idDialogo === "dialog-registrar-estudiante") {
                    limpiarEdicionEstudiante();
                    ocultarAlertaMatricula(alertaEstudiante);
                }
                if (idDialogo === "dialog-registrar-apoderado") {
                    limpiarEdicionApoderado();
                    ocultarAlertaMatricula(alertaApoderado);
                }
                if (idDialogo === "dialog-registrar-asociacion") {
                    limpiarEdicionAsociacion();
                    ocultarAlertaMatricula(alertaAsociacion);
                }
            });
        }
    });
    document.getElementById("buscar-estudiante-tabla").addEventListener("click", renderizarEstudiantes);
    document.getElementById("filtro-grado").addEventListener("change", renderizarEstudiantes);
    document.getElementById("filtro-sexo-estudiante").addEventListener("change", renderizarEstudiantes);
    document.getElementById("buscar-apoderado-tabla").addEventListener("click", renderizarApoderados);
    document.getElementById("filtro-sexo-apoderado").addEventListener("change", renderizarApoderados);
    document.getElementById("buscar-estudiante-asociacion-btn").addEventListener("click", renderizarOpcionesAsociacion);
    document.getElementById("buscar-apoderado-asociacion-btn").addEventListener("click", renderizarOpcionesAsociacion);
    document.getElementById("buscar-asociacion-tabla").addEventListener("click", renderizarAsociaciones);

    [
        ["filtro-estudiante", "buscar-estudiante-tabla"],
        ["filtro-apoderado", "buscar-apoderado-tabla"],
        ["buscar-estudiante-asociacion", "buscar-estudiante-asociacion-btn"],
        ["buscar-apoderado-asociacion", "buscar-apoderado-asociacion-btn"],
        ["filtro-asociacion", "buscar-asociacion-tabla"]
    ].forEach(function(camposBusqueda) {
        document.getElementById(camposBusqueda[0]).addEventListener("keydown", function(evento) {
            if (evento.key === "Enter") {
                evento.preventDefault();
                document.getElementById(camposBusqueda[1]).click();
            }
        });
    });

    // Los registros iniciales son demostrativos y se muestran como pendientes de sincronización.
    matriculas.forEach(function(estudiante) {
        estudiante.sincronizadoSiagie = false;
        estudiante.edad = Number.parseInt(estudiante.edad, 10) || "";
    });
    actualizarListasMatricula();
    actualizarDashboardInicio();
});
