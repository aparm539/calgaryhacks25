import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule,GridSizeChangedEvent, ModuleRegistry, themeQuartz } from 'ag-grid-community'; 
import { useCallback, useState } from "react";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

 
function Sheet({onCellValueChangedCallback, gridRef}) {
        const theme = themeQuartz.withParams({
            columnBorder:true
        });

        // Row Data: The data to be displayed.
        const [rowData, setRowData] = useState([
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''},
            {id: '', value: ''}
        ]);
    
        // Column Definitions: Defines the columns to be displayed.
        const [colDefs, setColDefs] = useState([
            { field: "A", editable: true,minWidth: 80 },
            { field: "B", editable: true,minWidth: 80 },
            { field: "C", editable: true,minWidth: 80 },
            { field: "D", editable: true,minWidth: 80 },
            { field: "E", editable: true,minWidth: 80 },
            { field: "F", editable: true,minWidth: 80 },
            { field: "G", editable: true,minWidth: 80 },
            { field: "H", editable: true,minWidth: 80 },
            { field: "I", editable: true,minWidth: 80 },
            { field: "J", editable: true,minWidth: 80 },
            { field: "K", editable: true,minWidth: 80 },
            { field: "L", editable: true,minWidth: 80 },
            { field: "M", editable: true,minWidth: 80 },
            { field: "N", editable: true,minWidth: 80 },
            { field: "O", editable: true,minWidth: 80 },
            { field: "P", editable: true,minWidth: 80 },
        ]);

        const onGridSizeChanged = useCallback(
            (params: GridSizeChangedEvent) => {
              // get the current grids width
              const gridWidth =
                document.querySelector(".ag-body-viewport")!.clientWidth;
              // keep track of which columns to hide/show
              const columnsToShow = [];
              const columnsToHide = [];
              // iterate over all columns (visible or not) and work out
              // now many columns can fit (based on their minWidth)
              let totalColsWidth = 0;
              const allColumns = params.api.getColumns();
              if (allColumns && allColumns.length > 0) {
                for (let i = 0; i < allColumns.length; i++) {
                  const column = allColumns[i];
                  totalColsWidth += column.getMinWidth();
                  if (totalColsWidth > gridWidth) {
                    columnsToHide.push(column.getColId());
                  } else {
                    columnsToShow.push(column.getColId());
                  }
                }
              }
              // show/hide columns based on current grid width
              params.api.setColumnsVisible(columnsToShow, true);
              params.api.setColumnsVisible(columnsToHide, false);
              // wait until columns stopped moving and fill out
              // any available space to ensure there are no gaps
              window.setTimeout(() => {
                params.api.sizeColumnsToFit();
              }, 10);
            },
            [window],
          );
        

    
    return (
        // Data Grid will fill the size of the parent container
        <div style={{ height:"100%" }}>
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                onCellKeyDown ={onCellValueChangedCallback}
                onGridSizeChanged={onGridSizeChanged}
                ref={gridRef}
                theme={theme}
            />
        </div>
    )
}; 

export default Sheet
