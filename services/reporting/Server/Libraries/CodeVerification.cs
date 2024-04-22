namespace reporting.Libraries;

public class CodeVerification
{
    public static List<string> ValidCodes = new List<string>(){
        "incomes_1d",
        "incomes_1w",
        "incomes_1m",
        "incomes_1y",
        "outcomes_1d",
        "outcomes_1w",
        "outcomes_1m",
        "outcomes_1y",
        "top5_selling_1w",
        "top5_selling_1m",
        "affluence_1d",
        "delivery_types_1d",
        "rejection_rate_1d"
    };
    public static string ValidCodesString = string.Join(", ", ValidCodes);

    // Map of codes to their respective value types
    public static Dictionary<string, Type> CodeTypes = new Dictionary<string, Type>()
    {
        { "incomes_1d", typeof(decimal) },
        { "incomes_1w", typeof(decimal) },
        { "incomes_1m", typeof(decimal) },
        { "incomes_1y", typeof(decimal) },
        { "outcomes_1d", typeof(decimal) },
        { "outcomes_1w", typeof(decimal) },
        { "outcomes_1m", typeof(decimal) },
        { "outcomes_1y", typeof(decimal) },
        { "top5_selling_1w", typeof(string) },
        { "top5_selling_1m", typeof(string) },
        { "affluence_1d", typeof(string) },
        { "delivery_types_1d", typeof(string) },
        { "rejection_rate_1d", typeof(string) }
    };

    public static bool IsValid(string code)
    {
        return ValidCodes.Contains(code);
    }

    public static bool IsValid(string code, Type type)
    {
        return IsValid(code) && CodeTypes[code] == type;
    }
}