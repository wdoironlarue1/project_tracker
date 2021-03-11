using Microsoft.EntityFrameworkCore.Migrations;

namespace ProjectTracker.Migrations
{
    public partial class IssuesToProject : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_User_Auth0Key",
                table: "User",
                column: "Auth0Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Issue_ProjectId",
                table: "Issue",
                column: "ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_Issue_Project_ProjectId",
                table: "Issue",
                column: "ProjectId",
                principalTable: "Project",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Issue_Project_ProjectId",
                table: "Issue");

            migrationBuilder.DropIndex(
                name: "IX_User_Auth0Key",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_Issue_ProjectId",
                table: "Issue");
        }
    }
}
