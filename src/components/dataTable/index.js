import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function CustomizedTables({ data, selectedRow }) {
  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: 700 }}
        style={{ backgroundColor: "rgb(37, 36, 36)",borderRadius:"10px" }}
        aria-label="customized table"
      >
        <TableHead>
          <TableRow>
            {/* <TableCell padding="checkbox"></TableCell> */}
            {/* <StyledTableCell>Dessert (100g serving)</StyledTableCell> */}
            <StyledTableCell align="center">Label</StyledTableCell>
            <StyledTableCell align="center">Start Angle</StyledTableCell>
            <StyledTableCell align="center">End Angle</StyledTableCell>
            <StyledTableCell align="center">Inner Radius</StyledTableCell>
            <StyledTableCell align="center">Outer Radius</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <StyledTableRow
              key={row.name}
              style={{
                backgroundColor:
                  selectedRow?.label === row.label ? "rgb(0, 189, 88)" : "rgb(82, 82, 82)",
              }}
            >
              {/* <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell> */}
              {/* <Checkbox
                color="primary"
                // indeterminate={numSelected > 0 && numSelected < rowCount}
                // checked={rowCount > 0 && numSelected === rowCount}
                onChange={() => onClick(row)}
                inputProps={{
                  "aria-label": "select all desserts",
                }}
              /> */}
              <StyledTableCell style={{ color: "white" }} align="center">
                {row.label}
              </StyledTableCell>
              <StyledTableCell style={{ color: "white" }} align="center">
                {row.startAngle}
              </StyledTableCell>
              <StyledTableCell style={{ color: "white" }} align="center">
                {row.endAngle}
              </StyledTableCell>
              <StyledTableCell style={{ color: "white" }} align="center">
                {Math.trunc(row.innerRadius * 100)}
              </StyledTableCell>
              <StyledTableCell align="center" style={{ color: "white" }}>
                {Math.trunc(row.outerRadius * 100)}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
