import { randomBytes } from "node:crypto";
import { PrismaClient, CategoryGroup } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/lib/password";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const CATEGORIES: { group: CategoryGroup; name: string; slug: string; sortOrder: number }[] = [
  { group: "LIFTING", name: "Автокран 25 т", slug: "avtokran-25t", sortOrder: 1 },
  { group: "LIFTING", name: "Автокран 50 т", slug: "avtokran-50t", sortOrder: 2 },
  { group: "LIFTING", name: "Автовышка (АГП)", slug: "avtovyshka-agp", sortOrder: 3 },
  { group: "EARTHMOVING", name: "Гусеничный экскаватор", slug: "gusenichnyy-ekskavator", sortOrder: 1 },
  { group: "EARTHMOVING", name: "Бульдозер", slug: "buldozer", sortOrder: 2 },
  { group: "PASSENGER", name: "Вахтовый автобус", slug: "vahtovyy-avtobus", sortOrder: 1 },
  { group: "PASSENGER", name: "Легковые ТС", slug: "legkovye-ts", sortOrder: 2 },
];

const OWNERS = [
  {
    name: "Арендатра",
    description: "Собственный парк грузоподъёмной, землеройной техники и пассажирского транспорта.",
    phone: "+74951234567",
    email: "info@arendatra.ru",
    city: "Москва",
  },
];

async function main() {
  await prisma.booking.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.category.deleteMany();
  await prisma.owner.deleteMany();
  await prisma.buyer.deleteMany();

  const categories: Record<string, string> = {};
  for (const c of CATEGORIES) {
    const created = await prisma.category.create({ data: c });
    categories[c.slug] = created.id;
  }

  const owners = [];
  for (const o of OWNERS) {
    owners.push(await prisma.owner.create({ data: o }));
  }
  const [fleet] = owners;

  await prisma.vehicle.createMany({
    data: [
      {
        title: "Автокран 25 т, стрела 22–33 м",
        slug: "avtokran-25t-strela-22-33m",
        description:
          "Автокран грузоподъёмностью 25 тонн для монтажных и погрузочных работ. Полноприводное шасси 6х6 — работает вне асфальтированных дорог.",
        pricePerHour: 2700,
        minHours: 8,
        city: "Москва",
        categoryId: categories["avtokran-25t"],
        ownerId: fleet.id,
        attributes: {
          "Грузоподъёмность": "25 т",
          "Длина стрелы": "22–33 м",
          "Шасси": "вездеход (6х6)",
        },
      },
      {
        title: "Автокран 50 т, стрела до 34 м",
        slug: "avtokran-50t-strela-do-34m",
        description:
          "Автокран грузоподъёмностью 50 тонн для тяжёлых монтажных работ. Полноприводное шасси 6х6.",
        pricePerHour: 8000,
        minHours: 8,
        city: "Москва",
        categoryId: categories["avtokran-50t"],
        ownerId: fleet.id,
        attributes: {
          "Грузоподъёмность": "50 т",
          "Длина стрелы": "до 34 м",
          "Шасси": "вездеход (6х6)",
        },
      },
      {
        title: "Автовышка (АГП), стрела до 33 м",
        slug: "avtovyshka-agp-strela-do-33m",
        description:
          "Автогидроподъёмник для высотных работ. Комбинированное шасси, люлька грузоподъёмностью до 300 кг.",
        pricePerHour: 2700,
        minHours: 8,
        city: "Москва",
        categoryId: categories["avtovyshka-agp"],
        ownerId: fleet.id,
        attributes: {
          "Грузоподъёмность люльки": "до 300 кг",
          "Длина стрелы": "до 33 м",
          "Шасси": "комбинированное",
        },
      },
      {
        title: "Гусеничный экскаватор, ковш до 1.2 м³",
        slug: "gusenichnyy-ekskavator-kovsh-1-2m3",
        description:
          "Гусеничный экскаватор для земляных работ. В наличии узкопленочные и болотные гусеницы, слани для работы на болотистой местности.",
        pricePerHour: 2800,
        minHours: 8,
        city: "Москва",
        categoryId: categories["gusenichnyy-ekskavator"],
        ownerId: fleet.id,
        attributes: {
          "Объём ковша": "до 1.2 м³",
          "Масса": "до 22 т",
          "Гусеницы": "узкопленочные и болотные (слани в наличии)",
        },
      },
      {
        title: "Бульдозер, отвал до 5 м³",
        slug: "buldozer-otval-do-5m3",
        description: "Бульдозер для планировки и перемещения грунта.",
        pricePerHour: 2800,
        minHours: 8,
        city: "Москва",
        categoryId: categories["buldozer"],
        ownerId: fleet.id,
        attributes: {
          "Объём отвала": "до 5 м³",
          "Масса": "17 т",
          "Ширина гусениц": "110 см",
        },
      },
      {
        title: "Вахтовый автобус, 22–28 мест",
        slug: "vahtovyy-avtobus-22-28-mest",
        description: "Вахтовый автобус повышенной проходимости для перевозки бригад на объекты.",
        pricePerHour: 2550,
        minHours: 4,
        city: "Москва",
        categoryId: categories["vahtovyy-avtobus"],
        ownerId: fleet.id,
        attributes: {
          "Вместимость": "22–28 мест",
          "Шасси": "вездеход (6х6)",
        },
      },
      {
        title: "Легковые ТС до 8 мест",
        slug: "legkovye-ts-do-8-mest",
        description: "Легковой транспорт для перевозки сотрудников и гостей объекта.",
        pricePerHour: 1200,
        minHours: 4,
        city: "Москва",
        categoryId: categories["legkovye-ts"],
        ownerId: fleet.id,
        attributes: {
          "Вместимость": "до 8 мест",
        },
      },
    ],
  });

  // Пароль администратора не трогаем при повторном запуске сида —
  // создаём только если аккаунта ещё нет, со случайным паролем.
  const existingAdmin = await prisma.admin.findUnique({ where: { login: "admin" } });
  if (!existingAdmin) {
    const tempPassword = randomBytes(9).toString("base64url");
    await prisma.admin.create({
      data: {
        login: "admin",
        passwordHash: await hashPassword(tempPassword),
        name: "Администратор",
      },
    });
    console.log(`Создан админ: login=admin, пароль=${tempPassword} (смените после входа)`);
  } else {
    console.log("Админ уже существует — пароль не менялся.");
  }

  console.log("Сид базы данных завершён.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
