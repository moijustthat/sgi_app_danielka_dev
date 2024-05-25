import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { visuallyHidden } from '@mui/utils';
import BasicMenu from '../BasicMenu/BasicMenu';
import { Divider, ListItemButton, MenuItem, TextField, Alert } from '@mui/material';
import { BsThreeDots } from "react-icons/bs";

import SearchField from '../SearchField/SearchField';

import './Table.css';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, columns, actionsShow } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const headCells = columns.map(column => {
    return {
      id: column,
      numeric: false,
      disablePadding: true,
      label: column,
    };
  });

  if (actionsShow) {
    headCells.unshift({
      id: 'Acciones',
      numeric: false,
      disablePadding: true,
      label: 'Acciones',
    });
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ whiteSpace: 'nowrap', maxWidth: '200px' }} // Ajusta estos estilos según necesites
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const {
    numSelected,
    generalActions,
    setSearchText,
    selected,
    setSelected
  } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        <SearchField setSearchText={setSearchText} />
      </Typography>
      {generalActions.map(action => {
        if (action.condition(numSelected)) {
          return (
            <Tooltip onClick={() => { action.action(selected); setSelected([]) }} key={action.label} title={action.label}>
              <IconButton>
                {action.icon}
              </IconButton>
            </Tooltip>
          )
        }
      })}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function GeneralTable({requestUpdate=null, footer = '', dense = false, edit = null, setEdit = () => null, generalActions = [], editables = [], actions = [], rows = [[]], setRows = () => null, empty = <h1>Tabla sin contenido</h1>, pagination = true }) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchText, setSearchText] = React.useState('');
  const [errorInput, setErrorInput] = React.useState([null, null, null]);

  function initEditables(edit) {
    const fields = Object.create({});

    for (let editable of editables) {
      if (editable.type === 'select') fields[editable.label] = !edit ? null : editable.validation().find(item => item.label === rows.find(row => row.id === edit)[editable.label]).value;
      else fields[editable.label] = !edit ? null : rows.find(row => row.id === edit)[editable.label];
    }
    return fields;
  }

  const [updates, setUpdates] = React.useState(initEditables(edit));

  const actionsButton = <ListItemButton>
    <BsThreeDots />
  </ListItemButton>;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    if (edit) return;

    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (value, row, editable) => {
    let valid = editable.validation(value);
    if (!valid[0]) {
      setErrorInput([row.id, editable.label, valid[1]]);
      return;
    } else {
      setErrorInput([null, null, null]);
    }

    setUpdates({
      ...updates,
      [editable.label]: value
    });
  };

  const handleUpdate = (e, request) => {
    e.stopPropagation();
    const updated = Object.create({});
    const keys = Object.keys(updates);
    const index = rows.findIndex(r => r.id === edit);

    function update() {
      // actulizar en la lista
      setRows((prev) => {
        // copia de las filas previas
        const prevRows = prev.slice();
        // encontrar indice de la fila a actualizar
        prevRows[index] = { ...prevRows[index], ...updated };
        return prevRows;
      });
      setUpdates(initEditables(null));
      setEdit(false);
    }

    for (let key of keys) {
      if (updates[key]) updated[key] = updates[key];
    }

    if (request) {

      //Recuperar solamente los campos que cambiaron su valor
      const payload = Object.create({})
      for (let key of keys) {
        let editable = editables.find(e=>e.label===key)
        let field = rows[index][key]
        
        if(editable.type === 'select') {
          field = editable.validation().find(item=> item.label === field).value
        }

        if(field !== updated[key]) {
          payload[key] = updated[key]
        }
      }

      new Promise((resolve, reject) => {
        request(edit, payload)
        resolve()
      })
      .then(res=> {
        update()
      })
      .catch(err=> {
        console.log('Error al actualizar el producto: '+err)
      })
    } else {
      update()
    }


  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows]
  );

  React.useEffect(() => {
    setUpdates(initEditables(edit));
  }, [edit]);

  return (
    <Box sx={{ width: '99%' }}>
      <Paper elevation={0} square={false} sx={{ width: '99%', mb: 2, borderRadius: '13px' }}>
        
        <EnhancedTableToolbar setSearchText={setSearchText} generalActions={generalActions} setSelected={setSelected} selected={selected} numSelected={selected.length} />
        {rows.length === 0 ? empty :
        <TableContainer
          style={{
            height: '100vh',
            maxHeight: 'calc(100vh - 250px)',
            overflowY: 'auto',
            width: '99%',
            maxWidth: '100%',
            overflowX: 'auto'
          }}
          sx={{
            '&::-webkit-scrollbar': {
              width: '8px',
              backgroundColor: 'white',
              transition: 'opacity 0.3s',
            },
          }}>
          {
            (
              <Table
                stickyHeader
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
              >
                <EnhancedTableHead
                  actionsShow={actions.length > 0}
                  numSelected={selected.length}
                  columns={Object.keys(rows[0] || [])}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {rows
                    .filter(row => {
                      const keys = Object.keys(row);
                      for (let key of keys) {
                        if (!row[key] || key === 'img' || key === 'Imagen') continue;
                        if (row[key].toString().toLowerCase().includes(searchText.toLowerCase())) return true;
                      }
                      return false;
                    })
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row.id)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                'aria-labelledby': labelId,
                              }}
                            />
                          </TableCell>
                          {actions.length > 0 ?
                            (
                              <TableCell>
                                {edit !== row.id ? (
                                  <BasicMenu
                                    id={row.id}
                                    items={actions}
                                    label={actionsButton}
                                  />)
                                  :
                                  (
                                    <div className='btnsUpdate'>
                                      <button onClick={(e) => {
                                        e.stopPropagation();
                                        setEdit(false);
                                        setUpdates(initEditables(null));
                                      }}>
                                        Cancelar
                                      </button>
                                      <button onClick={(e) => handleUpdate(e, requestUpdate)}>Actualizar</button>
                                    </div>
                                  )
                                }
                              </TableCell>
                            ) :
                            ''
                          }
                          {Object.keys(row || []).map(key => {
                            return edit !== row.id ?
                              (<TableCell sx={{ whiteSpace: 'nowrap', maxWidth: '200px' }}>
                                <div className='textContainer'>
                                  <div className='scrollableText'>
                                    {key === 'id' ? '#fdnum-' + row[key] : row[key]}
                                  </div>
                                </div>
                              </TableCell>)
                              :
                              (
                                <TableCell>
                                  {editables.some(e => e.label == key) ? (
                                    <div class='editField'>
                                      <TextField
                                        autoComplete='off'
                                        onChange={(e) => handleEdit(e.target.value, row, editables.find(e => e.label == key))}
                                        onClick={(e) => e.stopPropagation()}
                                        value={updates[editables.find(e => e.label == key).label]}
                                        select={'select' == editables.find(e => e.label == key).type}
                                        type={editables.find(e => e.label == key).type}
                                      >
                                        {editables.find(e => e.label == key).type == 'select' ? (
                                          editables.find(e => e.label == key).validation().map((item, index) => (
                                            <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
                                          ))
                                        ) : null}
                                      </TextField>
                                      <Alert
                                        style={{
                                          display: errorInput[0] && (Number(errorInput[0]) === Number(row.id)) && errorInput[1] == editables.find(e => e.label == key).label ? '' : 'none',
                                          position: 'relative'
                                        }}
                                        severity="error"
                                      >{errorInput[2]}</Alert>
                                    </div>
                                  ) : (
                                    <div className='textContainer'>
                                      <div className='scrollableText'>
                                        {row[key]}
                                      </div>
                                    </div>
                                  )}
                                </TableCell>
                              );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>)
          }
        </TableContainer>
        }
        {pagination ? (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        ) :
          rows.length > 0 ? footer : ''
        }
      </Paper>
    </Box>
  );
}
