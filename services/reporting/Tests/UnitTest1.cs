namespace Tests;

public class UnitTest1
{
    [Fact]
    public void Test1()
    {
        bool result = 1 + 1 == 2;

        Assert.True(result, "1 + 1 should be 2");
    }
}