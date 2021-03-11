using Microsoft.EntityFrameworkCore.Migrations;

namespace ProjectTracker.Migrations
{
    public partial class CreatorToProject : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Project");

            migrationBuilder.AddColumn<int>(
                name: "CreatorId",
                table: "Project",
                type: "INTEGER",
                nullable: false,
                defaultValue: 4);

            migrationBuilder.CreateIndex(
                name: "IX_Project_CreatorId",
                table: "Project",
                column: "CreatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Project_User_CreatorId",
                table: "Project",
                column: "CreatorId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Project_User_CreatorId",
                table: "Project");

            migrationBuilder.DropIndex(
                name: "IX_Project_CreatorId",
                table: "Project");

            migrationBuilder.DropColumn(
                name: "CreatorId",
                table: "Project");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Project",
                type: "TEXT",
                nullable: true);
        }
    }
}
