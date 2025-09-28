-- ========================================
-- INSERT SCRIPTS FOR TECNOLOGIAS MOVILES DATABASE
-- Generated for MySQL
-- Date: 2025-09-27
-- ========================================

USE `tecnologiasmoviles`;

-- Disable foreign key checks temporarily for easier insertion
SET FOREIGN_KEY_CHECKS = 0;

-- ========================================
-- BASIC TABLES (No Foreign Keys)
-- ========================================

-- Table: alergia
INSERT INTO `alergia` (`idalergia`, `nombrealergia`, `descripcionAlergia`) VALUES
(1, 'Penicilina', 'Alergia a antibióticos del grupo penicilina'),
(2, 'Polen', 'Alergia estacional al polen de árboles y flores'),
(3, 'Frutos secos', 'Alergia a almendras, nueces, avellanas'),
(4, 'Lactosa', 'Intolerancia a productos lácteos'),
(5, 'Gluten', 'Celiaquía o sensibilidad al gluten');

-- Table: cliente
INSERT INTO `cliente` (`idcliente`, `cliente`) VALUES
(1, 'Hospital Regional de Los Ángeles'),
(2, 'Clínica Santa María'),
(3, 'Centro Médico Universidad Católica'),
(4, 'Hospital Salvador'),
(5, 'Clínica Las Condes');

-- Table: cronico
INSERT INTO `cronico` (`idcronico`, `enfermedadcronica`) VALUES
(1, 'Diabetes Mellitus Tipo 2'),
(2, 'Hipertensión Arterial'),
(3, 'Asma Bronquial'),
(4, 'Artritis Reumatoide'),
(5, 'Enfermedad Renal Crónica');

-- Table: diagnostico
INSERT INTO `diagnostico` (`iddiagnostico`, `diagnostico`) VALUES
(1, 'Infección respiratoria aguda'),
(2, 'Gastroenteritis viral'),
(3, 'Fractura de radio distal'),
(4, 'Migraña común'),
(5, 'Hipertensión arterial esencial');

-- Table: especialidad
INSERT INTO `especialidad` (`idespecialidad`, `especialidad`) VALUES
(1, 'Medicina General'),
(2, 'Cardiología'),
(3, 'Traumatología'),
(4, 'Neurología'),
(5, 'Gastroenterología');

-- Table: intervencion
INSERT INTO `intervencion` (`idintervencion`, `intervencion`) VALUES
(1, 'Sutura de herida menor'),
(2, 'Reducción cerrada de fractura'),
(3, 'Drenaje de absceso'),
(4, 'Infiltración articular'),
(5, 'Electrocardiograma');

-- Table: medicamento
INSERT INTO `medicamento` (`idmedicamento`, `medicamento`) VALUES
(1, 'Amoxicilina 500mg'),
(2, 'Ibuprofeno 400mg'),
(3, 'Paracetamol 500mg'),
(4, 'Enalapril 10mg'),
(5, 'Metformina 850mg');

-- Table: metodo
INSERT INTO `metodo` (`idmetodo`, `nombremetodo`) VALUES
(1, 'Espectrofotometría'),
(2, 'Inmunoquímica'),
(3, 'Cromatografía'),
(4, 'Microscopia'),
(5, 'PCR');

-- Table: operacion
INSERT INTO `operacion` (`idoperacion`, `operacion`) VALUES
(1, 'Apendicectomía laparoscópica'),
(2, 'Colecistectomía'),
(3, 'Herniorrafia inguinal'),
(4, 'Artroscopia de rodilla'),
(5, 'Cesárea');

-- Table: paciente
INSERT INTO `paciente` (`idpaciente`, `nombrePaciente`, `rut`, `fechaNacimiento`, `sexo`, `direccion`) VALUES
(1, 'María González López', '12345678-9', '1985-03-15', 'Femenino', 'Av. Libertador 1234, Santiago'),
(2, 'Juan Carlos Pérez', '98765432-1', '1978-07-22', 'Masculino', 'Calle Los Aromos 567, Valparaíso'),
(3, 'Ana María Silva', '11223344-5', '1992-11-08', 'Femenino', 'Pasaje Las Flores 89, Concepción'),
(4, 'Roberto Martínez', '55667788-2', '1965-01-30', 'Masculino', 'Av. Brasil 2345, Viña del Mar'),
(5, 'Carolina Fernández', '99887766-3', '1988-09-12', 'Femenino', 'Los Pinos 456, La Serena');

