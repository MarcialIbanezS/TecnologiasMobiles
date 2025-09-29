-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: tecnologiasmoviles
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alergia`
--

DROP TABLE IF EXISTS `alergia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alergia` (
  `idalergia` int NOT NULL,
  `nombrealergia` varchar(45) DEFAULT NULL,
  `descripcionAlergia` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idalergia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alergia`
--

LOCK TABLES `alergia` WRITE;
/*!40000 ALTER TABLE `alergia` DISABLE KEYS */;
INSERT INTO `alergia` VALUES (1,'Penicilina','Alergia a antibióticos del grupo penicilina'),(2,'Polen','Alergia estacional al polen de árboles y flores'),(3,'Frutos secos','Alergia a almendras, nueces, avellanas'),(4,'Lactosa','Intolerancia a productos lácteos'),(5,'Gluten','Celiaquía o sensibilidad al gluten');
/*!40000 ALTER TABLE `alergia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `idcliente` int NOT NULL,
  `cliente` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`idcliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,'Hospital Regional de Los Ángeles'),(2,'Clínica Santa María'),(3,'Centro Médico Universidad Católica'),(4,'Hospital Salvador'),(5,'Clínica Las Condes');
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consulta`
--

DROP TABLE IF EXISTS `consulta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consulta` (
  `idconsulta` int NOT NULL,
  `idservicio` int DEFAULT NULL,
  `idprofesional` int DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  PRIMARY KEY (`idconsulta`),
  KEY `idservicio_idx` (`idservicio`),
  KEY `idprofesional_idx` (`idprofesional`),
  CONSTRAINT `consulta_fk1` FOREIGN KEY (`idprofesional`) REFERENCES `profesional` (`idprofesional`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `consulta_fk2` FOREIGN KEY (`idservicio`) REFERENCES `servicio` (`idservicio`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consulta`
--

LOCK TABLES `consulta` WRITE;
/*!40000 ALTER TABLE `consulta` DISABLE KEYS */;
INSERT INTO `consulta` VALUES (1,1,1,'2025-09-20'),(2,2,2,'2025-09-21'),(3,1,3,'2025-09-22'),(4,1,4,'2025-09-23'),(5,2,5,'2025-09-24');
/*!40000 ALTER TABLE `consulta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultadiagnostico`
--

DROP TABLE IF EXISTS `consultadiagnostico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consultadiagnostico` (
  `idconsulta` int NOT NULL,
  `iddiagnostico` int NOT NULL,
  PRIMARY KEY (`idconsulta`,`iddiagnostico`),
  KEY `iddiagnostico_idx` (`iddiagnostico`),
  CONSTRAINT `cd_fk1` FOREIGN KEY (`idconsulta`) REFERENCES `consulta` (`idconsulta`),
  CONSTRAINT `cd_fk2` FOREIGN KEY (`iddiagnostico`) REFERENCES `diagnostico` (`iddiagnostico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultadiagnostico`
--

LOCK TABLES `consultadiagnostico` WRITE;
/*!40000 ALTER TABLE `consultadiagnostico` DISABLE KEYS */;
INSERT INTO `consultadiagnostico` VALUES (1,1),(2,2),(3,3),(4,4),(1,5),(5,5);
/*!40000 ALTER TABLE `consultadiagnostico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultaintervencion`
--

DROP TABLE IF EXISTS `consultaintervencion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consultaintervencion` (
  `idconsulta` int NOT NULL,
  `idintervencion` int NOT NULL,
  PRIMARY KEY (`idconsulta`,`idintervencion`),
  KEY `consultaintervencion_fk2_idx` (`idintervencion`),
  CONSTRAINT `consultaintervencion_fk1` FOREIGN KEY (`idconsulta`) REFERENCES `consulta` (`idconsulta`),
  CONSTRAINT `consultaintervencion_fk2` FOREIGN KEY (`idintervencion`) REFERENCES `intervencion` (`idintervencion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultaintervencion`
--

LOCK TABLES `consultaintervencion` WRITE;
/*!40000 ALTER TABLE `consultaintervencion` DISABLE KEYS */;
INSERT INTO `consultaintervencion` VALUES (2,1),(3,2),(5,3),(1,5),(4,5);
/*!40000 ALTER TABLE `consultaintervencion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cronico`
--

DROP TABLE IF EXISTS `cronico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cronico` (
  `idcronico` int NOT NULL,
  `enfermedadcronica` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`idcronico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cronico`
--

LOCK TABLES `cronico` WRITE;
/*!40000 ALTER TABLE `cronico` DISABLE KEYS */;
INSERT INTO `cronico` VALUES (1,'Diabetes Mellitus Tipo 2'),(2,'Hipertensión Arterial'),(3,'Asma Bronquial'),(4,'Artritis Reumatoide'),(5,'Enfermedad Renal Crónica');
/*!40000 ALTER TABLE `cronico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagnostico`
--

DROP TABLE IF EXISTS `diagnostico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diagnostico` (
  `iddiagnostico` int NOT NULL,
  `diagnostico` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`iddiagnostico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnostico`
--

LOCK TABLES `diagnostico` WRITE;
/*!40000 ALTER TABLE `diagnostico` DISABLE KEYS */;
INSERT INTO `diagnostico` VALUES (1,'Infección respiratoria aguda'),(2,'Gastroenteritis viral'),(3,'Fractura de radio distal'),(4,'Migraña común'),(5,'Hipertensión arterial esencial');
/*!40000 ALTER TABLE `diagnostico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `especialidad`
--

DROP TABLE IF EXISTS `especialidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `especialidad` (
  `idespecialidad` int NOT NULL,
  `especialidad` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idespecialidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `especialidad`
--

LOCK TABLES `especialidad` WRITE;
/*!40000 ALTER TABLE `especialidad` DISABLE KEYS */;
INSERT INTO `especialidad` VALUES (1,'Medicina General'),(2,'Cardiología'),(3,'Traumatología'),(4,'Neurología'),(5,'Gastroenterología');
/*!40000 ALTER TABLE `especialidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `examenmedico`
--

DROP TABLE IF EXISTS `examenmedico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `examenmedico` (
  `idexamen` int NOT NULL,
  `idtipoexamen` int DEFAULT NULL,
  `idtiposangre` int DEFAULT NULL,
  `idsucursal` int DEFAULT NULL,
  `idcliente` int DEFAULT NULL,
  `tomamuestra` datetime DEFAULT NULL,
  `recepcion` datetime DEFAULT NULL,
  PRIMARY KEY (`idexamen`),
  KEY `examen_fk1_idx` (`idtipoexamen`),
  KEY `examen_fk2_idx` (`idtiposangre`),
  KEY `examen_fk3_idx` (`idsucursal`),
  KEY `examen_fk4_idx` (`idcliente`),
  CONSTRAINT `examen_fk1` FOREIGN KEY (`idtipoexamen`) REFERENCES `tipoexamen` (`idtipoexamen`),
  CONSTRAINT `examen_fk2` FOREIGN KEY (`idtiposangre`) REFERENCES `tiposangre` (`idtiposangre`),
  CONSTRAINT `examen_fk3` FOREIGN KEY (`idsucursal`) REFERENCES `sucursal` (`idsucursal`),
  CONSTRAINT `examen_fk4` FOREIGN KEY (`idcliente`) REFERENCES `cliente` (`idcliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `examenmedico`
--

LOCK TABLES `examenmedico` WRITE;
/*!40000 ALTER TABLE `examenmedico` DISABLE KEYS */;
INSERT INTO `examenmedico` VALUES (1,1,1,1,1,'2025-09-20 08:30:00','2025-09-20 09:00:00'),(2,2,3,2,2,'2025-09-21 10:15:00','2025-09-21 10:45:00'),(3,3,2,1,1,'2025-09-22 14:20:00','2025-09-22 14:50:00'),(4,4,5,3,3,'2025-09-23 11:30:00','2025-09-23 12:00:00'),(5,5,4,2,2,'2025-09-24 16:45:00','2025-09-24 17:15:00');
/*!40000 ALTER TABLE `examenmedico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fichaalergia`
--

DROP TABLE IF EXISTS `fichaalergia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fichaalergia` (
  `idalergia` int NOT NULL,
  `idfichamedica` int NOT NULL,
  PRIMARY KEY (`idalergia`,`idfichamedica`),
  KEY `fichaalergias_fk2_idx` (`idfichamedica`),
  CONSTRAINT `fichaalergias_fk1` FOREIGN KEY (`idalergia`) REFERENCES `alergia` (`idalergia`),
  CONSTRAINT `fichaalergias_fk2` FOREIGN KEY (`idfichamedica`) REFERENCES `fichamedica` (`idfichamedica`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fichaalergia`
--

LOCK TABLES `fichaalergia` WRITE;
/*!40000 ALTER TABLE `fichaalergia` DISABLE KEYS */;
INSERT INTO `fichaalergia` VALUES (1,1),(2,2),(1,3),(3,3),(4,4),(5,5);
/*!40000 ALTER TABLE `fichaalergia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fichacronico`
--

DROP TABLE IF EXISTS `fichacronico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fichacronico` (
  `idcronico` int NOT NULL,
  `idfichamedica` int NOT NULL,
  PRIMARY KEY (`idcronico`,`idfichamedica`),
  KEY `fichacronico_fk2_idx` (`idfichamedica`),
  CONSTRAINT `fichacronico_fk1` FOREIGN KEY (`idcronico`) REFERENCES `cronico` (`idcronico`),
  CONSTRAINT `fichacronico_fk2` FOREIGN KEY (`idfichamedica`) REFERENCES `fichamedica` (`idfichamedica`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fichacronico`
--

LOCK TABLES `fichacronico` WRITE;
/*!40000 ALTER TABLE `fichacronico` DISABLE KEYS */;
INSERT INTO `fichacronico` VALUES (3,2),(1,4),(2,4),(1,5),(2,5);
/*!40000 ALTER TABLE `fichacronico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fichamedica`
--

DROP TABLE IF EXISTS `fichamedica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fichamedica` (
  `idfichamedica` int NOT NULL,
  `idpaciente` int DEFAULT NULL,
  `idconsulta` int DEFAULT NULL,
  `fechaingreso` date DEFAULT NULL,
  PRIMARY KEY (`idfichamedica`),
  KEY `fichamedica_fk1_idx` (`idpaciente`),
  KEY `fichamedica_fk2_idx` (`idconsulta`),
  CONSTRAINT `fichamedica_fk1` FOREIGN KEY (`idpaciente`) REFERENCES `paciente` (`idpaciente`),
  CONSTRAINT `fichamedica_fk2` FOREIGN KEY (`idconsulta`) REFERENCES `consulta` (`idconsulta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fichamedica`
--

LOCK TABLES `fichamedica` WRITE;
/*!40000 ALTER TABLE `fichamedica` DISABLE KEYS */;
INSERT INTO `fichamedica` VALUES (1,1,1,'2025-09-20'),(2,2,2,'2025-09-21'),(3,3,3,'2025-09-22'),(4,4,4,'2025-09-23'),(5,5,5,'2025-09-24');
/*!40000 ALTER TABLE `fichamedica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fichaoperacion`
--

DROP TABLE IF EXISTS `fichaoperacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fichaoperacion` (
  `idoperacion` int NOT NULL,
  `idfichamedica` int NOT NULL,
  PRIMARY KEY (`idoperacion`,`idfichamedica`),
  KEY `fichaoperacion_fk2_idx` (`idfichamedica`),
  CONSTRAINT `fichaoperacion_fk1` FOREIGN KEY (`idoperacion`) REFERENCES `operacion` (`idoperacion`),
  CONSTRAINT `fichaoperacion_fk2` FOREIGN KEY (`idfichamedica`) REFERENCES `fichamedica` (`idfichamedica`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fichaoperacion`
--

LOCK TABLES `fichaoperacion` WRITE;
/*!40000 ALTER TABLE `fichaoperacion` DISABLE KEYS */;
INSERT INTO `fichaoperacion` VALUES (1,2),(3,3),(4,4);
/*!40000 ALTER TABLE `fichaoperacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `intervencion`
--

DROP TABLE IF EXISTS `intervencion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `intervencion` (
  `idintervencion` int NOT NULL,
  `intervencion` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idintervencion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `intervencion`
--

LOCK TABLES `intervencion` WRITE;
/*!40000 ALTER TABLE `intervencion` DISABLE KEYS */;
INSERT INTO `intervencion` VALUES (1,'Sutura de herida menor'),(2,'Reducción cerrada de fractura'),(3,'Drenaje de absceso'),(4,'Infiltración articular'),(5,'Electrocardiograma');
/*!40000 ALTER TABLE `intervencion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicamento`
--

DROP TABLE IF EXISTS `medicamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicamento` (
  `idmedicamento` int NOT NULL,
  `medicamento` varchar(255) NOT NULL,
  PRIMARY KEY (`idmedicamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicamento`
--

LOCK TABLES `medicamento` WRITE;
/*!40000 ALTER TABLE `medicamento` DISABLE KEYS */;
INSERT INTO `medicamento` VALUES (1,'Amoxicilina 500mg'),(2,'Ibuprofeno 400mg'),(3,'Paracetamol 500mg'),(4,'Enalapril 10mg'),(5,'Metformina 850mg'),(6,'Eutirox 50mg');
/*!40000 ALTER TABLE `medicamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metodo`
--

DROP TABLE IF EXISTS `metodo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metodo` (
  `idmetodo` int NOT NULL,
  `nombremetodo` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idmetodo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metodo`
--

LOCK TABLES `metodo` WRITE;
/*!40000 ALTER TABLE `metodo` DISABLE KEYS */;
INSERT INTO `metodo` VALUES (1,'Espectrofotometría'),(2,'Inmunoquímica'),(3,'Cromatografía'),(4,'Microscopia'),(5,'PCR');
/*!40000 ALTER TABLE `metodo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `muestra`
--

DROP TABLE IF EXISTS `muestra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `muestra` (
  `idmuestra` int NOT NULL,
  `idtipomuestra` int DEFAULT NULL,
  `idmetodo` int DEFAULT NULL,
  `nombremuestra` varchar(45) DEFAULT NULL,
  `unidad` varchar(45) DEFAULT NULL,
  `valorSuperior` float DEFAULT NULL,
  `valorInferior` float DEFAULT NULL,
  PRIMARY KEY (`idmuestra`),
  KEY `idtipomuestra_idx` (`idtipomuestra`),
  KEY `idmetodo_idx` (`idmetodo`),
  CONSTRAINT `muestra_fk1` FOREIGN KEY (`idmetodo`) REFERENCES `metodo` (`idmetodo`),
  CONSTRAINT `muestra_fk2` FOREIGN KEY (`idtipomuestra`) REFERENCES `tipomuestra` (`idtipomuestra`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `muestra`
--

LOCK TABLES `muestra` WRITE;
/*!40000 ALTER TABLE `muestra` DISABLE KEYS */;
INSERT INTO `muestra` VALUES (1,1,1,'Hemoglobina','g/dL',16,12),(2,1,2,'Glucosa','mg/dL',110,70),(3,2,3,'Creatinina','mg/dL',1.2,0.6),(4,1,1,'Colesterol Total','mg/dL',200,150),(5,1,4,'Leucocitos','cel/uL',10000,4000);
/*!40000 ALTER TABLE `muestra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operacion`
--

DROP TABLE IF EXISTS `operacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `operacion` (
  `idoperacion` int NOT NULL,
  `operacion` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idoperacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operacion`
--

LOCK TABLES `operacion` WRITE;
/*!40000 ALTER TABLE `operacion` DISABLE KEYS */;
INSERT INTO `operacion` VALUES (1,'Apendicectomía laparoscópica'),(2,'Colecistectomía'),(3,'Herniorrafia inguinal'),(4,'Artroscopia de rodilla'),(5,'Cesárea');
/*!40000 ALTER TABLE `operacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paciente`
--

DROP TABLE IF EXISTS `paciente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paciente` (
  `idpaciente` int NOT NULL,
  `nombrePaciente` varchar(255) DEFAULT NULL,
  `rut` varchar(45) DEFAULT NULL,
  `fechaNacimiento` date DEFAULT NULL,
  `sexo` varchar(45) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idpaciente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paciente`
--

LOCK TABLES `paciente` WRITE;
/*!40000 ALTER TABLE `paciente` DISABLE KEYS */;
INSERT INTO `paciente` VALUES (1,'María González López','12345678-9','1985-03-15','Femenino','Av. Libertador 1234, Santiago'),(2,'Juan Carlos Pérez','98765432-1','1978-07-22','Masculino','Calle Los Aromos 567, Valparaíso'),(3,'Ana María Silva','11223344-5','1992-11-08','Femenino','Pasaje Las Flores 89, Concepción'),(4,'Roberto Martínez','55667788-2','1965-01-30','Masculino','Av. Brasil 2345, Viña del Mar'),(5,'Carolina Fernández','99887766-3','1988-09-12','Femenino','Los Pinos 456, La Serena');
/*!40000 ALTER TABLE `paciente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profesional`
--

DROP TABLE IF EXISTS `profesional`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profesional` (
  `idprofesional` int NOT NULL,
  `idespecialidad` int DEFAULT NULL,
  `nombreprofesional` varchar(45) DEFAULT NULL,
  `rut` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idprofesional`),
  KEY `idespecialidad_idx` (`idespecialidad`),
  CONSTRAINT `profesional_fk1` FOREIGN KEY (`idespecialidad`) REFERENCES `especialidad` (`idespecialidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profesional`
--

LOCK TABLES `profesional` WRITE;
/*!40000 ALTER TABLE `profesional` DISABLE KEYS */;
INSERT INTO `profesional` VALUES (1,1,'Dr. Carlos Mendoza','15555666-7'),(2,2,'Dra. Patricia Rojas','16666777-8'),(3,3,'Dr. Miguel Sánchez','17777888-9'),(4,4,'Dra. Isabel Vargas','18888999-0'),(5,1,'Dr. Fernando López','19999000-1');
/*!40000 ALTER TABLE `profesional` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receta`
--

DROP TABLE IF EXISTS `receta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receta` (
  `idconsulta` int NOT NULL,
  `idmedicamento` int NOT NULL,
  PRIMARY KEY (`idconsulta`,`idmedicamento`),
  KEY `idmedicamento_idx` (`idmedicamento`),
  CONSTRAINT `receta_fk1` FOREIGN KEY (`idconsulta`) REFERENCES `consulta` (`idconsulta`),
  CONSTRAINT `receta_fk2` FOREIGN KEY (`idmedicamento`) REFERENCES `medicamento` (`idmedicamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receta`
--

LOCK TABLES `receta` WRITE;
/*!40000 ALTER TABLE `receta` DISABLE KEYS */;
INSERT INTO `receta` VALUES (1,1),(2,2),(1,3),(3,3),(4,4),(5,5);
/*!40000 ALTER TABLE `receta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resultado`
--

DROP TABLE IF EXISTS `resultado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resultado` (
  `idmuestra` int NOT NULL,
  `idexamen` int NOT NULL,
  `resultado` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`idmuestra`,`idexamen`),
  KEY `resultado_fk2_idx` (`idexamen`),
  CONSTRAINT `resultado_fk1` FOREIGN KEY (`idmuestra`) REFERENCES `muestra` (`idmuestra`),
  CONSTRAINT `resultado_fk2` FOREIGN KEY (`idexamen`) REFERENCES `examenmedico` (`idexamen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resultado`
--

LOCK TABLES `resultado` WRITE;
/*!40000 ALTER TABLE `resultado` DISABLE KEYS */;
INSERT INTO `resultado` VALUES (1,1,'14.5'),(2,3,'95'),(3,4,'0.9'),(4,2,'185'),(5,1,'7500');
/*!40000 ALTER TABLE `resultado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicio`
--

DROP TABLE IF EXISTS `servicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicio` (
  `idservicio` int NOT NULL,
  `servicio` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`idservicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicio`
--

LOCK TABLES `servicio` WRITE;
/*!40000 ALTER TABLE `servicio` DISABLE KEYS */;
INSERT INTO `servicio` VALUES (1,'Consulta Externa'),(2,'Urgencias'),(3,'Hospitalización'),(4,'Cirugía Ambulatoria'),(5,'Laboratorio Clínico');
/*!40000 ALTER TABLE `servicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sucursal`
--

DROP TABLE IF EXISTS `sucursal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sucursal` (
  `idsucursal` int NOT NULL,
  `sucursal` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`idsucursal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sucursal`
--

LOCK TABLES `sucursal` WRITE;
/*!40000 ALTER TABLE `sucursal` DISABLE KEYS */;
INSERT INTO `sucursal` VALUES (1,'BIONET Centro'),(2,'BIONET Las Condes'),(3,'BIONET Maipú'),(4,'BIONET Valparaíso'),(5,'BIONET Concepción');
/*!40000 ALTER TABLE `sucursal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipoexamen`
--

DROP TABLE IF EXISTS `tipoexamen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipoexamen` (
  `idtipoexamen` int NOT NULL,
  `nombreTipoExamen` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idtipoexamen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipoexamen`
--

LOCK TABLES `tipoexamen` WRITE;
/*!40000 ALTER TABLE `tipoexamen` DISABLE KEYS */;
INSERT INTO `tipoexamen` VALUES (1,'Hemograma Completo'),(2,'Perfil Lipídico'),(3,'Glicemia'),(4,'Función Renal'),(5,'Función Hepática');
/*!40000 ALTER TABLE `tipoexamen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipomuestra`
--

DROP TABLE IF EXISTS `tipomuestra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipomuestra` (
  `idtipomuestra` int NOT NULL,
  `tipomuestra` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idtipomuestra`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipomuestra`
--

LOCK TABLES `tipomuestra` WRITE;
/*!40000 ALTER TABLE `tipomuestra` DISABLE KEYS */;
INSERT INTO `tipomuestra` VALUES (1,'Sangre'),(2,'Orina'),(3,'Heces'),(4,'Saliva'),(5,'Líquido cefalorraquídeo');
/*!40000 ALTER TABLE `tipomuestra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tiposangre`
--

DROP TABLE IF EXISTS `tiposangre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tiposangre` (
  `idtiposangre` int NOT NULL,
  `tipoSangre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idtiposangre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiposangre`
--

LOCK TABLES `tiposangre` WRITE;
/*!40000 ALTER TABLE `tiposangre` DISABLE KEYS */;
INSERT INTO `tiposangre` VALUES (1,'O+'),(2,'O-'),(3,'A+'),(4,'A-'),(5,'B+'),(6,'B-'),(7,'AB+'),(8,'AB-');
/*!40000 ALTER TABLE `tiposangre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'tecnologiasmoviles'
--

--
-- Dumping routines for database 'tecnologiasmoviles'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-28 22:15:28
