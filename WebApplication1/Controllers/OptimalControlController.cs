using Microsoft.AspNetCore.Mvc;
using System;

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
    public IActionResult Post([FromBody] ProblemData data)
    {
        // Log pour vérifier les données reçues
        Console.WriteLine("Data received from frontend: " + data.ProblemDescription);
        Console.WriteLine("Option received from frontend: " + data.Option);
        Console.WriteLine("Parametres received from frontend: " + data.Parametres);

        // Simuler la résolution du problème de contrôle optimal avec Julia
        string solution = "Solution generated based on: " +  data.Parametres + data.ProblemDescription;
        string selectedOption = data.Option;

        // Log de la solution et des autres informations
        Console.WriteLine("Solution computed: " + solution);
        Console.WriteLine("Selected Option: " + selectedOption);

        return Ok(new { Result = solution, Option = selectedOption });
    }
}

public class ProblemData
{
    public string Parametres { get; set; }
    public string ProblemDescription { get; set; }
    public string Option { get; set; }
}