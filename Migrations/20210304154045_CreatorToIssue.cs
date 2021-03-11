using Microsoft.EntityFrameworkCore.Migrations;

namespace ProjectTracker.Migrations
{
    public partial class CreatorToIssue : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Issue");

            migrationBuilder.AddColumn<int>(
                name: "CreatorId",
                table: "Issue",
                type: "INTEGER",
                nullable: false,
                defaultValue: 4);

            migrationBuilder.CreateIndex(
                name: "IX_Issue_CreatorId",
                table: "Issue",
                column: "CreatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Issue_User_CreatorId",
                table: "Issue",
                column: "CreatorId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Issue_User_CreatorId",
                table: "Issue");

            migrationBuilder.DropIndex(
                name: "IX_Issue_CreatorId",
                table: "Issue");

            migrationBuilder.DropColumn(
                name: "CreatorId",
                table: "Issue");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Issue",
                type: "TEXT",
                nullable: true);
        }
    }
}
