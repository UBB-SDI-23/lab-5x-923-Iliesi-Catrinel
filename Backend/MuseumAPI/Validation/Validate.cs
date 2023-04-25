using MuseumAPI.Models;

namespace MuseumAPI.Validation
{
    public class Validate
    {
        public Validate() {}
        private static bool IsDateValid(DateTime? date)
        {
            if (date == null)
            {
                return false;
            }

            return date.Value.Year >= 1000 && date.Value.Year <= 3000;
        }

        private static bool IsStringNonEmpty(string? value)
        {
            if (value == null)
            {
                return false;
            }

            return value.Length != 0;
        }

        private static bool IsNumberPositive(double? height)
        {
            if (height == null)
            {
                return false;
            }

            return height >= 0;
        }

        private static bool IsYearValid(int? year)
        {
            if (year == null)
            {
                return false;
            }

            return year >= 1000 && year <= 3000;
        }

        private static bool IsStartDateBeforeEndDate(DateTime startDate, DateTime endDate) 
        {
            return startDate < endDate;
        }

        public String ValidatePainting(PaintingDTO paintingDTO)
        {
            String errors = "";

            if (!IsStringNonEmpty(paintingDTO.Title))
            {
                errors += "Title of Painting must be non-empty.\n";
            }

            if (!IsYearValid(paintingDTO.CreationYear))
            {
                errors += "Creation year of Painting must be between 1000 and 3000.\n";
            }

            if (!IsNumberPositive(paintingDTO.Height))
            {
                errors += "Height of Painting must be positive.\n";
            }

            if (!IsStringNonEmpty(paintingDTO.Subject))
            {
                errors += "Subject of Painting must be non-empty.\n";
            }

            if (!IsStringNonEmpty(paintingDTO.Medium))
            {
                errors += "Medium of Painting must be non-empty.\n";
            }

            return errors;
        }

        public String ValidateArtist(ArtistDTO artistDTO)
        {
            String errors = "";

            if (!IsStringNonEmpty(artistDTO.FirstName))
            {
                errors += "First name of Artist must be non-empty.\n";
            }

            if (!IsStringNonEmpty(artistDTO.LastName))
            {
                errors += "Last name of Artist must be non-empty.\n";
            }

            if (!IsDateValid(artistDTO.BirthDate))
            {
                errors += "Birth date of Artist must be between 1000 and 3000.\n";
            }

            if (!IsStringNonEmpty(artistDTO.BirthPlace))
            {
                errors += "Birth place of Artist must be non-empty.\n";
            }

            if (!IsStringNonEmpty(artistDTO.Education))
            {
                errors += "Education of Artist must be non-empty.\n";
            }

            if (!IsStringNonEmpty(artistDTO.Movement))
            {
                errors += "Movement of Artist must be non-empty.\n";
            }

            return errors;
        }

        public String ValidateMuseum(MuseumDTO museumDTO)
        {
            String errors = "";

            if (!IsStringNonEmpty(museumDTO.Name))
            {
                errors += "Title of Museum must be non-empty.\n";
            }

            if (!IsStringNonEmpty(museumDTO.Address))
            {
                errors += "Address of Museum must be non-empty.\n";
            }

            if (!IsDateValid(museumDTO.FoundationDate))
            {
                errors += "Foundation Date of Museum must be between 1000 and 3000.\n";
            }

            if (!IsStringNonEmpty(museumDTO.Architect))
            {
                errors += "Architect of Museum must be non-empty.\n";
            }

            if (!IsStringNonEmpty(museumDTO.Website))
            {
                errors += "Website of Museum must be non-empty.\n";
            }

            return errors;
        }

        public String ValidateExhibition(ExhibitionDTO exhibitionDTO)
        {
            String errors = "";

            if (!IsDateValid(exhibitionDTO.StartDate))
            {
                errors += "Start date of Exhibition must be between 1000 and 3000.\n";
            }

            if (!IsDateValid(exhibitionDTO.EndDate))
            {
                errors += "End date of Exhibition must be between 1000 and 3000.\n";
            }

            if (!IsStartDateBeforeEndDate(exhibitionDTO.StartDate, exhibitionDTO.EndDate))
            {
                errors += "Start date of Exhibition must be before end date.\n";
            }

            return errors;
        }
    }
}
