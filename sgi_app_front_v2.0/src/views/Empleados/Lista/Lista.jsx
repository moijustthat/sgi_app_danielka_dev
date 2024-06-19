import * as React from "react";
import Table from "@mui/joy/Table";
import { Avatar, Box, IconButton } from "@mui/joy";

export default function ListaEmpleados({
  onVerTodo=()=>{}
}) {
  return (
      <Table
        stickyHeader
        hoverRow
        aria-label="basic table"
        sx={{ textAlign: "left" }}
      >
        <caption>Lista de empleados activos </caption>
        <thead>
          <tr>
            <th><IconButton
              onClick={onVerTodo}
            >Ver todo <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg></IconButton></th>
            <th>Nombre</th>
            <th>Apellidos</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Box sx={{ alignItems: "center", alignSelf: "center", marginLeft: 5 }}>
                <Avatar  src="/static/images/avatar/1.jpg" />
              </Box>
            </td>
            <td>Empleado 1</td>
            <td>Apellidos Apellidos</td>
          </tr>
          <tr>
            <td>
              <Box sx={{ alignItems: "center", alignSelf: "center", marginLeft: 5 }}>
                <Avatar  src="/static/images/avatar/1.jpg" />
              </Box>
            </td>
            <td>Empleado 1</td>
            <td>Apellidos Apellidos</td>
          </tr>
          <tr>
            <td>
              <Box sx={{ alignItems: "center", alignSelf: "center", marginLeft: 5 }}>
                <Avatar  src="/static/images/avatar/1.jpg" />
              </Box>
            </td>
            <td>Empleado 1</td>
            <td>Apellidos Apellidos</td>
          </tr>
          <tr>
            <td>
              <Box sx={{ alignItems: "center", alignSelf: "center", marginLeft: 5 }}>
                <Avatar  src="/static/images/avatar/1.jpg" />
              </Box>
            </td>
            <td>Empleado 1</td>
            <td>Apellidos Apellidos</td>
          </tr>
          <tr>
            <td>
              <Box sx={{ alignItems: "center", alignSelf: "center", marginLeft: 5 }}>
                <Avatar  src="/static/images/avatar/1.jpg" />
              </Box>
            </td>
            <td>Empleado 1</td>
            <td>Apellidos Apellidos</td>
          </tr>
          <tr>
            <td>
              <Box sx={{ alignItems: "center", alignSelf: "center", marginLeft: 5 }}>
                <Avatar  src="/static/images/avatar/1.jpg" />
              </Box>
            </td>
            <td>Empleado 1</td>
            <td>Apellidos Apellidos</td>
          </tr>
          <tr>
            <td>
              <Box sx={{ alignItems: "center", alignSelf: "center", marginLeft: 5 }}>
                <Avatar  src="/static/images/avatar/1.jpg" />
              </Box>
            </td>
            <td>Empleado 1</td>
            <td>Apellidos Apellidos</td>
          </tr>
          <tr>
            <td>
              <Box sx={{ alignItems: "center", alignSelf: "center", marginLeft: 5 }}>
                <Avatar  src="/static/images/avatar/1.jpg" />
              </Box>
            </td>
            <td>Empleado 1</td>
            <td>Apellidos Apellidos</td>
          </tr>
          <tr>
            <td>
              <Box sx={{ alignItems: "center", alignSelf: "center", marginLeft: 5 }}>
                <Avatar  src="/static/images/avatar/1.jpg" />
              </Box>
            </td>
            <td>Empleado 1</td>
            <td>Apellidos Apellidos</td>
          </tr>
          <tr>
            <td>
              <Box sx={{ alignItems: "center", alignSelf: "center", marginLeft: 5 }}>
                <Avatar  src="/static/images/avatar/1.jpg" />
              </Box>
            </td>
            <td>Empleado 1</td>
            <td>Apellidos Apellidos</td>
          </tr>
          <tr>
            <td>
              <Box sx={{ alignItems: "center", alignSelf: "center", marginLeft: 5 }}>
                <Avatar  src="/static/images/avatar/1.jpg" />
              </Box>
            </td>
            <td>Empleado 1</td>
            <td>Apellidos Apellidos</td>
          </tr>

          <tr>
            <td>
              <Box sx={{ alignItems: "center", alignSelf: "center", marginLeft: 5 }}>
                <Avatar  src="/static/images/avatar/1.jpg" />
              </Box>
            </td>
            <td>Empleado 1</td>
            <td>Apellidos Apellidos</td>
          </tr>
          <tr>
            <td>
              <Box sx={{ alignItems: "center", alignSelf: "center", marginLeft: 5 }}>
                <Avatar  src="/static/images/avatar/1.jpg" />
              </Box>
            </td>
            <td>Empleado 1</td>
            <td>Apellidos Apellidos</td>
          </tr>
          <tr>
            <td>
              <Box sx={{ alignItems: "center", alignSelf: "center", marginLeft: 5 }}>
                <Avatar  src="/static/images/avatar/1.jpg" />
              </Box>
            </td>
            <td>Empleado 1</td>
            <td>Apellidos Apellidos</td>
          </tr>


          <tr>
            <td>
              <Box sx={{ alignItems: "center", alignSelf: "center", marginLeft: 5 }}>
                <Avatar  src="/static/images/avatar/1.jpg" />
              </Box>
            </td>
            <td>Empleado 1</td>
            <td>Apellidos Apellidos</td>
          </tr>
          <tr>
            <td>
              <Box sx={{ alignItems: "center", alignSelf: "center", marginLeft: 5 }}>
                <Avatar  src="/static/images/avatar/1.jpg" />
              </Box>
            </td>
            <td>Empleado 1</td>
            <td>Apellidos Apellidos</td>
          </tr>

          <tr>
            <td>
              <Box sx={{ alignItems: "center", alignSelf: "center", marginLeft: 5 }}>
                <Avatar  src="/static/images/avatar/1.jpg" />
              </Box>
            </td>
            <td>Empleado 1</td>
            <td>Apellidos Apellidos</td>
          </tr>
          <tr>
            <td>
              <Box sx={{ alignItems: "center", alignSelf: "center", marginLeft: 5 }}>
                <Avatar  src="/static/images/avatar/1.jpg" />
              </Box>
            </td>
            <td>Empleado 1</td>
            <td>Apellidos Apellidos</td>
          </tr>
          <tr>
            <td>
              <Box sx={{ alignItems: "center", alignSelf: "center", marginLeft: 5 }}>
                <Avatar  src="/static/images/avatar/1.jpg" />
              </Box>
            </td>
            <td>Empleado 1</td>
            <td>Apellidos Apellidos</td>
          </tr>


          
        </tbody>
      </Table>
  );
}
