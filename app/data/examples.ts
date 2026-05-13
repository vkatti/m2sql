export interface MCodeExample {
    id: string;
    title: string;
    description: string;
    mCode: string;
    category: "basic" | "intermediate" | "advanced";
}

export const examples: MCodeExample[] = [
    {
        id: "basic-rename-filter",
        title: "Basic Column Rename and Filter",
        description: "Simple transformation: rename columns and filter rows",
        category: "basic",
        mCode: `let
    Source = Sql.Database("localhost", "SalesDB"),
    dbo_Orders = Source{[Schema="dbo",Item="Orders"]}[Data],
    #"Renamed Columns" = Table.RenameColumns(dbo_Orders,{{"OrderID", "Order_ID"}, {"CustomerID", "Customer_ID"}}),
    #"Changed Type" = Table.TransformColumnTypes(#"Renamed Columns",{{"Order_ID", Int64.Type}, {"OrderDate", type date}}),
    #"Filtered Rows" = Table.SelectRows(#"Changed Type", each [OrderDate] >= #date(2023, 1, 1))
in
    #"Filtered Rows"`,
    },
    {
        id: "intermediate-group-by",
        title: "Group By with Aggregation",
        description: "Group sales by customer with total calculations",
        category: "intermediate",
        mCode: `let
    Source = Sql.Database("localhost", "SalesDB"),
    dbo_Sales = Source{[Schema="dbo",Item="Sales"]}[Data],
    #"Changed Type" = Table.TransformColumnTypes(dbo_Sales,{{"SaleAmount", type number}, {"CustomerID", Int64.Type}}),
    #"Grouped Rows" = Table.Group(#"Changed Type", {"CustomerID"}, {
        {"TotalSales", each List.Sum([SaleAmount]), type number},
        {"OrderCount", each Table.RowCount(_), Int64.Type},
        {"AvgSale", each List.Average([SaleAmount]), type number}
    })
in
    #"Grouped Rows"`,
    },
    {
        id: "intermediate-merge-tables",
        title: "Merge Two Tables",
        description: "Left join customers with orders",
        category: "intermediate",
        mCode: `let
    Source_Customers = Sql.Database("localhost", "SalesDB"),
    Customers = Source_Customers{[Schema="dbo",Item="Customers"]}[Data],
    Source_Orders = Sql.Database("localhost", "SalesDB"),
    Orders = Source_Orders{[Schema="dbo",Item="Orders"]}[Data],
    #"Merged Queries" = Table.NestedJoin(Customers, {"CustomerID"}, Orders, {"CustomerID"}, "Orders", JoinKind.LeftOuter),
    #"Expanded Orders" = Table.ExpandTableColumn(#"Merged Queries", "Orders", {"OrderID", "OrderDate", "TotalAmount"}, {"OrderID", "OrderDate", "TotalAmount"})
in
    #"Expanded Orders"`,
    },
    {
        id: "advanced-window-function",
        title: "Add Row Numbers and Rankings",
        description: "Partition by category, order by sales with row numbers",
        category: "advanced",
        mCode: `let
    Source = Sql.Database("localhost", "SalesDB"),
    dbo_Products = Source{[Schema="dbo",Item="ProductSales"]}[Data],
    #"Changed Type" = Table.TransformColumnTypes(dbo_Products,{{"Category", type text}, {"Product", type text}, {"Sales", type number}}),
    #"Sorted Rows" = Table.Sort(#"Changed Type",{{"Category", Order.Ascending}, {"Sales", Order.Descending}}),
    #"Added Index" = Table.AddIndexColumn(#"Sorted Rows", "RowNumber", 1, 1),
    #"Grouped for Partition" = Table.Group(#"Added Index", {"Category"}, {
        {"AllData", each Table.AddIndexColumn(_, "Rank", 1, 1), type table}
    }),
    #"Expanded Data" = Table.ExpandTableColumn(#"Grouped for Partition", "AllData", {"Product", "Sales", "Rank"}, {"Product", "Sales", "Rank"})
in
    #"Expanded Data"`,
    },
    {
        id: "advanced-multiple-steps",
        title: "Complex Multi-Step Transformation",
        description: "Multiple joins, filters, calculations, and groupings",
        category: "advanced",
        mCode: `let
    Source = Sql.Database("localhost", "RetailDB"),
    Orders = Source{[Schema="dbo",Item="Orders"]}[Data],
    OrderDetails = Source{[Schema="dbo",Item="OrderDetails"]}[Data],
    Products = Source{[Schema="dbo",Item="Products"]}[Data],
    
    #"Merged Orders with Details" = Table.NestedJoin(Orders, {"OrderID"}, OrderDetails, {"OrderID"}, "Details", JoinKind.Inner),
    #"Expanded Details" = Table.ExpandTableColumn(#"Merged Orders with Details", "Details", {"ProductID", "Quantity", "UnitPrice"}),
    
    #"Merged with Products" = Table.NestedJoin(#"Expanded Details", {"ProductID"}, Products, {"ProductID"}, "Product", JoinKind.Inner),
    #"Expanded Products" = Table.ExpandTableColumn(#"Merged with Products", "Product", {"ProductName", "Category"}),
    
    #"Changed Types" = Table.TransformColumnTypes(#"Expanded Products",{{"Quantity", Int64.Type}, {"UnitPrice", type number}}),
    #"Added Line Total" = Table.AddColumn(#"Changed Types", "LineTotal", each [Quantity] * [UnitPrice], type number),
    #"Filtered Recent" = Table.SelectRows(#"Added Line Total", each [OrderDate] >= Date.AddDays(DateTime.LocalNow(), -90)),
    
    #"Grouped By Category" = Table.Group(#"Filtered Recent", {"Category"}, {
        {"TotalRevenue", each List.Sum([LineTotal]), type number},
        {"TotalQuantity", each List.Sum([Quantity]), Int64.Type},
        {"UniqueProducts", each List.Count(List.Distinct([ProductID])), Int64.Type}
    }),
    #"Sorted by Revenue" = Table.Sort(#"Grouped By Category",{{"TotalRevenue", Order.Descending}})
in
    #"Sorted by Revenue"`,
    },
    {
        id: "basic-calculated-column",
        title: "Add Calculated Columns",
        description: "Create new columns based on existing data",
        category: "basic",
        mCode: `let
    Source = Sql.Database("localhost", "EmployeeDB"),
    Employees = Source{[Schema="dbo",Item="Employees"]}[Data],
    #"Changed Type" = Table.TransformColumnTypes(Employees,{{"FirstName", type text}, {"LastName", type text}, {"Salary", type number}}),
    #"Added Full Name" = Table.AddColumn(#"Changed Type", "FullName", each [FirstName] & " " & [LastName], type text),
    #"Added Annual Bonus" = Table.AddColumn(#"Added Full Name", "AnnualBonus", each [Salary] * 0.10, type number),
    #"Added Total Compensation" = Table.AddColumn(#"Added Annual Bonus", "TotalComp", each [Salary] + [AnnualBonus], type number)
in
    #"Added Total Compensation"`,
    },
    {
        id: "intermediate-conditional-column",
        title: "Conditional Column Logic",
        description: "Add columns with if-then-else logic",
        category: "intermediate",
        mCode: `let
    Source = Sql.Database("localhost", "SalesDB"),
    Sales = Source{[Schema="dbo",Item="Sales"]}[Data],
    #"Changed Type" = Table.TransformColumnTypes(Sales,{{"Amount", type number}, {"Quantity", Int64.Type}}),
    #"Added Tier" = Table.AddColumn(#"Changed Type", "SalesTier", each 
        if [Amount] >= 10000 then "Premium"
        else if [Amount] >= 5000 then "Standard"
        else "Basic", type text),
    #"Added Discount" = Table.AddColumn(#"Added Tier", "DiscountPct", each 
        if [SalesTier] = "Premium" then 0.15
        else if [SalesTier] = "Standard" then 0.10
        else 0.05, type number),
    #"Added Net Amount" = Table.AddColumn(#"Added Discount", "NetAmount", each [Amount] * (1 - [DiscountPct]), type number)
in
    #"Added Net Amount"`,
    },
    {
        id: "advanced-running-total",
        title: "Running Total Calculation",
        description: "Calculate cumulative sum partitioned by category",
        category: "advanced",
        mCode: `let
    Source = Sql.Database("localhost", "FinanceDB"),
    Transactions = Source{[Schema="dbo",Item="Transactions"]}[Data],
    #"Changed Type" = Table.TransformColumnTypes(Transactions,{{"Date", type date}, {"Category", type text}, {"Amount", type number}}),
    #"Sorted Rows" = Table.Sort(#"Changed Type",{{"Category", Order.Ascending}, {"Date", Order.Ascending}}),
    #"Grouped for Running Total" = Table.Group(#"Sorted Rows", {"Category"}, {
        {"Data", each 
            let
                AddRunningTotal = List.Generate(
                    () => [Row = _{0}, RunningTotal = [Amount], Counter = 0],
                    each [Counter] < Table.RowCount(_),
                    each [Row = _{[Counter]+1}, RunningTotal = [RunningTotal] + [Amount], Counter = [Counter]+1],
                    each [Row & [RunningTotal = [RunningTotal]]]
                )
            in
                Table.FromRecords(AddRunningTotal)
        , type table}
    }),
    #"Expanded Data" = Table.ExpandTableColumn(#"Grouped for Running Total", "Data", {"Date", "Amount", "RunningTotal"})
in
    #"Expanded Data"`,
    },
];
