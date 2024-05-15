-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 14, 2024 at 10:30 PM
-- Server version: 8.2.0
-- PHP Version: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sgi_danielka_sys_bd`
--

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `pa_detalle_orden`$$
CREATE DEFINER=`admin`@`localhost` PROCEDURE `pa_detalle_orden` (IN `_ordenId` INT, IN `_productoId` INT, IN `_cantidad` INT, IN `_fechaEstablecida` DATE, IN `_fechaLlegada` DATE, IN `_precio` DOUBLE, IN `_descuento` INT, IN `_porcentaje` DOUBLE, IN `_fechaVencimiento` DATE, IN `_descripcionEstacion` VARCHAR(500), IN `_fechaInicioEstacion` DATE, IN `_fechaFinalEstacion` DATE, IN `_almacenId` INT)   BEGIN
	
    IF (_descuento > _cantidad) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No puedes darle un valor mayor a descuento que cantidad';
	END IF;
    
	IF (_fechaEstablecida < CURDATE()) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error en la fecha establecida(asegurate de que las fechas tengan sentido)';
	END IF;
    
    START TRANSACTION;
    
    INSERT INTO Detalles_Orden VALUES
    (null, _ordenId, _productoId, _cantidad, _fechaEstablecida, _fechaLlegada,
     _precio, _descuento, _porcentaje
    );
    
    IF _fechaLlegada IS NOT NULL THEN 
		IF (_fechaLlegada < _fechaEstablecida) OR (_fechaLlegada > CURDATE()) THEN
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error en la fecha de llegada(asegurate de que las fechas tengan sentido)';
		END IF;
		INSERT INTO Inventario VALUES(null,
			_productoId, _almacenId, _cantidad, _fechaLlegada, LAST_INSERT_ID(),
			_fechaVencimiento, _descripcionEstacion, _fechaInicioEstacion, _fechaFinalEstacion
        );
	END IF;
	COMMIT;
    
END$$

DROP PROCEDURE IF EXISTS `pa_entrada_inventario_individual`$$
CREATE DEFINER=`admin`@`localhost` PROCEDURE `pa_entrada_inventario_individual` (IN `_detalle_ordenId` INT, IN `_almacenId` INT, IN `_fechaVencimiento` DATE, IN `_descripcionEstacion` VARCHAR(500), IN `_fechaInicioEstacion` DATE, IN `_fechaFinalEstacion` DATE)   BEGIN
	
	DECLARE _productoId, _cantidad INT;

    START TRANSACTION;
    UPDATE Detalles_Orden SET fechaLlegada = CURDATE() WHERE detalle_ordenId = _detalle_ordenId;
    
	SELECT productoId, cantidad INTO _productoId, _cantidad FROM Detalles_Orden WHERE detalle_ordenId = _detalle_ordenId;
    
    INSERT INTO Inventario VALUES(null, _productoId, _almacenId, _cantidad, CURDATE(), _detalle_ordenId,
		_fechaVencimiento, _descripcionEstacion, _fechaInicioEstacion, _fechaFinalEstacion
    );
    COMMIT;
END$$

DROP PROCEDURE IF EXISTS `pa_generar_orden`$$
CREATE DEFINER=`admin`@`localhost` PROCEDURE `pa_generar_orden` (IN `_proveedorId` INT, IN `_empleadoId` INT, IN `_fecha` DATE, IN `_fechaLimite` DATE, IN `_mora` DATE)   BEGIN

	IF (_fechaLimite IS NULL AND _mora IS NOT NULL) OR (_fechaLimite IS NOT NULL AND _mora IS NULL) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error en la configuracion de mora';
	END IF;
    
    IF _fechaLimite <= CURDATE() THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Fecha limite no valida';
	END IF;
    
    START TRANSACTION;
    INSERT INTO Ordenes VALUES
    (null, _proveedorId, _empleadoId, CURDATE(), _fechaLimite, _mora);
    COMMIT;
    
END$$

DROP PROCEDURE IF EXISTS `pa_nuevo_producto`$$
CREATE DEFINER=`admin`@`localhost` PROCEDURE `pa_nuevo_producto` (IN `_nombre` VARCHAR(100), IN `_descripcion` VARCHAR(500), IN `_precio` DOUBLE, IN `_activo` ENUM('t','f'), IN `_perecedero` ENUM('t','f'), IN `_codigoBarra` VARCHAR(30), IN `_minimo` INT, IN `_maximo` INT, IN `_img` INT, IN `_categoriaId` INT, IN `_marcaId` INT, IN `_unidadMedidaId` INT, IN `_metodo` ENUM('peps','ueps'), IN `_cantidad` INT, IN `_almacenId` INT, IN `_comprobante` INT, IN `_fechaVencimiento` DATE, IN `_descripcionEstacion` VARCHAR(500), IN `_fechaInicioEstacion` DATE, IN `_fechaFinalEstacion` DATE)   BEGIN
	
    IF (_perecedero = 't' AND _fechaVencimiento IS NULL) OR (_perecedero = 'f' AND _fechaVencimiento IS NOT NULL) THEN
		SIGNAl SQLSTATE '45000' SET MESSAGE_TEXT = 'Configuracion de vencimiento incorrecta';
	END IF;
    
    IF (_cantidad < _minimo) THEN
		SIGNAl SQLSTATE '45000' SET MESSAGE_TEXT = 'No puedes ingresar una menor cantidad al minimo';
	END IF;
    
	IF (_cantidad > _maximo) THEN
		SIGNAl SQLSTATE '45000' SET MESSAGE_TEXT = 'No puedes ingresar una mayor cantidad al maximo';
	END IF;
    
	IF (_fechaInicioEstacion IS NULL AND _fechaFinalEstacion IS NOT NULL) OR (_fechaInicioEstacion IS NOT NULL AND _fechaFinalEstacion IS NULL) THEN
		SIGNAl SQLSTATE '45000' SET MESSAGE_TEXT = 'Configuracion de estaciones incorrecta';
	END IF;
    
    IF (_fechaInicioEstacion < CURDATE()) OR (_fechaFinalEstacion < _fechaInicioEstacion) THEN
		SIGNAl SQLSTATE '45000' SET MESSAGE_TEXT = 'Configuracion de las fechas de estacion incorrectas';
	END IF;
    
    START TRANSACTION;
	INSERT INTO Productos VALUES
    (null, _nombre, _descripcion, _precio, _activo, _perecedero, _codigoBarra,
     _minimo, _maximo, _img, _categoriaId, _marcaId, _unidadMedidaId, _metodo
    );
 
	IF (_comprobante IS NULL) THEN
		INSERT INTO Inventario VALUES
		(null, LAST_INSERT_ID(), _almacenId, _cantidad, CURDATE(), 
		_comprobante, _fechaVencimiento, _descripcionEstacion, _fechaInicioEstacion,
		_fechaFinalEstacion);
	END IF;
 
	SELECT 'Producto Ingresado Con Exito' AS 'message';
    COMMIT; 
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `abonos`
--

DROP TABLE IF EXISTS `abonos`;
CREATE TABLE IF NOT EXISTS `abonos` (
  `abonoId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `ordenId` int UNSIGNED DEFAULT NULL,
  `ventaId` int UNSIGNED DEFAULT NULL,
  `monto` double NOT NULL,
  `fecha` date NOT NULL,
  PRIMARY KEY (`abonoId`),
  KEY `fk_ordenId_abono` (`ordenId`),
  KEY `fk_ventaId_abono` (`ventaId`)
) ;

--
-- Triggers `abonos`
--
DROP TRIGGER IF EXISTS `validar_abonos`;
DELIMITER $$
CREATE TRIGGER `validar_abonos` BEFORE INSERT ON `abonos` FOR EACH ROW BEGIN

	-- verificar que el abono es o bien para una orden o una venta
    IF (NEW.ordenId IS NULL AND NEW.ventaId IS NULL) OR (NEW.ordenId IS NOT NULL AND NEW.ventaId IS NOT NULL) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Debes registrar un monto para una orden o una venta';
    END IF;
    
    -- Verificar fecha valida
    IF NEW.fecha != CURDATE() THEN 
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La fecha de registro de es valida';
	END IF;
    
    -- Verificar que el monto a registrar no sobrepase el monto debido
		-- pendiente	
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `almacenes`
--

DROP TABLE IF EXISTS `almacenes`;
CREATE TABLE IF NOT EXISTS `almacenes` (
  `almacenId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(500) NOT NULL,
  `piso` int NOT NULL,
  `sala` int UNSIGNED NOT NULL,
  `ancho` double NOT NULL,
  `alto` double NOT NULL,
  `longitud` double NOT NULL,
  `activo` enum('t','f') DEFAULT 't',
  PRIMARY KEY (`almacenId`)
) ;

--
-- Dumping data for table `almacenes`
--

INSERT INTO `almacenes` (`almacenId`, `nombre`, `piso`, `sala`, `ancho`, `alto`, `longitud`, `activo`) VALUES
(1, 'Almacen de prueba 1', 1, 1, 5, 7, 8, 't'),
(2, 'Almacen de prueba 2', 1, 2, 4, 6, 7, 't');

-- --------------------------------------------------------

--
-- Stand-in structure for view `cargos`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `cargos`;
CREATE TABLE IF NOT EXISTS `cargos` (
`cargoId` int
,`tipoId` int
,`nombre` varchar(255)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `categorias`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `categorias`;
CREATE TABLE IF NOT EXISTS `categorias` (
`categoriaId` int
,`tipoId` int
,`nombre` varchar(255)
);

-- --------------------------------------------------------

--
-- Table structure for table `detalles_orden`
--

DROP TABLE IF EXISTS `detalles_orden`;
CREATE TABLE IF NOT EXISTS `detalles_orden` (
  `detalle_ordenId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `ordenId` int UNSIGNED NOT NULL,
  `productoId` int UNSIGNED NOT NULL,
  `cantidad` int UNSIGNED NOT NULL,
  `fechaEstablecida` date NOT NULL,
  `fechaLlegada` date DEFAULT NULL,
  `precio` double NOT NULL,
  `descuento` int UNSIGNED DEFAULT NULL,
  `porcentaje` double DEFAULT NULL,
  PRIMARY KEY (`detalle_ordenId`),
  KEY `fk_ordenId_detalle_orden` (`ordenId`),
  KEY `fk_productoId_detalle_orden` (`productoId`)
) ;

--
-- Dumping data for table `detalles_orden`
--

