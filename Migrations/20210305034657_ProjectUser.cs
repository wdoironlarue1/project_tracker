using Microsoft.EntityFrameworkCore.Migrations;

namespace ProjectTracker.Migrations
{
    public partial class ProjectUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Project_User_CreatorId",
                table: "Project");

            migrationBuilder.DropIndex(
                name: "IX_Project_CreatorId",
                table: "Project");

            migrationBuilder.CreateTable(
                name: "ProjectUser",
                columns: table => new
                {
                    ProjectsId = table.Column<int>(type: "INTEGER", nullable: false),
                    UsersId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectUser", x => new { x.ProjectsId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_ProjectUser_Project_ProjectsId",
                        column: x => x.ProjectsId,
                        principalTable: "Project",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectUser_User_UsersId",
                        column: x => x.UsersId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectUser_UsersId",
                table: "ProjectUser",
                column: "UsersId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectUser");

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
    }
}
