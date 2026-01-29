Get-Content @( '.\prisma\schema.base.prisma'; Get-ChildItem .\prisma\models\*.prisma | Sort-Object Name | ForEach-Object { $_.FullName } ) | Set-Content .\prisma\schema.prisma

Then run Prisma as usual:

npx prisma generate
npx prisma migrate dev