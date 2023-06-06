using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MuseumAPI.Controllers
{
    [Route("api/MachineLearningModel")]
    [ApiController]
    public class PricePredictionController : ControllerBase
    {
        [HttpGet("{creationYear}/{height}")]
        [AllowAnonymous]
        public IActionResult GetPricePrediction(int creationYear, float height)
        {
            // Load sample data
            var sampleData = new PaintingMLModel.ModelInput()
            {
                Creation_year = creationYear,
                Height = height
            };

            double predictedPrice = (int)PaintingMLModel.Predict(sampleData).Score;

            return Ok(predictedPrice);
        }
    }
}