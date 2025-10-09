import React, {
    useEffect,
    useState,
    useCallback,
    useMemo,
    useRef,
} from "react";
import { IoReload } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { FaFileCsv, FaFilePdf } from "react-icons/fa6";
import { MdOutlineCheckBox } from "react-icons/md";
import { TbSettingsExclamation } from "react-icons/tb";
import { AgGridReact } from "ag-grid-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logotoPrint from "../assets/images/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { camelCaseToTitleCase } from "../utils/camelCaseToTitleCase";
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { HiSearch } from "react-icons/hi";

const AgGridTable = ({
    className,
    children,
    importedData,
    tableName,
    colsManage,
    handleContextMenu,
    selectedRows,
    setSelectedRows,
    onRowClicked,
    selectible,
    colDefs,
    searchFromUrl = true,
    progress,
    listMouses = null,
    pageSize = 25,
}) => {
    const gridRef = useRef();
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const [gridApi, setGridApi] = useState(null);
    const searchValue = searchParams.get("search") || "";
    const [searchText, setSearchText] = useState(
        searchFromUrl ? searchValue : ""
    );
    const [isLoading, setIsLoading] = useState(true);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [filters, setFilters] = useState({});
    const navigate = useNavigate();
    const [progressPercentage, setProgressPercentage] = useState(0);

    useEffect(() => {
        setProgressPercentage(Math.min(Math.max(Math.round(progress), 0), 100));
    }, [progress]);

    const CustomHeaderComp = (props) => {
        const api = props.api;
        const checkboxRef = useRef(null);

        useEffect(() => {
            const updateCheckboxState = () => {
                if (!checkboxRef.current || !api) return;

                const nodes = [];
                api.forEachNode((node) => nodes.push(node));
                const displayedNodes = nodes.filter((node) => node.displayed);

                if (!displayedNodes.length) {
                    checkboxRef.current.checked = false;
                    checkboxRef.current.indeterminate = false;
                    return;
                }

                const currentPage = api.paginationGetCurrentPage();
                const pageSize = api.paginationGetPageSize();
                const startRow = currentPage * pageSize;
                const endRow = Math.min(startRow + pageSize, displayedNodes.length);
                const allOnPage = displayedNodes.slice(startRow, endRow);

                const numOnPage = allOnPage.length;
                const numSelected = allOnPage.filter((node) => node.isSelected()).length;

                if (numSelected === 0) {
                    checkboxRef.current.checked = false;
                    checkboxRef.current.indeterminate = false;
                } else if (numSelected === numOnPage) {
                    checkboxRef.current.checked = true;
                    checkboxRef.current.indeterminate = false;
                } else {
                    checkboxRef.current.checked = false;
                    checkboxRef.current.indeterminate = true;
                }
            };

            if (api) {
                api.addEventListener("selectionChanged", updateCheckboxState);
                api.addEventListener("paginationChanged", updateCheckboxState);
                api.addEventListener("filterChanged", updateCheckboxState);
                api.addEventListener("modelUpdated", updateCheckboxState);

                updateCheckboxState(); // Initial update

                return () => {
                    api.removeEventListener("selectionChanged", updateCheckboxState);
                    api.removeEventListener("paginationChanged", updateCheckboxState);
                    api.removeEventListener("filterChanged", updateCheckboxState);
                    api.removeEventListener("modelUpdated", updateCheckboxState);
                };
            }
        }, [api]);

        const onCheckboxChange = (e) => {
            if (!api) return;
            const checked = e.target.checked;
            const currentPage = api.paginationGetCurrentPage();
            const pageSize = api.paginationGetPageSize();
            const nodes = [];
            api.forEachNode((node) => nodes.push(node));
            const displayedNodes = nodes.filter((node) => node.displayed);
            const startRow = currentPage * pageSize;
            const endRow = Math.min(startRow + pageSize, displayedNodes.length);
            const allOnPage = displayedNodes.slice(startRow, endRow);

            allOnPage.forEach((node) => {
                node.setSelected(checked);
            });
        };

        return (
            <input type="checkbox" ref={checkboxRef} onChange={onCheckboxChange} />
        );
    };

    const checksCol = () => {
        if (selectible) {
            return {
                colId: "checkbox",
                headerComponent: CustomHeaderComp,
                checkboxSelection: true,
                maxWidth: 50,
                lockPosition: true,
                pinned: "left",
                sortable: false,
                filter: false,
                resizable: false,
            };
        }
        return null;
    };

    const [myColsDef] = useState([
        ...colDefs,
        ...(selectible ? [checksCol()] : []),
    ]);

    const noResultState = `<span class='noResult text-[#111] dark:text-[#eee]'>No ${camelCaseToTitleCase(
        tableName
    )} Found</span>`;
    const loadingState =
        '<span class="absolute top-[70px] left-[0] w-full flex h-full "><span class="absolute top-0 left-[0] border w-full h-[30px] skeletons bg-[#c9c9c93d]"></span><span class="absolute border top-[35px] left-[0] w-full h-[30px] skeletons bg-[#c9c9c91c]"></span><span class="absolute border top-[70px] left-[0] w-full h-[30px] skeletons"></span></span>';

    const [rowData, setRowData] = useState([]);
    const defaultColDef = useMemo(
        () => ({
            filter: true,
            floatingFilter: false,
            minWidth: 100,
            flex: 1,
            sortable: true,
        }),
        []
    );

    const handleSearchTable = (event) => {
        setSearchText(event.target.value);
        if (searchFromUrl) {
            navigate({ search: `?search=${encodeURIComponent(event.target.value)}` });
        }
    };

    useEffect(() => {
        if (gridApi) {
            gridApi.setGridOption("quickFilterText", searchText);
        }
    }, [gridApi, searchText]);

    const onBtnExport = useCallback(() => {
        gridRef.current.api.exportDataAsCsv({
            fileName: `${tableName}.csv`,
        });
    }, [tableName]);

    const exportToPdf = () => {
        const gridApi = gridRef.current.api;

        const columns = gridApi.getColumnDefs();
        const rows = [];
        gridApi.forEachNodeAfterFilterAndSort((node) => rows.push(node.data));

        const currentTime = new Date().toLocaleString();

        const doc = new jsPDF({
            orientation: "landscape",
        });
        doc.setFontSize(24);
        doc.text(`${tableName}`, 15, 13);

        doc.setFontSize(10);

        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        doc.addImage(logotoPrint, "PNG", pageWidth - 32, 3, 20, 14);

        const endText = currentTime;
        const endTextWidth = doc.getTextDimensions(endText).w;
        const endTextX = pageWidth - endTextWidth - 10;
        const endTextY = pageHeight - 5;
        doc.text(endText, endTextX, endTextY);

        const headerBackgroundColor = "#03843d";
        const headStyles = {
            fillColor: headerBackgroundColor,
            textColor: "#ffffff",
        };

        const autoTableParams = {
            margin: { top: 19, bottom: 8 },
            headStyles,
        };

        const filteredColumns = columns.filter((col) => col.headerName && col.headerName !== "id");

        doc.autoTable({
            columns: filteredColumns.map((col) => ({ title: col.headerName })),
            body: rows.map((row) => filteredColumns.map((col) => row[col.field])),
            ...autoTableParams,
        });

        doc.save(`${tableName}.pdf`);
    };

    useEffect(() => {
        if (gridApi) {
            const storedFilters = localStorage.getItem(`${tableName}filters`);
            if (storedFilters) {
                const filterModel = JSON.parse(storedFilters);
                gridApi.setFilterModel(filterModel);
                setFilters(JSON.parse(storedFilters));
            }
        }
    }, [gridApi, tableName]);

    const onGridReady = (params) => {
        const initialColumnState = params.api.getColumnState();
        const savedColumnState = localStorage.getItem(tableName);
        let visibility = {};

        if (savedColumnState) {
            params.api.applyColumnState({
                state: JSON.parse(savedColumnState),
                applyOrder: true,
            });
            JSON.parse(savedColumnState).forEach((col) => {
                visibility[col.colId] = !col.hide;
            });
        } else {
            initialColumnState.forEach((col) => {
                visibility[col.colId] = !col.hide;
            });
        }

        setColumnVisibility(visibility);
        setGridApi(params.api);
    };

    const onColumnStateChanged = (params) => {
        const columnState = params.api.getColumnState();
        localStorage.setItem(tableName, JSON.stringify(columnState));
    };

    const onFilterChanged = () => {
        if (gridRef.current && gridRef.current.api) {
            const filterModel = gridRef.current.api.getFilterModel();
            localStorage.setItem(
                `${tableName}filters`,
                JSON.stringify(filterModel)
            );
            setFilters(filterModel);
        }
    };

    const onCellDoubleClicked = (params) => {
        if (params.value != null) {
            navigator.clipboard.writeText(params.value.toString());
            toast.success("Cell copied successfully");
        }
    };

    const toggleColumnVisibility = (columnId) => {
        if (!gridRef.current || !gridRef.current.api) return;

        const columnState = gridRef.current.api.getColumnState();
        const updatedState = columnState.map((col) => {
            if (col.colId === columnId) {
                return { ...col, hide: !col.hide };
            }
            return col;
        });

        gridRef.current.api.applyColumnState({
            state: updatedState,
            applyOrder: true,
        });

        setColumnVisibility((prev) => ({
            ...prev,
            [columnId]: !prev[columnId],
        }));

        localStorage.setItem(tableName, JSON.stringify(updatedState));
    };

    useEffect(() => {
        const savedColumnState = localStorage.getItem(tableName);
        if (savedColumnState && gridApi) {
            const parsedData = JSON.parse(savedColumnState);
            gridApi.applyColumnState({
                state: parsedData,
                applyOrder: true,
            });
        }
    }, [gridApi, tableName]);

    useEffect(() => {
        if (importedData) {
            setIsLoading(false);
        }
        setRowData(importedData || []);
    }, [importedData]);

    useEffect(() => {
        if (!gridRef.current || !listMouses?.length || listMouses == null) return;

        const updatedRows = rowData.map((user) => {
            const matchingMouse = listMouses.find((mouse) => {
                return mouse.userId == user.id;
            });
            return matchingMouse ? { ...user, pos: matchingMouse.path } : user;
        });
        if (gridRef.current.api) {
            gridRef.current.api.applyTransaction({ update: updatedRows });
        }
    }, [listMouses, rowData]);

    return (
        <div
            className={`overflow-y-visible slideup-in h-full xs:h-[calc(100vh-280px)] w-full delay-[0.15s] rounded-md ${className}`}
            onContextMenu={handleContextMenu}
            onDoubleClick={(e) => {
                if (window.innerWidth < 500) {
                    handleContextMenu(e);
                }
            }}
        >
            <div className="flex items-center justify-between w-full mb-3 flex-wrap gap-2">
                <div className="relative flex-1 block min-w-full xs:min-w-[350px]">
                    <div className="relative flex-1 mb-3 max-w-md">
                        <input
                            onChange={handleSearchTable}
                            value={searchText}
                            type="text"
                            className="w-full max-w-[500px] bg-white dark:bg-[#323232] text-black dark:text-white border-[2px] border-gray-300 dark:border-gray-600 rounded-full py-2 px-4 focus:outline-none focus:!border-[var(--main-color)] transition-colors"
                            placeholder="Search..."
                        />
                        <span className={`absolute top-1/2 transform -translate-y-1/2 text-[#ccc] dark:text-[#666] bg-[#eee] dark:bg-[#282828] rounded-full size-[30px] flex justify-center items-center right-2`}>
                            <HiSearch />
                        </span>
                    </div>
                    <div
                        style={{
                            width: `${progressPercentage}%`,
                            transition: "width 1s ease-in-out",
                        }}
                        className="h-1 absolute left-0 bg-green-500 bottom-0"
                    ></div>
                </div>
                {Object.entries(filters).length > 0 && (
                    <div>Filters Applied (Placeholder)</div>
                )}
                <div className="flex items-center justify-between text-2xl btns max-w-full flex-1">
                    <div
                        className={`text-sm mr-5 text-gray-700 dark:text-[#eee] trans-3 ${selectedRows?.length > 0 ? "" : "opacity-0 translate-x-[-50px]"
                            }`}
                    >
                        {selectedRows?.length} Selected Rows
                    </div>
                    <div className="flex">
                        {colsManage ? (
                            <div className="relative group">
                                <button
                                    className={`mr-5 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[var(--main-color)] text-[#111] hover:text-[#eee] dark:text-[#eee] trans-3 ${Object.entries(columnVisibility)
                                        .filter(([key]) => key !== "no")
                                        .some(([, value]) => value === false)
                                        ? "bg-[var(--main-color)] text-white"
                                        : ""
                                        }`}
                                >
                                    {Object.entries(columnVisibility)
                                        .filter(([key]) => key !== "no")
                                        .some(([, value]) => value === false) ? (
                                        <TbSettingsExclamation />
                                    ) : (
                                        <IoMdSettings />
                                    )}
                                </button>
                                <div className="group-hover:flex max-h-[600px] overflow-auto flex-col z-[9] min-w-[300px] dark:text-[#eee] trans-3 absolute top-[0] pb-8 right-[50px] bg-white dark:bg-[#323232] px-4 shadow-lg border rounded-md py-2 hidden">
                                    {gridApi?.getColumnState()?.map((column, index) => {
                                        return index > 1 && column.colId ? (
                                            <div
                                                key={index}
                                                className={`text-sm trans-3 hover:text-[var(--main-color)] py-2 border-b w-full text-start flex justify-start gap-2 ${columnVisibility[column.colId]
                                                    ? "text-green-600 dark:text-green-300"
                                                    : ""
                                                    }`}
                                                onClick={() => toggleColumnVisibility(column.colId)}
                                            >
                                                {columnVisibility[column.colId] ? (
                                                    <MdOutlineCheckBox className="text-xl" />
                                                ) : (
                                                    <MdCheckBoxOutlineBlank className="text-xl" />
                                                )}
                                                {myColsDef.find((col) => col.field === column.colId)
                                                    ?.headerName || column.colId}
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        ) : null}
                        <button
                            style={{
                                borderRadius: "5px 0px 0px 5px",
                                borderRightWidth: "1px",
                            }}
                            className="dark:border-[#424242] border-2 p-2 rounded-md text-[var(--main-color)] trans-3 hover:!border-[var(--main-color)] hover:text-white hover:bg-[var(--main-color)]"
                            onClick={onBtnExport}
                        >
                            <FaFileCsv />
                        </button>
                        <button
                            style={{
                                borderRadius: "0px 5px 5px 0px",
                                borderLeftWidth: "1px",
                            }}
                            className="p-2 text-red-700 dark:border-[#424242] border-2 rounded-md trans-3 hover:!border-red-700 hover:text-white hover:bg-red-700"
                            onClick={exportToPdf}
                        >
                            <FaFilePdf />
                        </button>
                    </div>
                </div>
            </div>
            {children}
            <AgGridReact
                onGridReady={onGridReady}
                overlayNoRowsTemplate={isLoading ? loadingState : noResultState}
                className="ag-theme-quartz custom-table !h-[90%]"
                rowData={rowData}
                columnDefs={myColsDef}
                defaultColDef={defaultColDef}
                pagination={true}
                rowModelType="clientSide"
                ref={gridRef}
                suppressExcelExport={true}
                suppressPdfExport={true}
                enableCellTextSelection={true}
                suppressMovableColumns={false}
                onRowClicked={onRowClicked}
                rowDragManaged={false}
                rowDragEntireRow={false}
                onColumnMoved={onColumnStateChanged}
                rowSelection={selectible ? "multiple" : null}
                paginationPageSize={pageSize}
                onFilterChanged={onFilterChanged}
                onCellDoubleClicked={onCellDoubleClicked}
                paginationPageSizeSelector={[25, 50, 100, 200]}
                getRowId={(params) => params.data.id}
                onRowSelected={
                    selectible
                        ? () => {
                            const gridApi = gridRef.current.api;
                            const selectedNodes = new Set(
                                gridApi.getSelectedNodes().map((node) => node.data.id)
                            );
                            const selectedFilteredRows = [];
                            gridApi.forEachNodeAfterFilter((node) => {
                                if (selectedNodes.has(node.data.id)) {
                                    selectedFilteredRows.push(node.data.id);
                                }
                            });
                            setSelectedRows(selectedFilteredRows);
                        }
                        : null
                }
            />
        </div>
    );
};

export default AgGridTable;