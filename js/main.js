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
        nombre: "Dra. Iris Saavedra",
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