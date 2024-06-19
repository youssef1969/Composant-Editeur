using Microsoft.AspNetCore.Mvc;
using System;
using Newtonsoft.Json;
using System.Collections.Generic;

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
        // Désérialiser les paramètres s'ils sont envoyés comme une chaîne JSON
        List<string> parametresList = JsonConvert.DeserializeObject<List<string>>(data.Parametres);

        // Log pour vérifier les données reçues
        Console.WriteLine("Data received from frontend: " + data.ProblemDescription);
        Console.WriteLine("Option received from frontend: " + data.Option);
        Console.WriteLine("Parametres received from frontend: " + string.Join(", ", parametresList));

        // Simuler la résolution du problème de contrôle optimal avec Julia
        string solution = "Solution generated based on: " + string.Join(", ", parametresList) +" "+ data.ProblemDescription;
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
