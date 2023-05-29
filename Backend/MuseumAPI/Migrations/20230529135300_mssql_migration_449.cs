using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MuseumAPI.Migrations
{
    /// <inheritdoc />
    public partial class mssql_migration_449 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Price",
                table: "Paintings",
                type: "float",
                nullable: false,
                defaultValue: 1000.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "Paintings");
        }
    }
}