-- Table: servicio
INSERT INTO `servicio` (`idservicio`, `servicio`) VALUES
(1, 'Consulta Externa'),
(2, 'Urgencias'),
(3, 'Hospitalización'),
(4, 'Cirugía Ambulatoria'),
(5, 'Laboratorio Clínico');

-- Table: sucursal
INSERT INTO `sucursal` (`idsucursal`, `sucursal`) VALUES
(1, 'Sucursal Centro'),
(2, 'Sucursal Las Condes'),
(3, 'Sucursal Maipú'),
(4, 'Sucursal Valparaíso'),
(5, 'Sucursal Concepción');

-- Table: tipoexamen
INSERT INTO `tipoexamen` (`idtipoexamen`, `nombreTipoExamen`) VALUES
(1, 'Hemograma Completo'),
(2, 'Perfil Lipídico'),
(3, 'Glicemia'),
(4, 'Función Renal'),
(5, 'Función Hepática');

-- Table: tipomuestra
INSERT INTO `tipomuestra` (`idtipomuestra`, `tipomuestra`) VALUES
(1, 'Sangre'),
(2, 'Orina'),
(3, 'Heces'),
(4, 'Saliva'),
(5, 'Líquido cefalorraquídeo');

-- Table: tiposangre
INSERT INTO `tiposangre` (`idtiposangre`, `tipoSangre`) VALUES
(1, 'O+'),
(2, 'O-'),
(3, 'A+'),
(4, 'A-'),
(5, 'B+'),
(6, 'B-'),
(7, 'AB+'),
(8, 'AB-');

-- ========================================
-- TABLES WITH FOREIGN KEYS
-- ========================================

-- Table: profesional (depends on especialidad)
INSERT INTO `profesional` (`idprofesional`, `idespecialidad`, `nombreprofesional`, `rut`) VALUES
(1, 1, 'Dr. Carlos Mendoza', '15555666-7'),
(2, 2, 'Dra. Patricia Rojas', '16666777-8'),
(3, 3, 'Dr. Miguel Sánchez', '17777888-9'),
(4, 4, 'Dra. Isabel Vargas', '18888999-0'),
(5, 1, 'Dr. Fernando López', '19999000-1');

-- Table: consulta (depends on servicio and profesional)
INSERT INTO `consulta` (`idconsulta`, `idservicio`, `idprofesional`, `fecha`) VALUES
(1, 1, 1, '2025-09-20'),
(2, 2, 2, '2025-09-21'),
(3, 1, 3, '2025-09-22'),
(4, 1, 4, '2025-09-23'),
(5, 2, 5, '2025-09-24');

-- Table: muestra (depends on tipomuestra and metodo)
INSERT INTO `muestra` (`idmuestra`, `idtipomuestra`, `idmetodo`, `nombremuestra`, `unidad`, `valorSuperior`, `valorInferior`) VALUES
(1, 1, 1, 'Hemoglobina', 'g/dL', 16.0, 12.0),
(2, 1, 2, 'Glucosa', 'mg/dL', 110.0, 70.0),
(3, 2, 3, 'Creatinina', 'mg/dL', 1.2, 0.6),
(4, 1, 1, 'Colesterol Total', 'mg/dL', 200.0, 150.0),
(5, 1, 4, 'Leucocitos', 'cel/uL', 10000.0, 4000.0);

-- Table: examenmedico (depends on tipoexamen, tiposangre, sucursal, cliente)
INSERT INTO `examenmedico` (`idexamen`, `idtipoexamen`, `idtiposangre`, `idsucursal`, `idcliente`, `tomamuestra`, `recepcion`) VALUES
(1, 1, 1, 1, 1, '2025-09-20 08:30:00', '2025-09-20 09:00:00'),
(2, 2, 3, 2, 2, '2025-09-21 10:15:00', '2025-09-21 10:45:00'),
(3, 3, 2, 1, 1, '2025-09-22 14:20:00', '2025-09-22 14:50:00'),
(4, 4, 5, 3, 3, '2025-09-23 11:30:00', '2025-09-23 12:00:00'),
(5, 5, 4, 2, 2, '2025-09-24 16:45:00', '2025-09-24 17:15:00');

-- Table: fichamedica (depends on paciente and consulta)
INSERT INTO `fichamedica` (`idfichamedica`, `idpaciente`, `idconsulta`, `fechaingreso`) VALUES
(1, 1, 1, '2025-09-20'),
(2, 2, 2, '2025-09-21'),
(3, 3, 3, '2025-09-22'),
(4, 4, 4, '2025-09-23'),
(5, 5, 5, '2025-09-24');

