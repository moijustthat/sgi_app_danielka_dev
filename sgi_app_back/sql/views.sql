USE sgi_danielka_sys_bd;

-- Eliminar la vista existente si ya existe
DROP VIEW IF EXISTS `vw_productos`;

-- Crear una nueva vista llamada `vw_productos`
CREATE ALGORITHM=UNDEFINED 
DEFINER=`admin`@`localhost` 
SQL SECURITY DEFINER 
VIEW vw_productos AS
SELECT 
    p.productoId AS id,
    p.img AS Imagen,
    p.nombre AS Nombre,
    p.descripcion AS Descripcion,
    p.categoriaId AS Categoria,
    p.marcaId AS Marca,
    p.unidadMedidaId AS `Unidad de medida`,
    p.precio AS `Precio de venta`,
    p.activo AS Estado,
    p.perecedero AS Caducidad,
    p.codigoBarra AS `Codigo de barra`,
    p.minimo AS Minimo,
    p.maximo AS Maximo,
    p.metodo AS Metodo,
    COALESCE(i.Disponible, 0) - COALESCE(dv.`Total vendido`, 0) AS Disponible,	
    COALESCE(dv.`Total vendido`, 0) AS `Total vendido`
FROM productos p
JOIN categorias c ON p.categoriaId = c.categoriaId
JOIN unidades_medida um ON p.unidadMedidaId = um.unidadMedidaId
JOIN marcas mar ON p.marcaId = mar.marcaId
LEFT JOIN (
    SELECT productoId, 
           SUM(IFNULL(cantidad, 0)) AS Disponible
    FROM inventario
    GROUP BY productoId
) i ON p.productoId = i.productoId
LEFT JOIN (
    SELECT productoId,
           SUM(IFNULL(cantidad, 0)) AS `Total vendido`
    FROM detalles_venta dv
    GROUP BY productoId
) dv ON p.productoId = dv.productoId;




DROP VIEW IF EXISTS `vw_ventas`;

CREATE ALGORITHM=UNDEFINED DEFINER=`admin`@`localhost` SQL SECURITY DEFINER 
VIEW `vw_ventas` AS 
SELECT 
    `v`.`ventaId` AS `id`,
    CONCAT(YEAR(`v`.`fecha`), `v`.`ventaId`) AS `#Num`,
    `v`.`estado` AS `Estado`,
    `v`.`fecha` AS `Fecha emision`,
    ROUND(
        IFNULL(
            (
                (
                    SUM(`vd`.`precio` * `vd`.`cantidad`) - 
                    SUM(
                        IFNULL(`vd`.`descuento`, 0) * `vd`.`precio` * (IFNULL(`vd`.`porcentaje`, 0) / 100)
                    )
                ) +
                (
                    SUM(`vd`.`precio` * `vd`.`cantidad`) * IFNULL(`v`.`mora`, 0) * 
                    (
                        CASE 
                            WHEN IFNULL(`v`.`fechaLimite`, CURDATE()) <= CURDATE() 
                            THEN TIMESTAMPDIFF(MONTH, IFNULL(`v`.`fechaLimite`, CURDATE()), CURDATE()) 
                            ELSE 0 
                        END
                    )
                ) - IFNULL(`abo`.`Pagado`, 0)
            ),
            0
        ),
        2
    ) AS `Debido`,
    CONCAT(
        DAYOFMONTH(`v`.`fechaLimite`), ' de ',
        ELT(MONTH(`v`.`fechaLimite`), 
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ), 
        ' de ', YEAR(`v`.`fechaLimite`)
    ) AS `Fecha limite de pago`,
    IFNULL(`abo`.`Pagado`, 0) AS `Pagado`,
    DATE_FORMAT(`v`.`fecha`, '%Y-%m-%d') AS `Fecha`,
    TIME_FORMAT(`v`.`hora`, '%r') AS `Hora`,
    CONCAT(`c`.`Nombre`, ' ', `c`.`Apellido`) AS `Cliente`,
    IF(
        `vd`.`fechaLlegada` IS NULL,
        'Esperando',
        'Recibida'
    ) AS `Estado entrega`,
    CONCAT(
        IFNULL(
            CONCAT(
                DAYOFMONTH(`vd`.`fechaLlegada`), ' de ',
                ELT(MONTH(`vd`.`fechaLlegada`),
                    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
                ),
                ' de ', YEAR(`vd`.`fechaLlegada`)
            ),
            CONCAT(
                DAYOFMONTH(`vd`.`fechaEstablecida`), ' de ',
                ELT(MONTH(`vd`.`fechaEstablecida`),
                    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
                ),
                ' de ', YEAR(`vd`.`fechaEstablecida`)
            )
        )
    ) AS `Fecha de entrega`,
    CONCAT(`emp`.`Nombre`, ' ', `emp`.`Apellido`) AS `Venta hecha por`,
    ROUND(
        (SUM(`vd`.`precio` * `vd`.`cantidad`) / 1.15),
        2
    ) AS `Subtotal`,
    ROUND(
        SUM(IFNULL(`vd`.`descuento`, 0) * `vd`.`precio` * (IFNULL(`vd`.`porcentaje`, 0) / 100)),
        2
    ) AS `Descuento`,
    ROUND(
        (
            SUM(`vd`.`precio` * `vd`.`cantidad`) * IFNULL(`v`.`mora`, 0) * 
            (
                CASE 
                    WHEN IFNULL(`v`.`fechaLimite`, CURDATE()) <= CURDATE() 
                    THEN TIMESTAMPDIFF(MONTH, IFNULL(`v`.`fechaLimite`, CURDATE()), CURDATE()) 
                    ELSE 0 
                END
            )
        ),
        2
    ) AS `Cargos por mora`,
    ROUND(
        (
            (
                SUM(`vd`.`precio` * `vd`.`cantidad`) - 
                SUM(
                    IFNULL(`vd`.`descuento`, 0) * `vd`.`precio` * (IFNULL(`vd`.`porcentaje`, 0) / 100)
                )
            ) +
            (
                SUM(`vd`.`precio` * `vd`.`cantidad`) * IFNULL(`v`.`mora`, 0) * 
                (
                    CASE 
                        WHEN IFNULL(`v`.`fechaLimite`, CURDATE()) <= CURDATE() 
                        THEN TIMESTAMPDIFF(MONTH, IFNULL(`v`.`fechaLimite`, CURDATE()), CURDATE()) 
                        ELSE 0 
                    END
                )
            )
        ),
        2
    ) AS `Total`
