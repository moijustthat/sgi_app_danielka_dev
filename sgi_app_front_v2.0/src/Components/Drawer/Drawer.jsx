import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import icons from '../../Icons/IconLibrary';
import './Drawer.css'
const menuIcons = [
    {
        label: 'Reportes',
        icon: icons.reports,
        url: '/',
				children: [
					{
						label: "Resumen de ventas",
						icon: icons.reportSelling,
						url: '/',
					},
					{
						label: "Ventas por articulo",
						icon: icons.articleSelling,
						url: '/reportes/ventas/articulo',
					},
					{
						label: "Ventas por categoria",
						icon: icons.categorySelling,
						url: '/reportes/ventas/categoria',
					},
					{
						label: "Ventas por marca",
						icon: icons.brandSelling,
						url: '/reportes/ventas/marca',
					},
					{
						label: "Ventas por emplead@",
						icon: icons.employeeSelling,
						url: '/reportes/ventas/empleado',
					},
					{
						label: "Ventas por pago",
						icon: icons.payingSelling,
						url: '/reportes/ventas/pago',
					},
					{
						label: "Descuentos",
						icon: icons.discountSelling,
						url: '/reportes/descuentos',
					},
					{
						label: "Compras",
						icon: icons.orderReport,
						url: '/reportes/compras',
					}
				]
    },
    {
        label: 'Inventario',
        icon: icons.inventory,
				children: [
					{
						url: "/inventario/articulos",
						label: 'Articulos',
						icon: icons.articles
				},
				{
						url: "/inventario/categorias",
						label: 'Categorias',
						icon: icons.categorySelling
				},
				{
						url: "/inventario/marcas",
						label: 'Marcas',
						icon: icons.brandSelling
				},
				{
						url: "/inventario/almacenes",
						label: 'Almacenes',
						icon: icons.warehouse
				},
				{
						url: "/inventario/proveedores",
						label: 'Proveedores',
						icon: icons.supplier
				},
				]
    },
		{
			label: 'Stock',
			icon: icons.delivery,
			children: [
				{
					url: "/stock/entradas",
					label: 'Entrada de stock',
					icon: icons.entry
			},
			{
					url: "/stock/listado",
					label: 'Listado',
					icon: icons.list
			},
			{
					url: "/stock/devolucion",
					label: 'Devoluciones',
					icon: icons.return
			},
			{
					url: "/stock/perdida",
					label: 'Perdidas',
					icon: icons.expired
			},
			{
					url: "/stock/orden",
					label: 'Ordenes',
					icon: icons.orderReport
			},
			]
	},
    {
        label: 'Ventas',
        icon: icons.sell,
				url: 'ventas/caja',
				children: []
    },
    {
        label: 'Facturacion',
        icon: icons.invoice,
				children: [
					{
						url: "facturacion/recibos/clientes",
						label: 'Recibos de clientes',
						icon: icons.smallInvoice
					},
					{
						url: "facturacion/recibos/proveedores",
						label: 'Recibos de proveedores',
						icon: icons.receipt
					},
					{
						url: "facturacion/cuentas/cobrar",
						label: 'Cuentas por cobrar',
						icon: icons.handDollar
					},
					{
						url: "facturacion/cuentas/pagar",
						label: 'Cuentas por pagar',
						icon: icons.deposit
					},
				]
    },
    {
        label: 'Empleados',
        icon: icons.employees,
				children: [
					{
						url: "empleados/lista",
						label: 'Lista de empleados',
						icon: icons.peopleList
					},
					{
						url: "empleados/permisos",
						label: 'Gestion de permisos',
						icon: icons.access
					},
				]
    },
    {
        label: 'Clientes',
        icon: icons.clients,
				url: 'clientes',
				children: []
    },
    {
        label: 'Configuracion',
        icon: icons.settings,
				children: [
					{
						url: "configuracion/cuenta",
						label: 'Cuenta',
						icon: icons.femaleAccount
				},
				{
						url: "configuracion/empresa",
						label: 'Empresa',
						icon: icons.store
				},
				{
						url: "configuracion/general",
						label: 'Configuracion general',
						icon: icons.generalSettings
					},
				]
    },
    {
        label: 'Salir',
        icon: icons.logout,
				url: '/login',
				children: []
    },
]

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer({children}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
	const [headerIcons, setHeaderIcons] = React.useState(menuIcons[0].children)
	const navigate = useNavigate();
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar 
        sx={{
						overflow: "scroll",
            background: "#FFFFFF",
        }}
        position="fixed" 
        open={open}
        >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 1,
              marginLeft: -2,
              ...(open && { display: 'none' }),
            }}
          >
            <div style={{
              background: "#EDE7F6"
            }}>
            {icons.menuIcon}
            </div>
          </IconButton>
          <List dense sx={{ display: 'flex'}}>
          {headerIcons.map((option, index) => (
            <ListItem key={option.label} disablePadding sx={{ display: 'flex', flexDirection: "column" }}> 
              <ListItemButton
                onClick={
                    ()=>{
                      navigate(option.url)
                    }
                }
                sx={{
                  minHeight: 48,
                  justifyContent: 'initial',
                  px: 1,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 1,
                    justifyContent: 'center',
                  }}
                >
                  {option.icon}
								</ListItemIcon>
								<ListItemText secondary={option.label} />             
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        </Toolbar>
      </AppBar>
      <Drawer 
        variant="permanent" 
        open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? icons.rigthArrow : icons.leftArrow}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuIcons.map((option, index) => (
            <ListItem key={option.label} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={
                    ()=>{
											setHeaderIcons(option.children)
                      navigate(!!!option.url ? option.children[0].url : option.url)
                    }
                }
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {option.icon}
                </ListItemIcon>
                <ListItemText primary={option.label} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