INSERT INTO `detalles_orden` (`detalle_ordenId`, `ordenId`, `productoId`, `cantidad`, `fechaEstablecida`, `fechaLlegada`, `precio`, `descuento`, `porcentaje`) VALUES
(8, 10, 21, 50, '2024-05-14', '2024-05-14', 22.3, NULL, NULL),
(7, 9, 21, 100, '2024-05-14', '2024-05-14', 22.3, NULL, NULL),
(6, 9, 21, 100, '2024-05-14', '2024-05-14', 22.3, NULL, NULL),
(9, 11, 23, 50, '2024-05-14', '2024-05-14', 22.3, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `detalles_venta`
--

DROP TABLE IF EXISTS `detalles_venta`;
CREATE TABLE IF NOT EXISTS `detalles_venta` (
  `detalle_ventaId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `ventaId` int UNSIGNED NOT NULL,
  `productoId` int UNSIGNED NOT NULL,
  `cantidad` int UNSIGNED NOT NULL,
  `fechaEstablecida` date NOT NULL,
  `fechaLlegada` date DEFAULT NULL,
  `precio` double NOT NULL,
  `descuento` int UNSIGNED DEFAULT NULL,
  `porcentaje` double DEFAULT NULL,
  PRIMARY KEY (`detalle_ventaId`),
  KEY `fk_productoId_detalles_venta` (`productoId`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `inventario`
--

DROP TABLE IF EXISTS `inventario`;
CREATE TABLE IF NOT EXISTS `inventario` (
  `inventarioId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `productoId` int UNSIGNED NOT NULL,
  `almacenId` int UNSIGNED NOT NULL,
  `cantidad` int UNSIGNED NOT NULL,
  `fecha` date NOT NULL,
  `comprobante` int UNSIGNED DEFAULT NULL,
  `fechaVencimiento` date DEFAULT NULL,
  `descripcionEstacion` varchar(500) DEFAULT NULL,
  `fechaInicioEstacion` date DEFAULT NULL,
  `fechaFinalEstacion` date DEFAULT NULL,
  PRIMARY KEY (`inventarioId`),
  KEY `fk_productoId_inventario` (`productoId`),
  KEY `fk_almacenId_inventario` (`almacenId`),
  KEY `fk_comprobante_inventario` (`comprobante`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `inventario`
--

INSERT INTO `inventario` (`inventarioId`, `productoId`, `almacenId`, `cantidad`, `fecha`, `comprobante`, `fechaVencimiento`, `descripcionEstacion`, `fechaInicioEstacion`, `fechaFinalEstacion`) VALUES
(9, 22, 1, 555, '2024-05-14', NULL, NULL, NULL, '2025-02-23', '2026-05-10'),
(8, 21, 1, 50, '2024-05-14', 8, NULL, NULL, NULL, NULL),
(7, 21, 1, 100, '2024-05-14', 7, NULL, NULL, NULL, NULL),
(6, 21, 1, 555, '2024-05-14', NULL, NULL, NULL, '2025-02-23', '2026-05-10'),
(10, 23, 1, 50, '2024-05-14', 9, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Stand-in structure for view `marcas`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `marcas`;
CREATE TABLE IF NOT EXISTS `marcas` (
`marcaId` int
,`tipoId` int
,`nombre` varchar(255)
);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2024_05_01_123812_create_personal_access_tokens_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `ordenes`
--

DROP TABLE IF EXISTS `ordenes`;
CREATE TABLE IF NOT EXISTS `ordenes` (
  `ordenId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `proveedorId` int UNSIGNED NOT NULL,
  `empleadoId` int UNSIGNED NOT NULL,
  `fecha` date NOT NULL,
  `fechaLimite` date DEFAULT NULL,
  `mora` double DEFAULT NULL,
  PRIMARY KEY (`ordenId`),
  KEY `fk_proveedorId_orden` (`proveedorId`),
  KEY `fk_empleadoId_orden` (`empleadoId`)
) ;

--
-- Dumping data for table `ordenes`
--

INSERT INTO `ordenes` (`ordenId`, `proveedorId`, `empleadoId`, `fecha`, `fechaLimite`, `mora`) VALUES
(11, 7, 2, '2024-05-14', NULL, NULL),
(10, 7, 2, '2024-05-14', NULL, NULL),
(9, 7, 2, '2024-05-14', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `perdidas`
--

DROP TABLE IF EXISTS `perdidas`;
CREATE TABLE IF NOT EXISTS `perdidas` (
  `perdidaId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `inventarioId` int UNSIGNED NOT NULL,
  `cantidad` int UNSIGNED NOT NULL,
  `devolucion` enum('t','f') DEFAULT 'f',
  `porcentaje` double DEFAULT NULL,
  PRIMARY KEY (`perdidaId`),
  KEY `fk_inventarioId_perdida` (`inventarioId`)
) ;

--
-- Triggers `perdidas`
--
DROP TRIGGER IF EXISTS `validar_perdidas`;
DELIMITER $$
CREATE TRIGGER `validar_perdidas` BEFORE INSERT ON `perdidas` FOR EACH ROW BEGIN
	DECLARE v_cantidad_inventario INT;
    DECLARE v_comprobante CHAR(1);
    -- Verificar que la cantidad perdida de un inventario no sea mayor a la cantidad real del inventario
    SELECT cantidad INTO v_cantidad_inventario FROM Inventario WHERE inventarioId = NEW.inventarioID;
	IF NEW.cantidad > v_cantidad_inventario THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No puede haber una mayor cantidad perdida que la que existe en el inventario';
	END IF;
    
    -- Verificar condiciones para la devolucion
    SELECT comprobante INTO v_comprobante FROM Inventario WHERE inventarioId = NEW.inventarioID;
    
	IF 	(v_comprobante IS NOT NULL AND NEW.devolucion IS NULL) OR (v_comprobante IS NOT NULL AND NEW.porcentaje IS NULL) OR (v_comprobante IS NULL AND NEW.devolucion IS NOT NULL) OR (v_comprobante IS NULL AND NEW.porcentaje IS NOT NULL) OR (NEW.devolucion IS NULL AND NEW.porcentaje IS NOT NULL) OR (NEW.devolucion IS NOT NULL AND NEW.porcentaje IS NULL) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Establece correctamente los criterios para la devolucion';
	END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=MyISAM AUTO_INCREMENT=190 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\Usuarios', 30, 'auth_token', 'b8e9a514b2ceb162f977a76ae00708d232dc9b68d3632c6b11226ad5920a5262', '[\"*\"]', NULL, NULL, '2024-05-01 18:51:44', '2024-05-01 18:51:44'),
(2, 'App\\Models\\Usuarios', 31, 'auth_token', '7a3fc4cc9ff29efc3ed0d503a7cb84e2fb93f5b61c207f6104ce159a6f28416a', '[\"*\"]', NULL, NULL, '2024-05-01 19:07:35', '2024-05-01 19:07:35'),
(3, 'App\\Models\\Usuarios', 32, 'auth_token', '6deee84f5560680e641a5f41c7ae213fb1bfaf55078daca16f7212563d43930b', '[\"*\"]', NULL, NULL, '2024-05-01 19:11:49', '2024-05-01 19:11:49'),
(4, 'App\\Models\\Usuarios', 33, 'auth_token', 'a16d87d4c5f970918bdd1b470424bc044e4409f616dd1d987901ba8f34d59cc8', '[\"*\"]', NULL, NULL, '2024-05-01 19:27:59', '2024-05-01 19:27:59'),
(43, 'App\\Models\\Usuarios', 45, 'auth_token', 'fc15f26c0b45ecefcdab19857bbf33e04825268d4f9eac9304ca2016e7d6114c', '[\"*\"]', NULL, NULL, '2024-05-03 04:56:36', '2024-05-03 04:56:36'),
(42, 'App\\Models\\Usuarios', 2, 'auth_token', '036defa29e886b4b0d80235d7987a361b62c96511280c5de5a276b54edc65c79', '[\"*\"]', '2024-05-03 08:40:26', NULL, '2024-05-03 04:55:52', '2024-05-03 08:40:26'),
(41, 'App\\Models\\Usuarios', 44, 'auth_token', '25221dd5e1712ae1669fad4a2eb77b951ce644b4d479ca5353d3534124bdac99', '[\"*\"]', NULL, NULL, '2024-05-03 04:46:54', '2024-05-03 04:46:54'),
(40, 'App\\Models\\Usuarios', 2, 'auth_token', '70f1640933c28a9e06ec963daca29b1b7e4e1ef9964347c6db11b4b76d2d22c1', '[\"*\"]', '2024-05-03 02:27:27', NULL, '2024-05-03 01:49:54', '2024-05-03 02:27:27'),
(39, 'App\\Models\\Usuarios', 43, 'auth_token', 'dec2bfb13a93b7df08d3384532bb690f6fc3e823e48810cba49e7f18b9e4604a', '[\"*\"]', NULL, NULL, '2024-05-03 00:26:22', '2024-05-03 00:26:22'),
(38, 'App\\Models\\Usuarios', 42, 'auth_token', '20fad2f4ed6959f747d7598a0873f1f61eab900cbc24993062ea4299b987d5dd', '[\"*\"]', NULL, NULL, '2024-05-03 00:23:14', '2024-05-03 00:23:14'),
(37, 'App\\Models\\Usuarios', 41, 'auth_token', '3c37acad084090cada9a62dfe24dfe68c9bcc6973ac1dd60b1e123cd9bbc25dc', '[\"*\"]', NULL, NULL, '2024-05-03 00:23:03', '2024-05-03 00:23:03'),
(36, 'App\\Models\\Usuarios', 40, 'auth_token', '5b9d7ddcda87fa9ce70dbd05d7de6d35e81a4e0165f1a49d89d103e5fa0d6b91', '[\"*\"]', NULL, NULL, '2024-05-02 23:49:13', '2024-05-02 23:49:13'),
(35, 'App\\Models\\Usuarios', 2, 'auth_token', 'b726a485188050d5449ff16a36819b2a1a62a3edef4c870139745cfe09ef7e40', '[\"*\"]', '2024-05-03 01:48:27', NULL, '2024-05-02 23:46:06', '2024-05-03 01:48:27'),
(34, 'App\\Models\\Usuarios', 39, 'auth_token', '7ab8a585335195346e0923fac6f84ab41df6a95f18a1a206e9d4b0c6f5f48640', '[\"*\"]', NULL, NULL, '2024-05-02 04:45:56', '2024-05-02 04:45:56'),
(33, 'App\\Models\\Usuarios', 38, 'auth_token', '525eb92cb4ed11acdea5cf1c75486841d1eec39bcb518d17e29e86112d34da76', '[\"*\"]', NULL, NULL, '2024-05-02 04:39:45', '2024-05-02 04:39:45'),
(32, 'App\\Models\\Usuarios', 37, 'auth_token', '19695f2f07ab38674860b590557f9c77c44b44dfc82a9ac59b6fcbc2746bbc0c', '[\"*\"]', NULL, NULL, '2024-05-02 04:36:59', '2024-05-02 04:36:59'),
(31, 'App\\Models\\Usuarios', 2, 'auth_token', '0aec1c7cf29e5b50ef55691165156f79f39e8ecc60804e446aa8bd6fb6c55ecc', '[\"*\"]', '2024-05-03 04:49:38', NULL, '2024-05-01 22:33:24', '2024-05-03 04:49:38'),
(30, 'App\\Models\\Usuarios', 36, 'auth_token', '7245db3f9141d8b784b57c538be90fda6613ae8848ef6ef659a9bd46dd9a4f7a', '[\"*\"]', NULL, NULL, '2024-05-01 22:25:42', '2024-05-01 22:25:42'),
(29, 'App\\Models\\Usuarios', 35, 'auth_token', '7d70b4c94cdda3ead40aa480467c2386d4fd929e458623a983e3079b29a83f43', '[\"*\"]', NULL, NULL, '2024-05-01 22:25:13', '2024-05-01 22:25:13'),
(28, 'App\\Models\\Usuarios', 34, 'auth_token', 'fa3308ef31f1be6a16b7fbc1ddf99a0d594d24222619904b908eb49c6a92da6a', '[\"*\"]', NULL, NULL, '2024-05-01 22:10:36', '2024-05-01 22:10:36'),
(27, 'App\\Models\\Usuarios', 2, 'auth_token', 'c4ac3fdcf3e4df595376a699b7aeb1ac4cd3e46fdd44aa80b75288e1df7d72d9', '[\"*\"]', '2024-05-01 22:32:35', NULL, '2024-05-01 21:36:05', '2024-05-01 22:32:35'),
(26, 'App\\Models\\Usuarios', 2, 'auth_token', '2951af9eb431e6319f4dddac88f0d892b097244c089f156b4f7e19526723d20d', '[\"*\"]', '2024-05-01 21:34:37', NULL, '2024-05-01 21:22:45', '2024-05-01 21:34:37'),
(25, 'App\\Models\\Usuarios', 2, 'auth_token', '7420756848840c401dc2eb2025f17ac2577b9c03a93907869ce7ac0a14b92687', '[\"*\"]', NULL, NULL, '2024-05-01 21:15:39', '2024-05-01 21:15:39'),
(44, 'App\\Models\\Usuarios', 46, 'auth_token', 'd09fafc6ce881b8abce712570cb13c0ab67e4fcfb547744f7806858b12dc4053', '[\"*\"]', NULL, NULL, '2024-05-03 05:10:13', '2024-05-03 05:10:13'),
(45, 'App\\Models\\Usuarios', 2, 'auth_token', 'ea206aa79993000206daa47ea07ea7052fb3f20b80c961e0328ee14750a7227f', '[\"*\"]', '2024-05-03 08:47:22', NULL, '2024-05-03 08:46:22', '2024-05-03 08:47:22'),
(46, 'App\\Models\\Usuarios', 2, 'auth_token', '8f374f2d3cb903b6143a62825d0e0c593316deaa1fbc6722a001d8c4b2f8e31d', '[\"*\"]', '2024-05-03 10:37:58', NULL, '2024-05-03 08:55:22', '2024-05-03 10:37:58'),
(47, 'App\\Models\\Usuarios', 2, 'auth_token', '372d29d402d93ca43be75abe66c4108e2c0a85dc723917e8c3619c188e5fcea5', '[\"*\"]', '2024-05-03 10:38:59', NULL, '2024-05-03 10:38:15', '2024-05-03 10:38:59'),
(48, 'App\\Models\\Usuarios', 2, 'auth_token', 'fe5684c925ca2877006f882fa3a1898ff304187a7e88104b80429ffa4c302fb8', '[\"*\"]', NULL, NULL, '2024-05-03 10:42:06', '2024-05-03 10:42:06'),
(49, 'App\\Models\\Usuarios', 2, 'auth_token', '514979bcaf49753cf6de50b077bfd2ec686b8e0f4b98098716b4495a43480215', '[\"*\"]', '2024-05-03 10:45:00', NULL, '2024-05-03 10:43:28', '2024-05-03 10:45:00'),
(50, 'App\\Models\\Usuarios', 2, 'auth_token', '291b23e55e2f3596d045b01cb2b63c21cab0dd2b5e0fcfa6156632cf229e0e68', '[\"*\"]', '2024-05-03 11:02:44', NULL, '2024-05-03 10:45:17', '2024-05-03 11:02:44'),
(51, 'App\\Models\\Usuarios', 2, 'auth_token', 'e0f04bdfd7e1521a6e2bf5a1155e8930507c17c97cda0806e6c964f398af5f11', '[\"*\"]', '2024-05-03 11:13:00', NULL, '2024-05-03 11:09:05', '2024-05-03 11:13:00'),
(52, 'App\\Models\\Usuarios', 47, 'auth_token', 'a7cb6eccdceab844010caa17268c3c13ea3c69be140817066bc74078d847d3fb', '[\"*\"]', NULL, NULL, '2024-05-03 11:09:42', '2024-05-03 11:09:42'),
(53, 'App\\Models\\Usuarios', 2, 'auth_token', '4389a27bbb89e876a1bf06e4b50b97a19fc778581c172d5393a38e929b57ceec', '[\"*\"]', NULL, NULL, '2024-05-03 11:13:25', '2024-05-03 11:13:25'),
(54, 'App\\Models\\Usuarios', 2, 'auth_token', 'ec78a452f1870a4fc9e41d1fc4374fbd4893424c85e252927d8b184329e78b84', '[\"*\"]', NULL, NULL, '2024-05-03 11:13:28', '2024-05-03 11:13:28'),
(55, 'App\\Models\\Usuarios', 2, 'auth_token', '25e05591d20f91533d30ead2240d1313721358edf40a0b609742601f1bb70214', '[\"*\"]', '2024-05-03 11:17:07', NULL, '2024-05-03 11:13:35', '2024-05-03 11:17:07'),
(56, 'App\\Models\\Usuarios', 2, 'auth_token', '43ad0b242fa58f727ec13233e9c5a1d5ceb510254c9f86a7309edc49753a6452', '[\"*\"]', '2024-05-03 11:19:48', NULL, '2024-05-03 11:17:34', '2024-05-03 11:19:48'),
(57, 'App\\Models\\Usuarios', 2, 'auth_token', '621f18bb5165ab37caa39c2fe18e29e875df178b061e9ffd8c2cc3b073168487', '[\"*\"]', '2024-05-03 20:29:50', NULL, '2024-05-03 11:20:00', '2024-05-03 20:29:50'),
(58, 'App\\Models\\Usuarios', 48, 'auth_token', 'ab1dfb7efc1f0a92d567abdae245c76574427c10d44ede86cfac43deb2d5eb61', '[\"*\"]', NULL, NULL, '2024-05-03 11:23:48', '2024-05-03 11:23:48'),
(59, 'App\\Models\\Usuarios', 49, 'auth_token', 'dc09ee88cb1fcf445e75680f4c5b5460561f76b34735849af8f5c79edccc3bb7', '[\"*\"]', NULL, NULL, '2024-05-03 11:47:39', '2024-05-03 11:47:39'),
(60, 'App\\Models\\Usuarios', 50, 'auth_token', '0dbba96f8517d78741c846eeff94ab982d17294afba54e35480016af902dca81', '[\"*\"]', NULL, NULL, '2024-05-03 11:48:53', '2024-05-03 11:48:53'),
(61, 'App\\Models\\Usuarios', 51, 'auth_token', '88b2ea3ecb660bebc8372b0f67e0adac25fdecb06df15858c702f9fcecad06f4', '[\"*\"]', NULL, NULL, '2024-05-03 11:50:37', '2024-05-03 11:50:37'),
(62, 'App\\Models\\Usuarios', 52, 'auth_token', 'e7e8a16c697454669666351e4fc61994bd0716bd8d1d09a0e0a3ac3f78393b53', '[\"*\"]', NULL, NULL, '2024-05-03 11:54:22', '2024-05-03 11:54:22'),
(63, 'App\\Models\\Usuarios', 53, 'auth_token', '524945824c2fa275266db36aaee589e19734f766fdc8766917e291788f4118c8', '[\"*\"]', NULL, NULL, '2024-05-03 11:55:14', '2024-05-03 11:55:14'),
(64, 'App\\Models\\Usuarios', 54, 'auth_token', '560bcc929dea30a850a946c627a0d3277b307664c32cafeec3e115e6e1cb906f', '[\"*\"]', NULL, NULL, '2024-05-03 11:56:07', '2024-05-03 11:56:07'),
(65, 'App\\Models\\Usuarios', 55, 'auth_token', '2f1b8cfde4108173fa2817b03f61f9c8b517277070b2b077e1c33bab115299ef', '[\"*\"]', NULL, NULL, '2024-05-03 11:57:00', '2024-05-03 11:57:00'),
(66, 'App\\Models\\Usuarios', 56, 'auth_token', '03101a33ba0db970fb786a7edff9903f46eee7a9f7087b00a3a3165e396df966', '[\"*\"]', NULL, NULL, '2024-05-03 12:13:46', '2024-05-03 12:13:46'),
(67, 'App\\Models\\Usuarios', 57, 'auth_token', '6da3f0f00834ecd09c53cc10b6c2c09293db87b393f1326a0651e8bbe0d107ce', '[\"*\"]', NULL, NULL, '2024-05-03 12:14:13', '2024-05-03 12:14:13'),
(68, 'App\\Models\\Usuarios', 58, 'auth_token', 'b4f76a198e7eee94bd918dd51adccd35bb38fe1cf55b73b2738d37718f6be9d8', '[\"*\"]', NULL, NULL, '2024-05-03 19:57:35', '2024-05-03 19:57:35'),
(69, 'App\\Models\\Usuarios', 59, 'auth_token', '4dbdd6a064b05ee5db5bb448d2587bbeaf039df729e176b73e688e378313d174', '[\"*\"]', NULL, NULL, '2024-05-03 20:29:49', '2024-05-03 20:29:49'),
(70, 'App\\Models\\Usuarios', 2, 'auth_token', '34019f0adde5b4e56d3b5e2d997ea6cf0e592aa161d29699234828ef56440627', '[\"*\"]', '2024-05-03 20:30:33', NULL, '2024-05-03 20:30:32', '2024-05-03 20:30:33'),
(71, 'App\\Models\\Usuarios', 2, 'auth_token', 'c706f8425384ffbd5d3ff9120e753243fdab7f155dc1dbdd0e55e341e8a79dba', '[\"*\"]', '2024-05-03 20:38:44', NULL, '2024-05-03 20:31:59', '2024-05-03 20:38:44'),
(72, 'App\\Models\\Usuarios', 60, 'auth_token', '02021d61589cd767c40b47d9b1dc7ef5d8d0d239a81db9ffd09ef349e59d6a80', '[\"*\"]', NULL, NULL, '2024-05-03 20:32:37', '2024-05-03 20:32:37'),
(73, 'App\\Models\\Usuarios', 61, 'auth_token', '4cc7b93ef003578ea6a4c9ffd170577d8f156d7f98f8a092d6201848d247d3b7', '[\"*\"]', NULL, NULL, '2024-05-03 20:36:27', '2024-05-03 20:36:27'),
(74, 'App\\Models\\Usuarios', 2, 'auth_token', '063783b8dc31abc65f64c9c6162aeed5018f50f23db529799a064daef236f377', '[\"*\"]', '2024-05-03 20:47:27', NULL, '2024-05-03 20:47:26', '2024-05-03 20:47:27'),
(75, 'App\\Models\\Usuarios', 2, 'auth_token', 'e4d7daa8f5fb5a6389cb4575e85abafb3fe24d4e9c12b671ec58f1bd0ad8ad74', '[\"*\"]', '2024-05-03 20:54:28', NULL, '2024-05-03 20:49:25', '2024-05-03 20:54:28'),
(76, 'App\\Models\\Usuarios', 62, 'auth_token', '63fc76ace8ee567959418fdc26929e4b4fe7fd20bed40468be287190e2c2375b', '[\"*\"]', NULL, NULL, '2024-05-03 20:54:27', '2024-05-03 20:54:27'),
(77, 'App\\Models\\Usuarios', 2, 'auth_token', 'a46f0125567286387f62eb2fde9a3ee43d9ab1cf3514eba1c61df26653261e66', '[\"*\"]', '2024-05-03 23:23:54', NULL, '2024-05-03 21:28:49', '2024-05-03 23:23:54'),
(78, 'App\\Models\\Usuarios', 63, 'auth_token', '0d24a1b1c10a61fa6d5ab3e904a50d8209f33e6aa6fa006a6f28f3cb279fdd84', '[\"*\"]', NULL, NULL, '2024-05-03 21:29:09', '2024-05-03 21:29:09'),
(79, 'App\\Models\\Usuarios', 64, 'auth_token', 'e36dcb51c0cb515fb88f7d544384c7dc3f987c36c891e5c69195fdb17cd9a02a', '[\"*\"]', NULL, NULL, '2024-05-03 21:29:39', '2024-05-03 21:29:39'),
(80, 'App\\Models\\Usuarios', 2, 'auth_token', 'bca58b845ab90dde97e080cff8f0c08b47478fbb3349aebf6e231b3b017e2840', '[\"*\"]', '2024-05-04 21:14:05', NULL, '2024-05-03 23:33:18', '2024-05-04 21:14:05'),
(81, 'App\\Models\\Usuarios', 2, 'auth_token', '9ea417e455ef8682a61f797139890cf458d33ee142103a7ecfbde0cbde2cff6a', '[\"*\"]', '2024-05-04 03:17:07', NULL, '2024-05-04 01:44:17', '2024-05-04 03:17:07'),
(82, 'App\\Models\\Usuarios', 2, 'auth_token', '67cf38740c7563e4f56ad888616a4fea42a9f3af3449664c79406e22ae8211d3', '[\"*\"]', '2024-05-04 03:21:43', NULL, '2024-05-04 03:17:24', '2024-05-04 03:21:43'),
(83, 'App\\Models\\Usuarios', 65, 'auth_token', 'c99560175dbc3fdfa0719f3ee4b57daf9a2155b7a2e39f61f2808c3dbef1abd9', '[\"*\"]', NULL, NULL, '2024-05-04 03:18:05', '2024-05-04 03:18:05'),
(84, 'App\\Models\\Usuarios', 66, 'auth_token', '169c0f84c4ec72e39d7dc08d2666105ff80a1e36f733b5fe0070962885be815d', '[\"*\"]', NULL, NULL, '2024-05-04 03:18:16', '2024-05-04 03:18:16'),
(85, 'App\\Models\\Usuarios', 2, 'auth_token', '17932e8a0881b3501d2992d7182e8d9ba682a8ede8a3c710a373b1e02c3818fa', '[\"*\"]', '2024-05-10 04:56:26', NULL, '2024-05-04 03:34:21', '2024-05-10 04:56:26'),
(86, 'App\\Models\\Usuarios', 2, 'auth_token', '0464d8108d8a12e6276f8f7a01adee7fc2d56802bc1cbfada36a19a503f9cef5', '[\"*\"]', '2024-05-05 02:48:42', NULL, '2024-05-05 02:45:33', '2024-05-05 02:48:42'),
(87, 'App\\Models\\Usuarios', 67, 'auth_token', '2b97956b5171a979a3a8028cac070065a46cbc9054b798da86098389575a2d42', '[\"*\"]', NULL, NULL, '2024-05-05 02:48:41', '2024-05-05 02:48:41'),
(88, 'App\\Models\\Usuarios', 67, 'auth_token', '3e4bd28e5da14f5e755123c66b358bb41db87dbdb21cba42b4b5b7485cad2d5f', '[\"*\"]', '2024-05-06 02:51:20', NULL, '2024-05-05 02:49:06', '2024-05-06 02:51:20'),
(89, 'App\\Models\\Usuarios', 2, 'auth_token', '771f55e79270c75b9fd49717ae0ae92197f2a4eaa4044bcb4ea7a460fee55bd7', '[\"*\"]', '2024-05-06 12:36:53', NULL, '2024-05-06 10:22:38', '2024-05-06 12:36:53'),
(90, 'App\\Models\\Usuarios', 2, 'auth_token', '0b55ff9faa109409eaa6eec63a58a5a55dcb090d0a349ebe0bce535a39d7492e', '[\"*\"]', '2024-05-06 12:50:37', NULL, '2024-05-06 12:48:20', '2024-05-06 12:50:37'),
(91, 'App\\Models\\Usuarios', 68, 'auth_token', '561c9f32e4404bce3c5fdc0910735eca76c2514e935af80b5c5764e8bfb3eca9', '[\"*\"]', NULL, NULL, '2024-05-06 12:50:37', '2024-05-06 12:50:37'),
(92, 'App\\Models\\Usuarios', 68, 'auth_token', '871b7177874c2ea7a71d81810eb01dd73933a32887ae02b7d43ebd79334fd70a', '[\"*\"]', '2024-05-06 12:58:45', NULL, '2024-05-06 12:51:14', '2024-05-06 12:58:45'),
(93, 'App\\Models\\Usuarios', 69, 'auth_token', 'a5185603e0375e2de5b33c004fdf34ca35472ff848394131376fc9ab92c280bd', '[\"*\"]', NULL, NULL, '2024-05-06 12:58:44', '2024-05-06 12:58:44'),
(94, 'App\\Models\\Usuarios', 69, 'auth_token', 'e2cf307ed30fe224a6aab3d15e4c9dbb81f02d561707e4793b506604a18ac434', '[\"*\"]', '2024-05-06 12:59:26', NULL, '2024-05-06 12:59:23', '2024-05-06 12:59:26'),
(95, 'App\\Models\\Usuarios', 2, 'auth_token', '662c9097df919cd732d0893f9608813a3f8a785cb0aef467e7fe3d159d786c27', '[\"*\"]', '2024-05-06 18:32:29', NULL, '2024-05-06 12:59:50', '2024-05-06 18:32:29'),
(96, 'App\\Models\\Usuarios', 2, 'auth_token', 'a19ef41e52689344ccedf3057b12a03e1d1266cfc935c920c7585759a7883c08', '[\"*\"]', '2024-05-06 20:19:42', NULL, '2024-05-06 20:19:37', '2024-05-06 20:19:42'),
(97, 'App\\Models\\Usuarios', 68, 'auth_token', '96e3ab5666707b28bca3104dd3136ac0644448ed703201b3f0a525bfe947fe74', '[\"*\"]', '2024-05-06 20:20:24', NULL, '2024-05-06 20:20:20', '2024-05-06 20:20:24'),
(98, 'App\\Models\\Usuarios', 69, 'auth_token', '18ad7c4773bb8bc07d34745f42980e2312c1172ccc081c24524cb47dc8acc55b', '[\"*\"]', '2024-05-06 20:22:25', NULL, '2024-05-06 20:22:22', '2024-05-06 20:22:25'),
(99, 'App\\Models\\Usuarios', 2, 'auth_token', '83ab181abb32d14cf3a3bddfdf33069d895c9be1bc6ab217ec71caaccd272a01', '[\"*\"]', '2024-05-06 20:25:36', NULL, '2024-05-06 20:25:31', '2024-05-06 20:25:36'),
(100, 'App\\Models\\Usuarios', 2, 'auth_token', 'd42268fd978d3a6c8dbebecfac226aba6c415b3e726db22d48117a085048ec6d', '[\"*\"]', '2024-05-06 20:27:27', NULL, '2024-05-06 20:27:22', '2024-05-06 20:27:27'),
(101, 'App\\Models\\Usuarios', 2, 'auth_token', '7fc5d69cb69a18483a60a44ccd09ca8efa059b5e912ecda66952fe099f7c72d0', '[\"*\"]', '2024-05-06 20:28:02', NULL, '2024-05-06 20:27:58', '2024-05-06 20:28:02'),
(102, 'App\\Models\\Usuarios', 68, 'auth_token', 'ecbf979fb511ebd837ed961b4c817f429821677dc9e41b6f1b63628248393b6b', '[\"*\"]', '2024-05-06 20:30:09', NULL, '2024-05-06 20:30:04', '2024-05-06 20:30:09'),
(103, 'App\\Models\\Usuarios', 2, 'auth_token', '4f4f026a3e9b634a1eb382b175e8d28603382ec7477bab2a23505017a293e5ad', '[\"*\"]', '2024-05-06 20:30:33', NULL, '2024-05-06 20:30:28', '2024-05-06 20:30:33'),
(104, 'App\\Models\\Usuarios', 68, 'auth_token', '4256abe125ee59cecc8bfb2f9cc99c57f10d832311eb3cb6cfdbf77256214337', '[\"*\"]', '2024-05-06 20:32:21', NULL, '2024-05-06 20:32:16', '2024-05-06 20:32:21'),
(105, 'App\\Models\\Usuarios', 2, 'auth_token', 'f6ab0bb8ed477800c86ff2e29badece999f71232fb105d1141444b16f7c2d13e', '[\"*\"]', '2024-05-06 20:37:35', NULL, '2024-05-06 20:32:40', '2024-05-06 20:37:35'),
(106, 'App\\Models\\Usuarios', 2, 'auth_token', 'ee228f421e395c526c1ef126290d7b6186545a05ea534d542cf4d953cda29035', '[\"*\"]', '2024-05-07 01:52:08', NULL, '2024-05-06 20:37:41', '2024-05-07 01:52:08'),
(107, 'App\\Models\\Usuarios', 2, 'auth_token', '812be4a02651f1376be4f3619d293de1cb105d7fca5606a19c9a17cfe0f3b7f2', '[\"*\"]', '2024-05-07 01:52:33', NULL, '2024-05-07 01:52:29', '2024-05-07 01:52:33'),
(108, 'App\\Models\\Usuarios', 2, 'auth_token', '03399f7de9c5de3746296cc42a1729e2b3cfc37a3420d0dd71bfa5b535506f35', '[\"*\"]', '2024-05-07 03:57:06', NULL, '2024-05-07 03:54:07', '2024-05-07 03:57:06'),
(109, 'App\\Models\\Usuarios', 68, 'auth_token', '61593e31642493d6c058b0310d4f060caec8459150394b1a7d194b905457287d', '[\"*\"]', '2024-05-07 03:57:51', NULL, '2024-05-07 03:57:47', '2024-05-07 03:57:51'),
(110, 'App\\Models\\Usuarios', 69, 'auth_token', '88abfcfc39a73678f1ae477ae8931859c9040bf98d205e1f88cbe84a15889a36', '[\"*\"]', '2024-05-07 03:58:20', NULL, '2024-05-07 03:58:16', '2024-05-07 03:58:20'),
(111, 'App\\Models\\Usuarios', 2, 'auth_token', '6ee1de93d9da71b00daef84267b6205f8062e892474b3041e9971080faad627f', '[\"*\"]', '2024-05-07 04:01:23', NULL, '2024-05-07 03:58:47', '2024-05-07 04:01:23'),
(112, 'App\\Models\\Usuarios', 70, 'auth_token', 'd7f2af0ebba264de40434620a4c03cf3543fea938679d481e99842e918bdec44', '[\"*\"]', NULL, NULL, '2024-05-07 03:59:51', '2024-05-07 03:59:51'),
(113, 'App\\Models\\Usuarios', 68, 'auth_token', 'a53653750e535ce8db447cea01be63557b8929e5b7c75ddf09d367625e77a03a', '[\"*\"]', '2024-05-07 05:37:02', NULL, '2024-05-07 04:03:56', '2024-05-07 05:37:02'),
(114, 'App\\Models\\Usuarios', 2, 'auth_token', '99f06e8b8b4301ecb7fa44ab96eac379ba99765d29dfd6c03f04aa80b409a54a', '[\"*\"]', '2024-05-07 05:42:39', NULL, '2024-05-07 05:37:15', '2024-05-07 05:42:39'),
(115, 'App\\Models\\Usuarios', 71, 'auth_token', 'dc701a787f1885548e165ee440060c422e3b41152e72ed1b96fa2af2923a3378', '[\"*\"]', NULL, NULL, '2024-05-07 05:42:07', '2024-05-07 05:42:07'),
(116, 'App\\Models\\Usuarios', 2, 'auth_token', 'd14b6a9661be71e995539b4c987394d70bcb9238e84de477c00c14e86949ef40', '[\"*\"]', '2024-05-07 05:44:33', NULL, '2024-05-07 05:44:29', '2024-05-07 05:44:33'),
(117, 'App\\Models\\Usuarios', 2, 'auth_token', '917683efcbc41f42bace39789d42810bc66f33ea0f244c6d3e031022c57e4bf7', '[\"*\"]', '2024-05-07 05:44:45', NULL, '2024-05-07 05:44:41', '2024-05-07 05:44:45'),
(118, 'App\\Models\\Usuarios', 71, 'auth_token', 'f740bae128d70a9f2183c294adb6acaa81e26423554681f5077a459d0db4c615', '[\"*\"]', '2024-05-07 05:45:32', NULL, '2024-05-07 05:45:02', '2024-05-07 05:45:32'),
(119, 'App\\Models\\Usuarios', 71, 'auth_token', '09faaa2e7f9d85a2d1bd1de1062d424f7746c575d20c3c43faf3b6007da19267', '[\"*\"]', '2024-05-07 05:47:15', NULL, '2024-05-07 05:46:01', '2024-05-07 05:47:15'),
(120, 'App\\Models\\Usuarios', 72, 'auth_token', '20fd586af9627dba388bf1ce3dbd2e5a4ae84734c684c8e8d06f1bd0dd987aaa', '[\"*\"]', NULL, NULL, '2024-05-07 05:47:14', '2024-05-07 05:47:14'),
(121, 'App\\Models\\Usuarios', 72, 'auth_token', '0c877b34471a4ae532ae16fbcc54098b001b5ac76fdf8ccaaa95bbc2cbc5d947', '[\"*\"]', '2024-05-07 05:48:49', NULL, '2024-05-07 05:47:50', '2024-05-07 05:48:49'),
(122, 'App\\Models\\Usuarios', 2, 'auth_token', '3e4b67c7537d9935ee5ed51065adda1856460fa2ded436de788dd02a41cee659', '[\"*\"]', '2024-05-07 05:49:05', NULL, '2024-05-07 05:49:01', '2024-05-07 05:49:05'),
(123, 'App\\Models\\Usuarios', 68, 'auth_token', 'a7fd8eab234f2f292e8d621b92979f9f6e3fcf4747da701d0bea69e82e3668a7', '[\"*\"]', '2024-05-07 05:49:28', NULL, '2024-05-07 05:49:25', '2024-05-07 05:49:28'),
(124, 'App\\Models\\Usuarios', 2, 'auth_token', 'c27fe706bdf2f9ad3872132b209c11a5afca5018505b5b86b5d0c16198d2fea4', '[\"*\"]', '2024-05-07 05:54:25', NULL, '2024-05-07 05:54:20', '2024-05-07 05:54:25'),
(125, 'App\\Models\\Usuarios', 69, 'auth_token', 'e90ab828b1b8b24088ed3836b79ed2a2fa5ae00b313edcac0ceb36106fa64dfb', '[\"*\"]', '2024-05-07 05:55:07', NULL, '2024-05-07 05:55:03', '2024-05-07 05:55:07'),
(126, 'App\\Models\\Usuarios', 2, 'auth_token', 'd07fa4655f33bba2550b098335a881392a7caf2f9ef451686640dfccfb286722', '[\"*\"]', '2024-05-07 06:11:22', NULL, '2024-05-07 06:11:18', '2024-05-07 06:11:22'),
(127, 'App\\Models\\Usuarios', 2, 'auth_token', '024b9ce120f92e8e5a620f326c2ecc538eef133e702a446d99df161d44c4fff2', '[\"*\"]', '2024-05-07 21:24:08', NULL, '2024-05-07 06:12:37', '2024-05-07 21:24:08'),
(128, 'App\\Models\\Usuarios', 73, 'auth_token', 'c28836b4c544d2bf9b6a71debe8967a8d14053290d98adee340761808e94a315', '[\"*\"]', NULL, NULL, '2024-05-07 06:14:53', '2024-05-07 06:14:53'),
(129, 'App\\Models\\Usuarios', 68, 'auth_token', 'fa2d3cd26db36f58ef686a82363716b17e41120dee1e18118c6f3aa9bceb7d97', '[\"*\"]', '2024-05-07 23:08:52', NULL, '2024-05-07 22:40:30', '2024-05-07 23:08:52'),
(130, 'App\\Models\\Usuarios', 2, 'auth_token', '6aa089450cac5dafc5d4f321eb179f3358f07768a89b6ff40e344f58807515a4', '[\"*\"]', '2024-05-07 23:41:10', NULL, '2024-05-07 23:39:49', '2024-05-07 23:41:10'),
(131, 'App\\Models\\Usuarios', 69, 'auth_token', '1e0afe1dfed7df9817e02810760b01141a847a6e394ea6dcdde050103bf76abc', '[\"*\"]', NULL, NULL, '2024-05-07 23:41:22', '2024-05-07 23:41:22'),
(132, 'App\\Models\\Usuarios', 2, 'auth_token', '1db274cc86b5cead485dd1e496d99ab6082c6ea1ce62b2d21924b4539896ecb7', '[\"*\"]', '2024-05-08 02:58:45', NULL, '2024-05-07 23:42:00', '2024-05-08 02:58:45'),
(133, 'App\\Models\\Usuarios', 2, 'auth_token', '27eee5ce011ee691e26f152eb6fdf9a5c3212d72403a9fe097d47f5f5e79d8ff', '[\"*\"]', '2024-05-08 03:38:35', NULL, '2024-05-08 03:07:24', '2024-05-08 03:38:35'),
(134, 'App\\Models\\Usuarios', 2, 'auth_token', 'd074cb0c99dd16ef77074b4ad82b3115dd4dca8a25d26108fc6b01f6ac952288', '[\"*\"]', '2024-05-08 03:47:11', NULL, '2024-05-08 03:47:08', '2024-05-08 03:47:11'),
(135, 'App\\Models\\Usuarios', 2, 'auth_token', 'f5bca55cbe2bce0810e234333b3ff7c3208d42a5427803fd8b05ebc35e5e0bad', '[\"*\"]', '2024-05-08 03:51:18', NULL, '2024-05-08 03:48:27', '2024-05-08 03:51:18'),
(136, 'App\\Models\\Usuarios', 2, 'auth_token', 'ad2abec32a59479d6a5a7f539358ab8a516fffb0b74a87f352825d2851dca2fb', '[\"*\"]', '2024-05-08 03:58:09', NULL, '2024-05-08 03:53:02', '2024-05-08 03:58:09'),
(137, 'App\\Models\\Usuarios', 2, 'auth_token', '810e36c1b04931c1263bdbb81e3ab4f9c5a412dfe76b2ce2defbf13310f2fd83', '[\"*\"]', '2024-05-08 11:11:59', NULL, '2024-05-08 11:11:23', '2024-05-08 11:11:59'),
(138, 'App\\Models\\Usuarios', 2, 'auth_token', '5285306d01a43dfdcedf0096bb9de8bd2bbd66baa4ed44843b0efa13c09610fb', '[\"*\"]', '2024-05-08 19:11:18', NULL, '2024-05-08 11:12:13', '2024-05-08 19:11:18'),
(139, 'App\\Models\\Usuarios', 2, 'auth_token', '3e5e26ba0c850445689731cd1e80403e9b0e87ba70ac62f0334aeecbb4251676', '[\"*\"]', '2024-05-11 01:05:11', NULL, '2024-05-08 22:51:21', '2024-05-11 01:05:11'),
(140, 'App\\Models\\Usuarios', 2, 'auth_token', '5d61ecd3cb95b8cd8effc61b0ff57da7b91da8f7874482713a251114c922d7d6', '[\"*\"]', NULL, NULL, '2024-05-11 20:39:38', '2024-05-11 20:39:38'),
(141, 'App\\Models\\Usuarios', 2, 'auth_token', 'c83092c554956c787fdbe9fe0d0bc98b7a77554031b139481cf4c1348017cd79', '[\"*\"]', NULL, NULL, '2024-05-11 20:39:39', '2024-05-11 20:39:39'),
(142, 'App\\Models\\Usuarios', 2, 'auth_token', '71819942f4adcb1135428f993631c1e1f8e44dc370e32a8eb954ca4090ef53e1', '[\"*\"]', NULL, NULL, '2024-05-11 20:40:42', '2024-05-11 20:40:42'),
(143, 'App\\Models\\Usuarios', 2, 'auth_token', '0f2498b8c5378c65e09cbaf8afd21424e38a72a7a52443c1ae6e2a7cddb6bd94', '[\"*\"]', NULL, NULL, '2024-05-14 18:49:50', '2024-05-14 18:49:50'),
(144, 'App\\Models\\Usuarios', 2, 'auth_token', '2811063fd1123c982cf346a8b77fc1c199f2fc006ba0952376f0d6e2106babf2', '[\"*\"]', NULL, NULL, '2024-05-14 18:50:49', '2024-05-14 18:50:49'),
(145, 'App\\Models\\Usuarios', 2, 'auth_token', 'dde9da8dab7ff5ff644c951e999e77af03b71ef388e1fd9b055e48b511e7870e', '[\"*\"]', NULL, NULL, '2024-05-14 18:50:52', '2024-05-14 18:50:52'),
(146, 'App\\Models\\Usuarios', 2, 'auth_token', '3da24c3c7b2b7ad02406694ab812e956a566a189ce42f973872df33f867440a1', '[\"*\"]', NULL, NULL, '2024-05-14 18:50:53', '2024-05-14 18:50:53'),
(147, 'App\\Models\\Usuarios', 2, 'auth_token', '846bd44eddc888ac6aac3d59b2060a39ced007a22f5034774e3a1c992c06545e', '[\"*\"]', NULL, NULL, '2024-05-14 18:51:06', '2024-05-14 18:51:06'),
(148, 'App\\Models\\Usuarios', 2, 'auth_token', 'c9f4c29572067a54d7e49d5d24829d7a1a712064d21df3df06cdc086536a8ecc', '[\"*\"]', NULL, NULL, '2024-05-14 18:51:18', '2024-05-14 18:51:18'),
(149, 'App\\Models\\Usuarios', 2, 'auth_token', 'ad7c4b4e27eae913e1c855c35992d72d3a3f77b14a2a73f82b6aa52fd36fa0c4', '[\"*\"]', NULL, NULL, '2024-05-14 18:51:19', '2024-05-14 18:51:19'),
(150, 'App\\Models\\Usuarios', 2, 'auth_token', 'b104f6dbe4d30c8e0207e0a28919d2ee7c7080d57de56d84af11f42301088acb', '[\"*\"]', NULL, NULL, '2024-05-14 18:51:19', '2024-05-14 18:51:19'),
(151, 'App\\Models\\Usuarios', 2, 'auth_token', '37c84fe681815e71a036ef15326525a3583f4d2a2367657fab08ecb3c61707ee', '[\"*\"]', NULL, NULL, '2024-05-14 18:51:20', '2024-05-14 18:51:20'),
(152, 'App\\Models\\Usuarios', 2, 'auth_token', '74df5163898921cbdf369d4513849bba16a9deadc8a5574c56da636c8a67bc8f', '[\"*\"]', NULL, NULL, '2024-05-14 18:51:21', '2024-05-14 18:51:21'),
(153, 'App\\Models\\Usuarios', 2, 'auth_token', '60e818938bd0cfed7222f54f953454f9047bfe9baea583fdada9c38fc125caa3', '[\"*\"]', NULL, NULL, '2024-05-14 18:51:22', '2024-05-14 18:51:22'),
(154, 'App\\Models\\Usuarios', 2, 'auth_token', '380c9a39ed841c3042eb0ac22531b12ad6fcbc1323b5607de533d47d5e9289d8', '[\"*\"]', NULL, NULL, '2024-05-14 18:51:23', '2024-05-14 18:51:23'),
(155, 'App\\Models\\Usuarios', 2, 'auth_token', '8368f0f499e7698544d077754f37dd54fecf53381ff18738c3d77f72ffc29368', '[\"*\"]', NULL, NULL, '2024-05-14 18:51:24', '2024-05-14 18:51:24'),
(156, 'App\\Models\\Usuarios', 2, 'auth_token', '0d36ab3b25e6a86021ada066f100427fc3b12f4af80b480af30f7d38ba727d33', '[\"*\"]', NULL, NULL, '2024-05-14 18:51:24', '2024-05-14 18:51:24'),
(157, 'App\\Models\\Usuarios', 2, 'auth_token', '573f45f143d9e1bb77f924326c4df6f54fc7ce390f85a29bcfa09dcd1b493257', '[\"*\"]', NULL, NULL, '2024-05-14 18:51:26', '2024-05-14 18:51:26'),
(158, 'App\\Models\\Usuarios', 2, 'auth_token', '508dcc2cf03cdadfa9014fd204a7c64f05a2f354d2bc9f8c20b70150885f128a', '[\"*\"]', NULL, NULL, '2024-05-14 18:52:28', '2024-05-14 18:52:28'),
(159, 'App\\Models\\Usuarios', 2, 'auth_token', 'da5b2478937cbc9fb6a4b91e27c2242ff52a1eb581275dce104b40cb81b935ba', '[\"*\"]', NULL, NULL, '2024-05-14 18:53:07', '2024-05-14 18:53:07'),
(160, 'App\\Models\\Usuarios', 2, 'auth_token', '68d68f4709baf8d990b9840a68afc136d3e859a0a6e4da79467b2da0dbaeae93', '[\"*\"]', NULL, NULL, '2024-05-14 18:53:54', '2024-05-14 18:53:54'),
(161, 'App\\Models\\Usuarios', 2, 'auth_token', '0b77b50ec160d7c60557d042b79a3f1babfc810d71e732c01980a9427b0c293a', '[\"*\"]', NULL, NULL, '2024-05-14 18:54:55', '2024-05-14 18:54:55'),
(162, 'App\\Models\\Usuarios', 2, 'auth_token', 'dfa9f8f0a279e853111670b961214fbea6c639947269c14d4a556e4c0f501239', '[\"*\"]', NULL, NULL, '2024-05-14 18:55:23', '2024-05-14 18:55:23'),
(163, 'App\\Models\\Usuarios', 2, 'auth_token', '1534d5a241af28ee5187d10b6044f90f6120232be7c809feef5de4ce71cf5a8d', '[\"*\"]', NULL, NULL, '2024-05-14 19:00:12', '2024-05-14 19:00:12'),
(164, 'App\\Models\\Usuarios', 2, 'auth_token', '9c46bd55ac70d964dc546e6a4be1c7b07f22450163946c51be088c5d9610986d', '[\"*\"]', NULL, NULL, '2024-05-14 19:00:22', '2024-05-14 19:00:22'),
(165, 'App\\Models\\Usuarios', 2, 'auth_token', 'da9b78e307b1a220369fe5541930b9f1b54a0e8d486ab6f74afe54e14f2db86d', '[\"*\"]', NULL, NULL, '2024-05-14 19:00:26', '2024-05-14 19:00:26'),
(166, 'App\\Models\\Usuarios', 2, 'auth_token', 'b2c4fe9adf334c513b8c47f459ab0653c07516637c4ade22801f25b613c0526e', '[\"*\"]', NULL, NULL, '2024-05-14 19:02:01', '2024-05-14 19:02:01'),
(167, 'App\\Models\\Usuarios', 2, 'auth_token', 'db6137526a141674694c02a471bbf1f74037d6948f31cd390dbbe998e70470e0', '[\"*\"]', NULL, NULL, '2024-05-14 19:04:09', '2024-05-14 19:04:09'),
(168, 'App\\Models\\Usuarios', 2, 'auth_token', '86da19d052670ec4e063e9b509984fe9767de3ad56c611a3131314eadb866399', '[\"*\"]', NULL, NULL, '2024-05-14 19:05:36', '2024-05-14 19:05:36'),
(169, 'App\\Models\\Usuarios', 2, 'auth_token', '7a31c33f0520cbd14095b2476766b799b0c51eb99931153665cf49fe2a423d56', '[\"*\"]', NULL, NULL, '2024-05-14 19:08:13', '2024-05-14 19:08:13'),
(170, 'App\\Models\\Usuarios', 2, 'auth_token', '1c6ccaeaa0fe60df618d8e909a98c42dadb1187415dc1de7e7551dc07a6caa1e', '[\"*\"]', NULL, NULL, '2024-05-14 19:09:09', '2024-05-14 19:09:09'),
(171, 'App\\Models\\Usuarios', 2, 'auth_token', '657760c48b2458ad716e1f98d0c6488d253be768578b3b10687b18c96b9343f4', '[\"*\"]', NULL, NULL, '2024-05-14 19:19:17', '2024-05-14 19:19:17'),
(172, 'App\\Models\\Usuarios', 2, 'auth_token', '8f6bf4fa51cc5a17dc722909002ab2073d30698514279270508e66b9d4567fb7', '[\"*\"]', NULL, NULL, '2024-05-14 19:20:27', '2024-05-14 19:20:27'),
(173, 'App\\Models\\Usuarios', 2, 'auth_token', '4a298e9f67673b2153d48c3b4a41bc85627bf61440178fd04a672f81181f90df', '[\"*\"]', NULL, NULL, '2024-05-14 19:45:26', '2024-05-14 19:45:26'),
(174, 'App\\Models\\Usuarios', 2, 'auth_token', '893f9f10606a545b8f31881a54c03c7de403216c23583c5ba0cd20298204400d', '[\"*\"]', NULL, NULL, '2024-05-14 19:46:53', '2024-05-14 19:46:53'),
(175, 'App\\Models\\Usuarios', 2, 'auth_token', '8c08669b7b2be4fb5801d0eb36b6466fb315d123a3ca37831098e6205b7a7e9d', '[\"*\"]', NULL, NULL, '2024-05-14 19:47:57', '2024-05-14 19:47:57'),
(176, 'App\\Models\\Usuarios', 2, 'auth_token', 'cb6674e1a1024204474db23d49cb4395395683a1f30f1eea4354c0766bb4e765', '[\"*\"]', NULL, NULL, '2024-05-14 19:50:56', '2024-05-14 19:50:56'),
(177, 'App\\Models\\Usuarios', 2, 'auth_token', 'e670b50bb606776e4554476a2a11f3f321f88a917a534af9f2077eda3a96fd8c', '[\"*\"]', NULL, NULL, '2024-05-14 20:07:40', '2024-05-14 20:07:40'),
(178, 'App\\Models\\Usuarios', 2, 'auth_token', '0099d125137ee90b8275354eaefb6ccedbedbf2099e4064caba57c946b8f9ff5', '[\"*\"]', NULL, NULL, '2024-05-14 20:10:21', '2024-05-14 20:10:21'),
(179, 'App\\Models\\Usuarios', 2, 'auth_token', 'ad89b685f872845266216d9602a8bd0e1e68ed89d4fe30c41e7fb6ad9aac8ed8', '[\"*\"]', NULL, NULL, '2024-05-14 20:11:34', '2024-05-14 20:11:34'),
(180, 'App\\Models\\Usuarios', 2, 'auth_token', '53a5d27720d4b1338683eb2da1c78f5e9d127c1b963a143aa20143e3a7441368', '[\"*\"]', NULL, NULL, '2024-05-14 20:12:44', '2024-05-14 20:12:44'),
(181, 'App\\Models\\Usuarios', 2, 'auth_token', '84b80a31689800e65371d2da47c3a4fd1db5119ff885ea04c5e7af1c24189fa1', '[\"*\"]', NULL, NULL, '2024-05-14 20:13:47', '2024-05-14 20:13:47'),
(182, 'App\\Models\\Usuarios', 2, 'auth_token', '93f5325d5c4ea923e36125241c30462f36056c47860dbd17bb637f08a6f52df6', '[\"*\"]', NULL, NULL, '2024-05-14 20:14:33', '2024-05-14 20:14:33'),
(183, 'App\\Models\\Usuarios', 2, 'auth_token', 'aa6d42039de16cf73733aa3b26471a61a533fa58a2e4cdd01f7d25630bed5207', '[\"*\"]', NULL, NULL, '2024-05-14 20:14:59', '2024-05-14 20:14:59'),
(184, 'App\\Models\\Usuarios', 2, 'auth_token', 'dec217beb8d76ff0d49f03e491079d709958ea90911c8ccaa5ee10f8b97d9c94', '[\"*\"]', NULL, NULL, '2024-05-14 20:17:57', '2024-05-14 20:17:57'),
(185, 'App\\Models\\Usuarios', 2, 'auth_token', '5496558c4bee5363aad26c75ce79e94e5d7a4a899615a77460e5137fe82e9eaf', '[\"*\"]', NULL, NULL, '2024-05-14 20:19:22', '2024-05-14 20:19:22'),
(186, 'App\\Models\\Usuarios', 2, 'auth_token', '69c5eea65ead6bca1d25f3cc78e1384925061a122cf27b31af2c9c3726bf3299', '[\"*\"]', NULL, NULL, '2024-05-14 20:20:03', '2024-05-14 20:20:03'),
(187, 'App\\Models\\Usuarios', 2, 'auth_token', 'bc1ecc2beeaa5f23eb622a3d01123986b06a30a007df17b3990b3fa76b1cfa14', '[\"*\"]', NULL, NULL, '2024-05-14 20:30:06', '2024-05-14 20:30:06'),
(188, 'App\\Models\\Usuarios', 2, 'auth_token', '66bbfff9e41d098e869abacabab9e1e3abcd7aea7bba650a63e0aa6f409ce7d6', '[\"*\"]', NULL, NULL, '2024-05-14 20:36:17', '2024-05-14 20:36:17'),
(189, 'App\\Models\\Usuarios', 2, 'auth_token', '48312383bc1dce11153be4a8a2ea0074f65ec29335616085d427c7b19b2dc896', '[\"*\"]', NULL, NULL, '2024-05-14 20:44:05', '2024-05-14 20:44:05');

-- --------------------------------------------------------

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
CREATE TABLE IF NOT EXISTS `productos` (
  `productoId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(500) NOT NULL,
  `precio` double NOT NULL,
  `activo` enum('t','f') NOT NULL DEFAULT (_utf8mb4't'),
  `perecedero` enum('t','f') NOT NULL DEFAULT (_utf8mb4'f'),
  `codigoBarra` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `minimo` int UNSIGNED NOT NULL,
  `maximo` int UNSIGNED NOT NULL,
  `img` longblob,
  `categoriaId` int UNSIGNED NOT NULL,
  `marcaId` int UNSIGNED NOT NULL,
  `unidadMedidaId` int UNSIGNED NOT NULL,
  `metodo` enum('peps','ueps') NOT NULL DEFAULT 'peps',
  PRIMARY KEY (`productoId`),
  UNIQUE KEY `nombre` (`nombre`),
  KEY `fk_categoriaId_producto` (`categoriaId`),
  KEY `fk_marcaId_producto` (`marcaId`),
  KEY `fk_unidadMedidaId_producto` (`unidadMedidaId`)
) ;

--
-- Dumping data for table `productos`
--

INSERT INTO `productos` (`productoId`, `nombre`, `descripcion`, `precio`, `activo`, `perecedero`, `codigoBarra`, `minimo`, `maximo`, `img`, `categoriaId`, `marcaId`, `unidadMedidaId`, `metodo`) VALUES
(23, 'pedido', 'pedido test', 32.2, 't', 'f', '23231321', 23, 555, NULL, 1, 19, 10, 'peps'),
(22, 'test 2', 'test test 2', 32.2, 't', 'f', '23231321', 23, 555, NULL, 1, 19, 10, 'peps'),
(21, 'test', 'test test', 32.2, 't', 'f', '23231321', 23, 555, NULL, 1, 19, 10, 'peps');

-- --------------------------------------------------------

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
CREATE TABLE IF NOT EXISTS `proveedores` (
  `proveedorId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `razonSocial` varchar(255) NOT NULL,
  `rut` varchar(30) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `direccion` varchar(500) NOT NULL,
  PRIMARY KEY (`proveedorId`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `proveedores`
--

INSERT INTO `proveedores` (`proveedorId`, `razonSocial`, `rut`, `correo`, `direccion`) VALUES
(7, 'Sinsa', '1234213', 'sinsa@gmail.com', 'mdkmfksdf');

-- --------------------------------------------------------

--
-- Table structure for table `telefonos_proveedores`
--

DROP TABLE IF EXISTS `telefonos_proveedores`;
CREATE TABLE IF NOT EXISTS `telefonos_proveedores` (
  `telefonoProveedorId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `telefono` int UNSIGNED NOT NULL,
  `proveedorId` int UNSIGNED NOT NULL,
  PRIMARY KEY (`telefonoProveedorId`),
  KEY `fk_proveedorId_tp` (`proveedorId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tipos`
--

DROP TABLE IF EXISTS `tipos`;
CREATE TABLE IF NOT EXISTS `tipos` (
  `tipoId` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`tipoId`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Miscelanea de tipos de datos particulares que no se repiten en grandes cantidad en la base de datos como pueden serlo: horarios, categorias, cargos, estados, etc...';

--
-- Dumping data for table `tipos`
--

INSERT INTO `tipos` (`tipoId`, `nombre`) VALUES
(1, 'categoria'),
(2, 'unidad de medida'),
(3, 'cargo'),
(4, 'marca');

-- --------------------------------------------------------

--
-- Table structure for table `tipos_instancia`
--

DROP TABLE IF EXISTS `tipos_instancia`;
CREATE TABLE IF NOT EXISTS `tipos_instancia` (
  `tipo_instanciaId` int NOT NULL AUTO_INCREMENT,
  `valor` varchar(255) NOT NULL,
  `tipoId` int NOT NULL,
  PRIMARY KEY (`tipo_instanciaId`),
  KEY `Tipos_Instancia_Tipos` (`tipoId`)
) ENGINE=MyISAM AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='"datos del tipo Tipo"';

--
-- Dumping data for table `tipos_instancia`
--

INSERT INTO `tipos_instancia` (`tipo_instanciaId`, `valor`, `tipoId`) VALUES
(1, 'Herramientas Manuales', 1),
(2, 'Herramientas Eléctricas', 1),
(3, 'Ferretería para Jardín', 1),
(4, 'Materiales de Construcción', 1),
(5, 'Pinturas y Acabados', 1),
(6, 'Seguridad y Protección', 1),
(7, 'Hogar y Organización', 1),
(8, 'Iluminación y Electricidad', 1),
(9, 'Fontanería', 1),
(10, 'Unidad', 2),
(11, 'Kilogramo', 2),
(12, 'Metro', 2),
(13, 'Litro', 2),
(14, 'Cliente', 3),
(15, 'Vendedor', 3),
(16, 'Administrador', 3),
(17, 'Conductor', 3),
(18, 'Bodeguero', 3),
(19, 'Papagayo', 4),
(20, 'Centenario', 4),
(21, 'Libra', 2),
(22, 'Paquete', 2);

-- --------------------------------------------------------

--
-- Stand-in structure for view `unidades_medida`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `unidades_medida`;
CREATE TABLE IF NOT EXISTS `unidades_medida` (
`unidadMedidaId` int
,`tipoId` int
,`nombre` varchar(255)
);

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `usuarioId` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `Apellido` varchar(100) NOT NULL,
  `fechaNacimiento` date DEFAULT NULL,
  `fechaRegistro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `activo` enum('t','f') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 't',
  `cargoId` int NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `apiToken` varchar(255) DEFAULT NULL,
  `direccion` text,
  `rut` varchar(255) DEFAULT NULL,
  `img` longblob,
  PRIMARY KEY (`usuarioId`),
  UNIQUE KEY `uq_email_usuarios` (`email`),
  KEY `Usuarios_Tipos_Instancia` (`cargoId`)
) ENGINE=MyISAM AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Usuarios que participan en la ferreteria: clientes y empleados';

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`usuarioId`, `Nombre`, `Apellido`, `fechaNacimiento`, `fechaRegistro`, `activo`, `cargoId`, `email`, `password`, `apiToken`, `direccion`, `rut`, `img`) VALUES
(2, 'Moises', 'Pavon', '2003-04-30', '2024-04-30 06:00:00', 't', 18, 'moipaburto@gmail.com', '$2y$12$1UyPbAZ..cI4xUQoctZKvO2MrbFKZiZbHlNWSC1W7OSuzRZ6zecS2', NULL, NULL, NULL, 0xffd8ffe000104a46494600010101006000600000ffdb0043000302020302020303030304030304050805050404050a070706080c0a0c0c0b0a0b0b0d0e12100d0e110e0b0b1016101113141515150c0f171816141812141514ffdb00430103040405040509050509140d0b0d1414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414ffc0001108008e008303012200021101031101ffc4001f0000010501010101010100000000000000000102030405060708090a0bffc400b5100002010303020403050504040000017d01020300041105122131410613516107227114328191a1082342b1c11552d1f02433627282090a161718191a25262728292a3435363738393a434445464748494a535455565758595a636465666768696a737475767778797a838485868788898a92939495969798999aa2a3a4a5a6a7a8a9aab2b3b4b5b6b7b8b9bac2c3c4c5c6c7c8c9cad2d3d4d5d6d7d8d9dae1e2e3e4e5e6e7e8e9eaf1f2f3f4f5f6f7f8f9faffc4001f0100030101010101010101010000000000000102030405060708090a0bffc400b51100020102040403040705040400010277000102031104052131061241510761711322328108144291a1b1c109233352f0156272d10a162434e125f11718191a262728292a35363738393a434445464748494a535455565758595a636465666768696a737475767778797a82838485868788898a92939495969798999aa2a3a4a5a6a7a8a9aab2b3b4b5b6b7b8b9bac2c3c4c5c6c7c8c9cad2d3d4d5d6d7d8d9dae2e3e4e5e6e7e8e9eaf2f3f4f5f6f7f8f9faffda000c03010002110311003f00fa229ff7573480539d47978e950738c69b6a96ce00e4d796ebba836a1a8ccec7856da2bbef125c0d3f4998a9c9c735e5d249bb74a47c9f5f5ac26fbe868bb8b238c13ce4fa5471a33677f07a818a8dae911492438ce3e5f6eb9354e4d5226539765da7b11fd6bcaa95e9c5d9b368ca29da5a1a0d191b8e3b7ad5598945e7a62a28f56b67c24d29849fba36939fc69ad224fbc2e4ede0608e6be57368c7154b922eecf67035e119b939683a39c8200f4ad2b598f1c57372df2db300e3e6ce00ab7677e67c8dca98e719adb21e05c56654fdbe2a5c91edd4f2b38e30c2e5f3f654e3cd2475624ca8c9fcaad2c8571c1c62b998db71de19f1ec6b5a3ba911579dc31d3bd7d7627c37a1ecdfb3aeefe67cdd1e3ce697ef28a4bc8d3fb56071c54525f05e738f5a4484ddc72346c015e769ae23c55e253a5fee222a6e07de04e31ef5f8d66d91e3b2bc52c2d78e8f67d0fd8b22c4d2cf2946787dfb3dcf636f883a3f807c368d78e6e354b8f9e3b38cfcd8c1e5bd07f8d794789be366b5af33233fd8e3272b0c4718ff008175af39b8d49eee579ee6569a793ab31ce3e9e950c721909c9cd7d951ab51518d37b23f4dc0f0fe1307fbd9ae6979f437cf892fdce59b24fa9c9a2b257ee8a29fb47dcfa0f6147f917dc7d74a7a66a4dd9e05409938e98ef9accf1578921f0ae8b36a2e37b052228cff001b7f904fe15fa04aa4610e796c7f22deda991f1335eb1d3749314d26d9a5191121c903debc4752f16b0cadbafeed7057919cfe358bae7896e7c41a84b753ceeef29c96381c7b0ed8aa091aed2adc71904f3f8d7c2e3332a95a6d2d91e6d4c449bb23c726f8c5a8fc39f8a1ace9d7f2cd73a0dc5cf98632c4c909600965cf51edef5ed7a5f892d35cd3e2bcb1bd4bd864f996488647d0e7bd7ccffb45588b5f1b9b85e7cc8d5b77be3ffad5cef807e245ff0082ee57c86692c99b32db03dbb941d037e9d6bd3ad8258bc3c6a43e23eca583a58aa51e6d256d0fb27fb4651192d211fef0e9436b502b30dfbd979dd19207e75e7d67e325f14e9705dd95cc735a3afdf4e09f661d548f4ef57ece631daca483b5982f5e3a579f92e03dbe630a55b64f53e6732c357cb29c9c96eb4ecced61be376dbdd8b13d2b4ed6e1213b41ebd4902b90b1bb2d08da02ed1cb31c0c75c9a9ae35636fe4b052038dc549cf07a63dabfa6f094d34afb2d0fc3b3494e32e792f799e89a7de26ddabc8cf4cd6fdac2f2c3bf3919c579d6897723c7e646549c7dc27a9aeef49bb686057670ca46597d3da9e22118ee79d83a8ea3b48d8b5904320c120f722bcdfe2e6822deea0d5610522b93e5ca9d4239ce3f3c1af43566dde620055b90d9e9ed59de34b74d43c1da9c4465a388cc33fecfcc4fe40d7c4e7d8286370cdcf594763f74e01cce796e6d049fbb36933c3635766da79e71b7d31d7f9d6adac24f0a85b8e4fa566473799206ce0839fc7bff2adcb0d51ada178d080ae3e6e01cd7e1f1b5cfed677b6a19dbc6dcd1522dc8038c628aab224fa4358f1bd9e964c7101712f43b7ee8af0ef8cde32bcd61edad59f6c79c2c60e00e0f3c57579e0292093ec2bc93e215c2c9ae6c90e0a8c01e95f479acdc6859753f8d6b5eda0be1dd26e756531dbc32ccf182cdb14b0007527daa79e0da1c839e39c0e99e9d6abf867c5575a2a486c657b766431964382c0f51f4a8eeb5611da4ac4b3b63955e4923a57c4cb96da1c328f32d0f0efda3adcb6a48f8242daa4cb91d83b237f35fcabc476b42d8cee19e4fea2bdd3e37dc47aa5e68bfbcd85e0b9b7319f5c6e4cff00c0b06bc2ee67c3b0207deebe9d38afd0b037742291f74a7c94632bf43a4f08f8c2f7c23a97da6dcf9d04a409ad589db2ff0081f7fafad7a3cff148b473b5aceb6f0bae44520dcd9fafb74fc6bc521b8f463ff01ab70130a1662a7d067fa57ab4e8c69d5f6b1d19cf5b1ae743eaad7343cfa33bdd53e305fc92795149fbb5e8ca7af1c83ed5d2f82fe325d5c6a51c57f0abdb4e55030e4c6aa303e82bc46650fba45238ec2a091da46041d9dfa57b74732c450929295d23e571595e1b170719c773ef7d0f548e68d6480c728907ca51f83fa576fa55fabc015245623fda1923bf18afcf0f0ffc46d7fc37e5c56ba8dcc6aa72abe61dbf957b4780ff00691bd691135682391c3717087e6cfb8e98c66be956734f10929ab33e0aaf0c54c349ca93ba3ebd8efb7b615cecfe550f8a6ffecde14d59b70e6d2541f56429ff00b3571fe0bf885a778c2dc358ddc2d20383167e6cfad2fc51d48fd86d74f0b222ca44aece08036f6fcf07f0af173acc28e1b09394a5ab5a1f6dc199456c4e734a12565169b3cf20b852a0f407ff00ac7fad685bde233282d91dfd6b356d5b6e7807dba1e3ff00ad4d52d1c9c751debf07551d9367f71b4af67b74379aee204ed6971db2a28ac8fb57ae49fad147b461cb13dda3dbe603debc77e245bb47adc922a128e6bd719b6a939c1c715c578cac3fb42d5a48ff00d6c7ce31d473c57da66145d5a365d0fe2d9c5c91e6f6f742350738c76a8b52f115bd8594b3cb3c712a8cb6e3ce3daa84d234323b6dcedcee0dc73e95e1ff001a3517875686dd6474f3221232678af97c2e11622b7b231a71527633be227c421e29d436dbc7b2da172cae7ef16cf5fa702b84694ccc49cd46ae7f1a7aa9ef5fa3d1a31a305089e9f33b25d8b10a800f257f1ab2cd965c0f971d6aa86c2d3d643b460f7ad8cf5b97e06f313cbd8bd7a938a2ea156611b15571cfca6ab5b44e7738e467bd6969fa4cf7d1bc8230b8effd2897baaecd63172d919f22b7dd6e597a354ba3ccd0dd2f3df383dfdab7a0f02ea57b1178a22fc671cf03d6b9fb88a4d3af2447ca9076e3a62b28ca32d99a7b39c359ab23b8d0fc572f85f5c8e7b47668df9d911da41ebd7f0afd09f0ec1078e3c19a7cba8da141342bf2b1cb2fcbd73d7bd7e64691319352b78b6b484b6063935fac9e1dd34dae8fa7c2b11840b6840571823e5e47e82bf3fe309caa42946fe67af94cdd093a91766788f8abe19dde8399acdbed365c90c3aa8f4ae39ace48d80746466e40c76afa9ae2d54c6f1b80c838231c579e78bbc291d9ca6e2340d137703a57c1e171b53e0a87ec195f11cdc552ada9e2cd6329624264515dfb69abb8e00c515ebfd64fa6fed85fca758d27cc05626a10b7da19bf8719ad79173ca9f9876aa97d189a3e4e38ce6bf58945f43f950f36f15786d26ccd16d2ee7053a6783fad7cdff1dfc233c06cf54505c01e54a0f55ea41fa71fad7d777566ed7512958cc5d4bb13923b81f857957c658e1ff8466fe268032c92ac0377519dc49fc857991a31a188f6d1f99a53a319c972ee7c66dc49853920724d4eac0a8e73f4ad9f14f86ffe11fbc501fccb7972636f518ae8f45f0dd9dce9f01923dce5031c67938af7b9d24a4ced8d094a4e1d8e1981fa8f4ab167613decc9142a58b9c0c0aeb26f094307ef269d605278069b67651e8b333596a96d2480e7cb6eb9a3db2e868b0eefef6c767e10f82fa96a5662491561ee7777fa7bd7a1e9df066fee0430d95a49b4901b76393eb557e19fc44b8baba4b5be8a2d9801595ce3b7a57ba4de35b4f0ce9bf6c90a471a26edddcfb0af22ad59b96a7d1d1c3d3e45ca8e7f49f86e9a5c62378595d5769e07e22be60f8f3e0f6f0f78a94c31b797720b22807d7a0f7afa047ed1173ad4b2a68da049772465b134cc02f43d863be2b9fd6aceff00c7de26f03b6aba588af46a82390461823c782c7bfa0ac29d49616f567b20c63856a7c96d51e59f01fe0feb5e3cf1e69768ba75cdbd9dbce92de5c48857c8456079f73d00f426bf5ae6f04cb3784d75987e6b657dadcf201e9fcabcbfc19a7d968ab3471c023dcb9668c60b302719f5e3d6bbab3f165cdae872e96656fb24adb8c7ef5f0f89cde398272acb45748f1614dd37ee9ce5c43f390a46013f5a86eb4a5beb3921600ef18ab531566240e7d6a7b6ec338cf15f18ed1a97e87a30a9283528ee78fdce82d6f71244f92cac41a2bd6ee7c1b6fa9cef742668bcc39d9b41c76a2be8a3846d267abfdad35a1e4dcaeec752314cdbbcede9c60d4a5f6956148c43648e87ad7ec27e77629dc5aaca0ee0b95f941c7b7515e4bf1ab409a4f0bcd342cb32a4eb33ab64370a464fa0c57b06e5ddb8b1e3a0ae6fc550c3756d2c2cbe6a3ab6f8db9de304115cb52274519aa53527d0f89bc4da6fdaad5167e27203287618279c904718e45759e0ff000ecb77e45bf988af8552ec0e3e95a9f12f41b4d06dfca90aa5bccee6dd5939c7cbf9545e18ba7db0cc38d98e8783ef5854a8ed63ea69469d49f3a3bbb9fd9fdb51862912e52475e7690483ed5a5a7fc1082d7cc7bcd334d795d7697c386c7b00719aedfe1ff8c606863dd2fcfd0a935e8b26a96b776929f943f6c573fb491e946941a3e77b5f86761e1df125bcb042f1db2f2d16edc73f8f6af58f1d7c3fb0f11e97651245279325b890a872003ea71dabcff58d5a4bad5ae2ea231ad95bcdb091cefe71d323debdcac6f6caeb41d2de1b98e79c0c00a7071edef49b95ee68a292b1f3aafc0185af1ae2c6df518bcd529b92ed5e24391f30c60e7d8fad7b77c3df02ae92da5b5d335ccfa7ab159241f31246339fa57791a5808d9c449bdf059b1839f7a8f4fd4d16f0c90f3b7823031e95e16775a4b035257d6c61529c63166ed9feec939e7039ce335784e7ae78ac8fb42e723818e3daa68eebe4c678afc755771383951a4b3138e7bd5f85c6e1fddef58904c0e2b4ece4de31d79ada151ca697525ad2e74d670b496c8db49c8a2b5b4fb3916ce10240a36f4c0a2bf58a78697247d11e6b96a7ce073e9c74a880f9b15b5a8e872daca4aa332374aca68cc4d82a437b8afbb7a3b1e0adc82e1be5c605739a97fa5646df994e0f6e315d25c44cb1b1183ea7dab08c2d3c8fb14b9038c719f6ac26696be870daf787ec75c85ad2f2dd240d94466192a48ea0fe03f2af1d8f456d16496d3cddde4c8d196fa7435f43ddf85756b6b69efa6b668a3552e19b91e9fd6bc4bc75b747f15177f9e39e242c3fdadcc0ff00215c53ec7b596cff0078eec8f479e7b572e8e59579dc2bd0bc3df13b4eb6b736f7323194fca53b9c8c715e7da74f1d9dca3e4b4327f0b0e47e557356f04e9babb0bc81a78274e5f63751ea2b3e53e8dc9f42797e14dc7882f31a5df45731348d2082fa509b4939ce3bff00f5ebd3bc39f0f63f0eff00655cea735d4d73624b98eda62b09f6da0d796f87f41d02190adeea1a8861f764f3790723d8d76b0f866db509a396db59bf92d9073998963ec7e51fceaaa5b9743aa9c5b573b7d73c44f717064b16dc83ef8ddce4f415d0f86da5b4b08de67fdebfcc6b8ff0ce87690cd159db79850be6492462c7f126bbd5552abb7e8171d00afcef89aa5474e34a9abdf731a934fdd356def873db3d4d5c4bb1b7ef66b07c87ea3271ce077ab36f14b900fde6fe12400057e73f57acf4e5672bb773a0b6bac950bc92715d5f85ec9af260cc08894f2defe9593e0ff0bff6c6f9bed09e446db4e01cb1f4fa57a2d8d98b25589155550e76e0f4afbec8720ab52a2c4625592d8f2ab568aba45e5da802ab1205141058e761fc28afd6553a695ac797cccf3ed32eacfc49a55aea76a41b7bb412a77033d47d41a25f0f5accd968d49f615e33fb36f8d8b0b9f0dcee48626e2d0377ec547e79fc2bddda64863324922a2633b9d8281eb5584aeb114635118d7a5ecaa34ccc8fc2762c1bf75fa535747b2b39084b74181d4a0c5656b1f15f40d159d12e9af5946596d57763ea7b0ed9f7af13f8a9fb45f8bf42d9a8693a76969a1c8bb64f3e379a489bb16219400707f4ae8945f6308ae6763d67e28cb1587842e669e5586d76ee695804518ed5f0bf8e3c51178a75e9a7b6ff008f5886c8f230c792493f8e69df103e2a7893e24dc87d735269a051fbbb4808481476c283cfd5b35cad9c46360558e3d2b82566cfa0c1e1dd15cd2356df52974f8c2b979636eb83c81f5aee7c0de34b4b0be88dd47f6ab573b5f9c102b84f24b2f1dfad442ce58d834476107271516be87aba9f50595af852ea05bc5b3846e396673daa2d56fb48b158e1d322559651b82639fc3dabe7fd0aef589271696b234c653f70006bda7c1de117d3adfcebc99ee6f64e5ddff83fd91e9ffd6ae69b51f53aa9b91a93eb9a9e8fa293a3e8efa85c952f3b64641f61d4fd0568f827c557fe22b557f2ccf7c01f36dd10218b033b482320d6ce89a7bac8b242db2456dcacbc104739ff003eb5f4af893e1ef87f51f0f9d765b31a6df359adc4b7564a124188f71257eeb103d4135587cbe962d49b5a9e762aac684929f53e5fb2f8a76b73ab4ba79b2921b889cc72c6c7e68ce78fc3045759616b3eaf2476f6a3cd9e66da149ce33dff002cd717fd8f3e9fe23babd92cdae750d72569524541bca8550a0638e15413f5aa7e036d52df509356d4a19acee2e273f6558e42045f360053ebc13f8d71cb2ea49d947437a9454d5a0f5b1f5d7867c3f0f8774b86d12466455e4b609dddf918fd466b51d17aeecd78ff00867f68cd1b56d4ad747bc8ae3edebfb99ee48030ea4f3b4fcd82077fc2bd6e29d6650f1b2cb1300c8d1820153d3835ecc22f9547648f9ba94e71779225ddfed1a29db4ff0074d15a59981f32fc30fd9e6ef43d4acf54d4b552b7909dc20b41f2af1d0b1ebf857b7c7e1e86550b347f685c60f99865fa63d6b4f4254bcd36dee546c59630e13d2b40460700003af15ec617074b0b0e4a7b1c95abcaacaf239b93e1ee8572a7ccd26d4ffbb185fe55c478abf673b0d763997489d2d9a65224b4b95dd1b0ef96ea3b7b57b2468a31919a59e209fbc50015e7ebed5dbcb17b98dd9f9a9f193e00f88fe145c7daeeeca47d0a63fbbbb56f32343fdd661c2f7c71dabcd96011c854004f1c6738cfa9ef5faf1796367e24d327b2d4ad21beb2ba4293dbcebb91d71d315f0a7c7cfd9762f87fab2de683a8a8d2ae49922b5b8cef8867eee403c0ed5e162f0decdf3ad8fa2c0e29d55ece7d0f9fe38f690adc13deb46c74cb9d52e92dad2312cac7000cfe75d0681f0ceff56bd1049770441782ca4b13f9ad7adf86be1edbf87e1f251c48dde5230d9fad793527cab4dcfa1a70775739ef07783d34951b40698f57c73eff00ad77f676b2f002f03d6b42c7458ad987435d159d9c7b768503777eb8ae1945cb5675ab5ec8bde03f0eb6b5ac595985ff005d200ecbfc2a3963f9035f4f6a76914f6ad6ac81e29331ba7fb38c103f0c7e66bcd7e0a6831c4971ab9da640de546b8fba3bff002af4d99beeaf6c81f8735f6397505469ddf53e2332aded2b72ae8796ea5f04ad1747d46d347b89edef2689e3b6b9b825c5beeea06325723bd65fc37f82d7fa44766de277b4bb162d9b586df73a3b018dccc40ed9e2bd90a29272aa7ea39a5da3e638e48ebdebb3eaf0ec73ac5d6e5716cf17f8b3f01878b354d3f5fd024b1d3759b75f2e469136ace84e0e5874233c139ae82d74bf12f87a3b2b6b886d754b0891623716ccc93ae3a960c70cbeea076af47002e38e474a82450ca47f3e6a25878b57447d62a4a1c9519cf79cadca48c57b654d1579ed06e3f337fdf468ae3f60ccf9cfffd9),
(65, 'Empleado de prueba', 'Prueba', '2004-05-03', '2024-05-03 06:00:00', 'f', 16, 'prueba@gmail.com', '$2y$12$D6VdMyMavrzm12XufE.l8uzkkgLSifybjJlaSmAg3CG0p4ecRzbnu', NULL, NULL, NULL, NULL),
(66, 'rewd', 'rew', NULL, '2024-05-03 06:00:00', 'f', 14, NULL, '$2y$12$usqqAoHG/Y167OK.YrJT8etixFFTtJAKOmayvolIKZRfOxV6GGrsm', NULL, 'rew', NULL, NULL),
(67, 'Sergio', 'Melendez', '2003-01-17', '2024-05-04 06:00:00', 'f', 16, 'sergio@gmail.com', '$2y$12$y07XeEeIjSAZ.sgGA7FQb.YaTTam9BlAFfjV32lxGBX2zf14tPg0e', NULL, NULL, NULL, NULL),
(68, 'Henry', 'Josue', '2003-05-08', '2024-05-06 06:00:00', 't', 16, 'henry@hotmail.com', '$2y$12$ZpL0wID9yssy/f7/sexyf.X.KTq174PXEFWp5KUaxvUKh1DEvWl1C', NULL, NULL, NULL, NULL),
(69, 'Sergio', 'Melendez', '2004-05-04', '2024-05-06 06:00:00', 't', 15, 'sergio@hotmail.com', '$2y$12$E6YDBBaRP/uZX6aQyRdOx.x5axmEEH9MIkq8hALLYxINTbEqC6xkO', NULL, NULL, NULL, NULL),
(56, 'Moises OK', 'Pavon', NULL, '2024-05-03 06:00:00', 'f', 14, NULL, '$2y$12$ENKU4FpbX8iZZm0dz5Xg1uyMXoWnU.mUJ6cmre/A2js0Xe5AXuMQC', NULL, 'Villa Venezuela', NULL, NULL),
(73, 'Roman', 'Boza', '2002-06-12', '2024-05-06 06:00:00', 'f', 16, 'romangrios@gmail.com', '$2y$12$dUl4lVUO8P7EwTtih7nbtuqbXQtrHNMRjBtEnBIGmxdNJ5Gv.GkyO', NULL, NULL, NULL, NULL),
(72, 'Armando', 'quintanilla', '2002-07-04', '2024-05-06 06:00:00', 'f', 16, 'armando@gmail.com', '$2y$12$05RjpfbcrgmT845zMmfCR.l/ttSuiS7Ha.VLehDFjZ.6n10KVtVaK', NULL, NULL, NULL, NULL),
(71, 'Pepito', 'Amador', '2002-01-16', '2024-05-06 06:00:00', 'f', 17, 'pepitoamador@hotmail.com', '$2y$12$0Of/twcnPXCRY.IBYK2/7.N7MG6VcI.vS1lmXXVZYVRO.yAXmKn7.', NULL, NULL, NULL, NULL),
(70, 'Luis', 'Chavez', '1925-05-10', '2024-05-06 06:00:00', 'f', 18, 'luischavez@gmail.com', '$2y$12$9PyB.aQYIDBW3BAjVsWCVOppIypiXgPGsVW1r2mIKb1YRiyx0/Xfe', NULL, NULL, NULL, NULL);

--
-- Triggers `usuarios`
--
DROP TRIGGER IF EXISTS `verificar_fecha_nacimiento_empleado`;
DELIMITER $$
CREATE TRIGGER `verificar_fecha_nacimiento_empleado` BEFORE INSERT ON `usuarios` FOR EACH ROW BEGIN
	IF NEW.cargoId != 14 AND New.fechaNacimiento IS NULL THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Es necesario registrar la fecha del empleado';
	END IF;
    
    IF NEW.cargoId != 14 AND (YEAR(CURDATE()) - YEAR(NEW.fechaNacimiento)) < 16 THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El empleado o empleada no puede tener menos de 16 años';
	END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
CREATE TABLE IF NOT EXISTS `ventas` (
  `ventaId` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `clienteId` int UNSIGNED NOT NULL,
  `empleadoId` int UNSIGNED NOT NULL,
  `fecha` date NOT NULL,
  `fechaLimite` date DEFAULT NULL,
  `mora` double DEFAULT NULL,
  PRIMARY KEY (`ventaId`),
  KEY `fk_clienteId_ventas` (`clienteId`),
  KEY `fk_empleadoId_ventas` (`empleadoId`)
) ;

--
-- Triggers `ventas`
--
DROP TRIGGER IF EXISTS `validar_ventas`;
DELIMITER $$
CREATE TRIGGER `validar_ventas` BEFORE INSERT ON `ventas` FOR EACH ROW BEGIN
    DECLARE cargoIdEmpleado INT;
    -- Verificar que los cargos de estos usuarios correspondan a sus roles
    SELECT cargoId INTO cargoIdEmpleado FROM Usuarios WHERE cargoId = NEW.empleadoId;
    
	IF cargoIdEmpleado = 14 THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Un cliente que no sea empleado no puede realizar ventas';
	END IF;
    
    -- validar fecha de registro de la venta
    IF NEW.fecha != CURDATE() THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La fecha de registro no coincide con la creacion de este';
	END IF;
    
    -- validar que la fecha limite no sea anterior o igual a la fecha de registro de la venta
	IF NEW.fechaLimite <= NEW.fecha THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La fecha limite no debe ser menor o igual a la fecha en que se realizo la orden';
	END IF;
    
    -- validar que si hay fecha limite, hay mora
	IF (NEW.fechaLimite IS NULL AND NEW.mora IS NOT NULL) OR (NEW.fechaLimite IS NOT NULL AND NEW.mora IS NULL) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Si estableces una fecha limite debes tambien establecer una mora';
	END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure for view `cargos`
--
DROP TABLE IF EXISTS `cargos`;

DROP VIEW IF EXISTS `cargos`;
CREATE ALGORITHM=UNDEFINED DEFINER=`admin`@`localhost` SQL SECURITY DEFINER VIEW `cargos` (`cargoId`, `tipoId`, `nombre`) AS   select `ti`.`tipo_instanciaId` AS `tipo_instanciaId`,`ti`.`tipoId` AS `tipoId`,`ti`.`valor` AS `valor` from (`tipos_instancia` `ti` join `tipos` `t` on((`t`.`tipoId` = `ti`.`tipoId`))) where (`ti`.`tipoId` = 3)  ;

-- --------------------------------------------------------

--
-- Structure for view `categorias`
--
DROP TABLE IF EXISTS `categorias`;

DROP VIEW IF EXISTS `categorias`;
CREATE ALGORITHM=UNDEFINED DEFINER=`admin`@`localhost` SQL SECURITY DEFINER VIEW `categorias` (`categoriaId`, `tipoId`, `nombre`) AS   select `ti`.`tipo_instanciaId` AS `tipo_instanciaId`,`ti`.`tipoId` AS `tipoId`,`ti`.`valor` AS `valor` from (`tipos_instancia` `ti` join `tipos` `t` on((`t`.`tipoId` = `ti`.`tipoId`))) where (`ti`.`tipoId` = 1)  ;

-- --------------------------------------------------------

--
-- Structure for view `marcas`
--
DROP TABLE IF EXISTS `marcas`;

DROP VIEW IF EXISTS `marcas`;
CREATE ALGORITHM=UNDEFINED DEFINER=`admin`@`localhost` SQL SECURITY DEFINER VIEW `marcas` (`marcaId`, `tipoId`, `nombre`) AS   select `ti`.`tipo_instanciaId` AS `tipo_instanciaId`,`ti`.`tipoId` AS `tipoId`,`ti`.`valor` AS `valor` from (`tipos_instancia` `ti` join `tipos` `t` on((`t`.`tipoId` = `ti`.`tipoId`))) where (`ti`.`tipoId` = 4)  ;

-- --------------------------------------------------------

--
-- Structure for view `unidades_medida`
--
DROP TABLE IF EXISTS `unidades_medida`;

DROP VIEW IF EXISTS `unidades_medida`;
CREATE ALGORITHM=UNDEFINED DEFINER=`admin`@`localhost` SQL SECURITY DEFINER VIEW `unidades_medida` (`unidadMedidaId`, `tipoId`, `nombre`) AS   select `ti`.`tipo_instanciaId` AS `tipo_instanciaId`,`ti`.`tipoId` AS `tipoId`,`ti`.`valor` AS `valor` from (`tipos_instancia` `ti` join `tipos` `t` on((`t`.`tipoId` = `ti`.`tipoId`))) where (`ti`.`tipoId` = 2)  ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
