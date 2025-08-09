using Microsoft.EntityFrameworkCore;
using RgarchitectsApp.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

if (!app.Environment.IsDevelopment()) { app.UseHsts(); }

using (var scope = app.Services.CreateScope()) { var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>(); db.Database.Migrate(); }

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(name: "default", pattern: "{controller}/{action=Index}/{id?}");
app.MapFallbackToFile("index.html");

app.Run();
