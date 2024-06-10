using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class OptimalControlController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { Message = "Hello Julia!" });
    }

    [HttpPost]
    [HttpPost]
    public IActionResult Post([FromBody] ProblemData data)
    {
        // Log pour vérifier les données reçues
        Console.WriteLine("Data received from frontend: " + data.ProblemDescription);

        //  résoudre le problème de contrôle optimal avec Julia
        string solution = "test_back"; 
        Console.WriteLine("Solution computed: " + solution);

        return Ok(new { Result = solution });
    }

}

public class ProblemData
{
    public string ProblemDescription { get; set; }
}
