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
    var botonGuardarAsistencia = document.getElementById("guardar-asistencia");
    var botonCancelarEdicionAsistencia = document.getElementById("cancelar-edicion-asistencia");
    var mensajeDocente = document.getElementById("mensaje-docente");
    var mensajeAsistencia = document.getElementById("mensaje-asistencia");
    var botonSeleccionarArchivo = document.getElementById("seleccionar-archivo-justificacion");
    var seleccionHorario = document.getElementById("docente-horario");
    var gradoHorario = document.getElementById("grado-horario");
    var seccionHorario = document.getElementById("seccion-horario");
    var mensajeHorarioDocente = document.getElementById("mensaje-horario-docente");
    var contenedorTablaHorario = document.getElementById("tabla-horario-docente-contenedor");
    var tituloHorarioDocente = document.getElementById("titulo-horario-docente");
    var tablaHorarioDocente = document.getElementById("tabla-horario-docente");
    var datosDocenteHorario = document.getElementById("datos-docente-horario");
    var nombreDocenteHorario = document.getElementById("nombre-docente-horario");
    var dniDocenteHorario = document.getElementById("dni-docente-horario");
    var areaDocenteHorario = document.getElementById("area-docente-horario");
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
    var horasHorario = ["08:00 - 09:30", "10:00 - 11:30"];
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

    function obtenerHorarioAula(aula) {
        var registros = [];
        diasHorario.forEach(function(dia, indiceDia) {
            horasHorario.forEach(function(hora, indiceBloque) {
                var indiceAsignatura = (aula.indice + indiceDia + indiceBloque) % asignaturasHorario.length;
                var clase = asignaturasHorario[indiceAsignatura];
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

    function renderizarHorario(registros, titulo, docenteSeleccionadoHorario) {
        tablaHorarioDocente.textContent = "";
        tituloHorarioDocente.textContent = titulo;
        datosDocenteHorario.classList.toggle("oculto", !docenteSeleccionadoHorario);
        if (docenteSeleccionadoHorario) {
            nombreDocenteHorario.textContent = docenteSeleccionadoHorario.docente;
            dniDocenteHorario.textContent = docenteSeleccionadoHorario.dni;
            areaDocenteHorario.textContent = docenteSeleccionadoHorario.area;
        }
        registros.forEach(function(clase) {
            var fila = document.createElement("tr");
            [
                clase.dia,
                clase.hora,
                clase.grado,
                clase.seccion,
                clase.asignatura,
                clase.docente,
                clase.dni,
                clase.area
            ].forEach(function(valor) {
                var celda = document.createElement("td");
                celda.textContent = valor;
                fila.appendChild(celda);
            });
            tablaHorarioDocente.appendChild(fila);
        });
        mensajeHorarioDocente.textContent = "";
        contenedorTablaHorario.classList.remove("oculto");
    }

    function mostrarOpcionesDocenteHorario() {
        asignaturasHorario.forEach(function(clase) {
            var opcion = document.createElement("option");
            opcion.value = clase.docente;
            opcion.textContent = clase.docente + " — " + clase.area;
            seleccionHorario.appendChild(opcion);
        });
    }

    function actualizarSeccionesHorario() {
        var seccionesPorGrado = {
            "1": ["A"],
            "2": ["A", "B"],
            "3": ["A"],
            "4": ["A"],
            "5": ["A"]
        };
        seccionHorario.textContent = "";
        var opcionInicial = document.createElement("option");
        opcionInicial.value = "";
        opcionInicial.textContent = gradoHorario.value
            ? "Seleccione una sección..."
            : "Seleccione primero un grado...";
        seccionHorario.appendChild(opcionInicial);
        seccionHorario.disabled = !gradoHorario.value;

        (seccionesPorGrado[gradoHorario.value] || []).forEach(function(seccion) {
            var opcion = document.createElement("option");
            opcion.value = seccion;
            opcion.textContent = seccion;
            seccionHorario.appendChild(opcion);
        });
    }

    function consultarHorarioPorAula() {
        seleccionHorario.value = "";
        contenedorTablaHorario.classList.add("oculto");
        datosDocenteHorario.classList.add("oculto");
        if (!gradoHorario.value || !seccionHorario.value) {
            mensajeHorarioDocente.textContent = "Seleccione un grado y sección o un docente.";
            return;
        }

        var aula = aulasHorario.filter(function(item) {
            return item.grado === gradoHorario.value && item.seccion === seccionHorario.value;
        })[0];
        if (!aula) {
            mensajeHorarioDocente.textContent = "No hay un horario disponible para esta aula.";
            return;
        }
        renderizarHorario(
            obtenerHorarioAula(aula),
            "Horario semanal — " + gradoHorario.options[gradoHorario.selectedIndex].text + ", sección " + aula.seccion
        );
    }

    function consultarHorarioPorDocente() {
        gradoHorario.value = "";
        actualizarSeccionesHorario();
        contenedorTablaHorario.classList.add("oculto");
        datosDocenteHorario.classList.add("oculto");
        if (!seleccionHorario.value) {
            mensajeHorarioDocente.textContent = "Seleccione un grado y sección o un docente.";
            return;
        }

        var registros = [];
        aulasHorario.forEach(function(aula) {
            obtenerHorarioAula(aula).forEach(function(clase) {
                if (clase.docente === seleccionHorario.value) {
                    registros.push(clase);
                }
            });
        });
        registros.sort(function(a, b) {
            return diasHorario.indexOf(a.dia) - diasHorario.indexOf(b.dia) ||
                horasHorario.indexOf(a.hora) - horasHorario.indexOf(b.hora);
        });
        var datosDocente = asignaturasHorario.filter(function(clase) {
            return clase.docente === seleccionHorario.value;
        })[0];
        renderizarHorario(
            registros,
            "Horario semanal de " + datosDocente.docente + " — " + datosDocente.area,
            datosDocente
        );
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
        resultadosBusquedaDocente.textContent = "";
        seleccionDocente.value = "";
        docenteAsistenciaSeleccionado.textContent = "No hay docente seleccionado";
        if (!termino) {
            resultadosBusquedaDocente.classList.add("oculto");
            return;
        }

        var docentesFiltrados = docentes.filter(function(docente) {
            var nombres = normalizarBusquedaDocente(docente.nombres);
            var apellidos = normalizarBusquedaDocente(docente.apellidos);
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
        formularioAsistencia.scrollIntoView({ behavior: "smooth", block: "start" });
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
    gradoHorario.addEventListener("change", function() {
        seleccionHorario.value = "";
        actualizarSeccionesHorario();
        contenedorTablaHorario.classList.add("oculto");
        datosDocenteHorario.classList.add("oculto");
        mensajeHorarioDocente.textContent = "Seleccione una sección para consultar el horario.";
    });
    seccionHorario.addEventListener("change", consultarHorarioPorAula);
    seleccionHorario.addEventListener("change", consultarHorarioPorDocente);
    formularioAsistencia.addEventListener("submit", registrarAsistencia);

    mostrarDocentes();
    mostrarOpcionesDocenteHorario();
    actualizarSeccionesHorario();
    establecerFechaHoraPredeterminada();
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
            if (selectTipo) { selectTipo.value = "diaria"; }
            if (selectMes) { selectMes.value = "Marzo"; }
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
                diaria: { columnas: ["ID", "Docente", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Asistencia total"], campos: ["id", "docente", "lunes", "martes", "miercoles", "jueves", "viernes", "porcentaje"] },
                semanal: { columnas: ["ID", "Docente", "Semana 1", "Semana 2", "Semana 3", "Semana 4", "Asistencia total"], campos: ["id", "docente", "semana1", "semana2", "semana3", "semana4", "total"] }
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
        return String(texto).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
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
            var total = semanas.reduce(function(suma, valor) { return suma + valor; }, 0) / semanas.length;

            return {
                id: dato.id, docente: dato.docente, semana1: dato.semana1 + "%", semana2: dato.semana2 + "%", semana3: dato.semana3 + "%", semana4: dato.semana4 + "%", total: Math.round(total) + "%"
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

    // ==========================================
    // --- LÓGICA FINAL DE MATRÍCULA Y APODERADOS ---
    // ==========================================
    
    // 1. Habilitar Sección B solo para 2do grado
    const selectGrado = document.getElementById("grado");
    const selectSeccion = document.getElementById("seccion");

    if (selectGrado && selectSeccion) {
        selectGrado.addEventListener("change", function() {
            if (this.value === "2") {
                selectSeccion.disabled = false;
                selectSeccion.value = "B"; 
            } else {
                selectSeccion.value = "A"; 
                selectSeccion.disabled = true; 
            }
        });
    }

    // 2. Validaciones del formulario de matrícula (Estudiantes)
    const formMatriculaValidacion = document.getElementById("matricula-form");
    const cajaAlertaValidacion = document.getElementById("alerta");

    if (formMatriculaValidacion) {
        formMatriculaValidacion.addEventListener("submit", function(evento) {
            evento.preventDefault();
            
            let dni = document.getElementById("dni").value;
            let grado = document.getElementById("grado").value;
            let seccion = document.getElementById("seccion").value;

            if (dni.length !== 8) {
                cajaAlertaValidacion.innerHTML = "Error: El DNI debe tener exactamente 8 números.";
                cajaAlertaValidacion.className = "error"; 
                cajaAlertaValidacion.classList.remove("oculto"); 
                return;
            }

            if (seccion === "B" && grado !== "2") {
                cajaAlertaValidacion.innerHTML = "Error: La sección B solo está disponible para 2º de secundaria.";
                cajaAlertaValidacion.className = "error"; 
                cajaAlertaValidacion.classList.remove("oculto"); 
                return;
            }
            
            cajaAlertaValidacion.innerHTML = "¡Estudiante matriculado correctamente!";
            cajaAlertaValidacion.className = "exito"; 
            cajaAlertaValidacion.classList.remove("oculto"); 
            
            formMatriculaValidacion.reset();
            selectSeccion.value = "A";
            selectSeccion.disabled = true; 

            setTimeout(() => {
                cajaAlertaValidacion.classList.add("oculto");
            }, 3000);
        });
    }

    // 3. Lógica para el Formulario de Apoderados y Tabla
    const formApoderado = document.getElementById("apoderado-form");
    const alertaApoderado = document.getElementById("alerta-apoderado");
    const tablaRelaciones = document.getElementById("tabla-relaciones");

    if (formApoderado) {
        formApoderado.addEventListener("submit", function(evento) {
            evento.preventDefault();
            
            let apNombres = document.getElementById("ap_nombres").value;
            let apDni = document.getElementById("ap_dni").value;
            let apEstudiante = document.getElementById("ap_estudiante").value;

            if (apDni.length !== 8 || apEstudiante.length !== 8) {
                alertaApoderado.innerHTML = "Error: Los DNI deben tener 8 números.";
                alertaApoderado.className = "error";
                alertaApoderado.classList.remove("oculto");
                return;
            }

            if (tablaRelaciones.querySelector("td[colspan]")) {
                tablaRelaciones.innerHTML = ""; 
            }

            let fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${apNombres}</td>
                <td>${apDni}</td>
                <td>${apEstudiante}</td>
            `;
            tablaRelaciones.appendChild(fila);

            alertaApoderado.innerHTML = "¡Apoderado registrado y asociado correctamente!";
            alertaApoderado.className = "exito";
            alertaApoderado.classList.remove("oculto");

            formApoderado.reset();

            setTimeout(() => {
                alertaApoderado.classList.add("oculto");
            }, 3000);
        });
    }
});