-- ========================================
-- RELATIONSHIP TABLES (Many-to-Many)
-- ========================================

-- Table: consultadiagnostico (depends on consulta and diagnostico)
INSERT INTO `consultadiagnostico` (`idconsulta`, `iddiagnostico`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(1, 5); -- Una consulta puede tener múltiples diagnósticos

-- Table: consultaintervencion (depends on consulta and intervencion)
INSERT INTO `consultaintervencion` (`idconsulta`, `idintervencion`) VALUES
(1, 5),
(2, 1),
(3, 2),
(4, 5),
(5, 3);

-- Table: fichaalergia (depends on alergia and fichamedica)
INSERT INTO `fichaalergia` (`idalergia`, `idfichamedica`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(1, 3); -- Un paciente puede tener múltiples alergias

-- Table: fichacronico (depends on cronico and fichamedica)
INSERT INTO `fichacronico` (`idcronico`, `idfichamedica`) VALUES
(1, 4),
(2, 5),
(3, 2),
(1, 5), -- Un paciente puede tener múltiples enfermedades crónicas
(2, 4);

-- Table: fichaoperacion (depends on operacion and fichamedica)
INSERT INTO `fichaoperacion` (`idoperacion`, `idfichamedica`) VALUES
(3, 3),
(4, 4),
(1, 2);

-- Table: receta (depends on consulta and medicamento)
INSERT INTO `receta` (`idconsulta`, `idmedicamento`) VALUES
(1, 1),
(1, 3), -- Una consulta puede tener múltiples medicamentos
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Table: resultado (depends on muestra and examenmedico)
INSERT INTO `resultado` (`idmuestra`, `idexamen`, `resultado`) VALUES
(1, 1, '14.5'),
(2, 3, '95'),
(3, 4, '0.9'),
(4, 2, '185'),
(5, 1, '7500');

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Uncomment the following lines to verify the data insertion:

-- SELECT 'alergia' as tabla, COUNT(*) as registros FROM alergia
-- UNION ALL SELECT 'cliente', COUNT(*) FROM cliente
-- UNION ALL SELECT 'consulta', COUNT(*) FROM consulta
-- UNION ALL SELECT 'consultadiagnostico', COUNT(*) FROM consultadiagnostico
-- UNION ALL SELECT 'consultaintervencion', COUNT(*) FROM consultaintervencion
-- UNION ALL SELECT 'cronico', COUNT(*) FROM cronico
-- UNION ALL SELECT 'diagnostico', COUNT(*) FROM diagnostico
-- UNION ALL SELECT 'especialidad', COUNT(*) FROM especialidad
-- UNION ALL SELECT 'examenmedico', COUNT(*) FROM examenmedico
-- UNION ALL SELECT 'fichaalergia', COUNT(*) FROM fichaalergia
-- UNION ALL SELECT 'fichacronico', COUNT(*) FROM fichacronico
-- UNION ALL SELECT 'fichamedica', COUNT(*) FROM fichamedica
-- UNION ALL SELECT 'fichaoperacion', COUNT(*) FROM fichaoperacion
-- UNION ALL SELECT 'intervencion', COUNT(*) FROM intervencion
-- UNION ALL SELECT 'medicamento', COUNT(*) FROM medicamento
-- UNION ALL SELECT 'metodo', COUNT(*) FROM metodo
-- UNION ALL SELECT 'muestra', COUNT(*) FROM muestra
-- UNION ALL SELECT 'operacion', COUNT(*) FROM operacion
-- UNION ALL SELECT 'paciente', COUNT(*) FROM paciente
-- UNION ALL SELECT 'profesional', COUNT(*) FROM profesional
-- UNION ALL SELECT 'receta', COUNT(*) FROM receta
-- UNION ALL SELECT 'resultado', COUNT(*) FROM resultado
-- UNION ALL SELECT 'servicio', COUNT(*) FROM servicio
-- UNION ALL SELECT 'sucursal', COUNT(*) FROM sucursal
-- UNION ALL SELECT 'tipoexamen', COUNT(*) FROM tipoexamen
-- UNION ALL SELECT 'tipomuestra', COUNT(*) FROM tipomuestra
-- UNION ALL SELECT 'tiposangre', COUNT(*) FROM tiposangre;

-- ========================================
-- END OF INSERT SCRIPT
-- ========================================