FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["Backend.Api.csproj", "./"]
RUN dotnet restore "Backend.Api.csproj"
COPY . .
WORKDIR "/src/"
RUN dotnet build "Backend.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Backend.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

#ENTRYPOINT ["dotnet", "Backend.Api.dll"]
CMD ASPNETCORE_URLS=http://*:$PORT dotnet Backend.Api.dll
