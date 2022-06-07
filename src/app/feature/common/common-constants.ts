export class CommonConstants {
    public static readonly Status = {
        Active: 'Y',
        Inactive: 'N',
        All: '%'
    };

    public static readonly StatusNumber = {
        Active: 1,
        Inactive: 2
    };

    public static readonly AdjustType = {
        AddDebpt: 'DN',
        ReduceDebt: 'CN',
        All: '%'
    };

    public static readonly Nature = {
        Debit: 'DR',
        Credit: 'CR',
        All: '%'
    };

    public static readonly GroupType = {
        Local: 'L',
        Global: 'O',
        All: '%'
    };

    public static readonly AgingMethod = {
        InvoiceDate: 'I',
        DueDate: 'D'
    };

    public static readonly TypeFlag = {
        Category: '1',
        Debt: '2',
        Capital: '3',
        Income: '4',
        Cost: '5',
        All: '%'
    };
    public static readonly Keyword = {
        All: '%'
    };

    public static readonly AccType = {
        WhT: 'W',
        InputTax: 'P'
    };

    public static readonly HeadOffice = {
        All: '%',
        Yes: 'Y',
        No: 'N'
    };

    public static readonly EntryType = {
        Add: 'N',
        Deduct: 'Y'
    };

    public static readonly CountryFlag = {
        All: '0',
        Domestic: '1',
        Abroad: '2'
    };

    public static readonly BranchFlag = {
        All: '0',
        Headquarter: '1',
        Branch: '2'
    };

    public static readonly WorkPlace = {
        Headquarter: 'N',
        Branch: 'Y'
    };

    public static readonly PersonType = {
        All: '0',
        Juristic: '1',
        Natural: '2'
    };

    public static readonly Auto = {
        Yes: 'Y',
        No: 'N',
        Text: 'AUTO'
    };

    public static readonly RevExpType = {
        Revenue: '1',
        Expense: '2',
        All: '%'
    };

    public static readonly DocumentType = {
        Process: 'P',
        Receive: 'R',
        Success: 'S',
        CloseDaily: 'C',
        Amortization: 'N'
    };

    public static readonly TypeOfReceive = {
        Revenue: 'R',
        Cheque: 'Q',
        Bank: 'T',
        Cash: 'C',
        Deduct: 'D',
        Withholding: 'W',
        Income: 'I',
        Additional: 'E'
    };

    public static readonly Language = {
        Thai: 'TH',
        Eng: 'EN'
    };

    public static readonly BooleanFlag = {
        True: 'Y',
        False: 'N'
    };

    public static readonly StatusDoc = {
        Cancel: 'C',
        Submit: 'S',
        Approve: 'A',
        InProcess: 'P',
        Wait: 'W',
        Normal: 'N',
        New: 'NEW'
    };
}
