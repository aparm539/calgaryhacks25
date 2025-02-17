import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, CellEditingStartedEvent, CellKeyDownEvent, GetRowIdParams, ModuleRegistry } from 'ag-grid-community'; 
import { useCallback, useState } from "react";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);


 
function Sheet() {

        // Row Data: The data to be displayed.
        const [rowData, setRowData] = useState([
            { make: "Tesla", model: "Model Y", price: 64950, electric: true },
            { make: "Ford", model: "F-Series", price: 33850, electric: false },
            { make: "Toyota", model: "Corolla", price: 29600, electric: false },
        ]);
    
        // Column Definitions: Defines the columns to be displayed.
        const [colDefs, setColDefs] = useState([
            { field: "make", editable: true },
            { field: "model", editable: true },
            { field: "price", editable: true },

        ]);
        function onCellValueChanged(event: CellKeyDownEvent){
             console.log(event)

        }

    
    return (
        // Data Grid will fill the size of the parent container
        <div style={{ height: 500}}>
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                onCellKeyDown ={onCellValueChanged}
            />
        </div>
    )
}; 

export default Sheet
