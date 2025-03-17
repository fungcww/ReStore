using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class OrderEntityAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BuyerEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    shippingAddress_Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    shippingAddress_Line1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    shippingAddress_Line2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    shippingAddress_City = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    shippingAddress_State = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    shippingAddress_Postalcode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    shippingAddress_Country = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OrderDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Subtotal = table.Column<long>(type: "bigint", nullable: false),
                    DeliveryFee = table.Column<long>(type: "bigint", nullable: false),
                    Discount = table.Column<long>(type: "bigint", nullable: false),
                    PaymentIntentId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OrderStatus = table.Column<int>(type: "int", nullable: false),
                    PaymentSummary_Last4 = table.Column<int>(type: "int", nullable: true),
                    PaymentSummary_Brand = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PaymentSummary_ExpMonth = table.Column<int>(type: "int", nullable: true),
                    PaymentSummary_ExpYear = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OrderItem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    itemOrdered_ProductId = table.Column<int>(type: "int", nullable: true),
                    itemOrdered_Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    itemOrdered_PictureUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Price = table.Column<long>(type: "bigint", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    OrderId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItem_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_OrderId",
                table: "OrderItem",
                column: "OrderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderItem");

            migrationBuilder.DropTable(
                name: "Orders");
        }
    }
}