FROM 
    `ventas` `v`
    JOIN `detalles_venta` `vd` ON `vd`.`ventaId` = `v`.`ventaId`
    JOIN `usuarios` `c` ON `c`.`usuarioId` = `v`.`clienteId`
    JOIN `usuarios` `emp` ON `emp`.`usuarioId` = `v`.`empleadoId`
    LEFT JOIN (
        SELECT 
            `abonos`.`ventaId` AS `ventaId`,
            ROUND(IFNULL(SUM(`abonos`.`monto`), 0), 2) AS `Pagado`
        FROM 
            `abonos`
        GROUP BY 
            `abonos`.`ventaId`
    ) `abo` ON `abo`.`ventaId` = `v`.`ventaId`
GROUP BY 
    `v`.`ventaId`;



DROP VIEW IF EXISTS `vw_abonos_venta`;

CREATE ALGORITHM=UNDEFINED DEFINER=`admin`@`localhost` SQL SECURITY DEFINER 
VIEW `vw_abonos_venta` AS 
SELECT 
    `abo`.`ventaId` AS `ID venta`,
    `abo`.`abonoId` AS `Num Abono`,
    `abo`.`fecha` AS `Fecha`,
    `abo`.`hora` AS `Hora`,
    `abo`.`monto` AS `Monto`
FROM 
    `abonos` AS `abo`
WHERE 
    `abo`.`ventaId` IS NOT NULL;
    
    
    
-- Eliminar la vista existente si ya existe
DROP VIEW IF EXISTS `vw_detalles_venta`;
-- Crear una nueva vista llamada `vw_detalles_venta`
CREATE ALGORITHM=UNDEFINED 
DEFINER=`admin`@`localhost` 
SQL SECURITY DEFINER 
VIEW `vw_detalles_venta` AS
SELECT 
    `v`.`ventaId` AS `ventaId`,
    `vd`.`detalle_ventaId` AS `id`,
    `p`.`nombre` AS `Producto`,
    `p`.`descripcion` AS `Descripcion`,
     `vd`.`cantidad` AS `Cantidad`,
    `vd`.`precio` AS `Precio`,
    `vd`.`descuento` AS `Con descuento`,
    `vd`.`porcentaje` AS `Descuento`
FROM 
    `detalles_venta` `vd`
    JOIN `ventas` `v` ON `v`.`ventaId` = `vd`.`ventaId`
    JOIN `productos` `p` ON `vd`.`productoId` = `p`.`productoId`;

select * from vw_ordenes;

create view vw_top_productos as
SELECT dv.productoId, p.nombre, SUM(dv.cantidad) as `cantidad` FROM
detalles_venta dv JOIN productos p ON p.productoId = dv.productoId
GROUP BY dv.productoId
order by `cantidad`
DESC
LIMIT 7;

select * from vw_top_productos;


-- Crear tabla movimiento
CREATE TABLE IF NOT EXISTS movimiento (
    movimientoId INT AUTO_INCREMENT PRIMARY KEY,
    monto FLOAT NOT NULL,
    fecha DATE NOT NULL DEFAULT CURDATE(),
    hora TIME NOT NULL DEFAULT CURTIME(),
    empleadoId INT NOT NULL,
    tipo ENUM('ingreso', 'extraccion') NOT NULL,
    FOREIGN KEY (empleadoId) REFERENCES usuarios(usuarioId)
);