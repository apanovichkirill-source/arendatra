import { PrismaClient, CategoryGroup } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/lib/password";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const CATEGORIES: { group: CategoryGroup; name: string; slug: string; sortOrder: number }[] = [
  { group: "CAR", name: "Седаны", slug: "sedany", sortOrder: 1 },
  { group: "CAR", name: "Кроссоверы и внедорожники", slug: "krossovery", sortOrder: 2 },
  { group: "CAR", name: "Минивэны", slug: "minivehny", sortOrder: 3 },
  { group: "SPECIAL", name: "Экскаваторы", slug: "ekskavatory", sortOrder: 1 },
  { group: "SPECIAL", name: "Самосвалы", slug: "samosvaly", sortOrder: 2 },
  { group: "SPECIAL", name: "Автокраны", slug: "avtokrany", sortOrder: 3 },
  { group: "SPECIAL", name: "Грузовики и фургоны", slug: "gruzoviki", sortOrder: 4 },
];

const OWNERS = [
  {
    name: "Иван Петров",
    description: "Сдаю личный автомобиль в аренду. На связи с 9 до 21.",
    phone: "+79161234567",
    email: "ivan.petrov@example.com",
    city: "Москва",
  },
  {
    name: "АвтоПрокат Москва",
    description: "Парк легковых авто для аренды. Работаем с 2015 года, полное КАСКО.",
    phone: "+74951234567",
    email: "info@avtoprokat-msk.ru",
    city: "Москва",
  },
  {
    name: "СпецТехАренда",
    description: "Аренда спецтехники и грузовиков с оператором и без.",
    phone: "+74957654321",
    email: "sales@spectehsrenda.ru",
    city: "Москва",
  },
];

async function main() {
  await prisma.booking.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.category.deleteMany();
  await prisma.owner.deleteMany();
  await prisma.admin.deleteMany();
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
  const [ivan, avtoprokat, specteh] = owners;

  await prisma.vehicle.createMany({
    data: [
      {
        title: "Hyundai Solaris 2022",
        slug: "hyundai-solaris-2022",
        description: "Экономичный седан для города. Механика, кондиционер.",
        pricePerHour: 350,
        minHours: 4,
        city: "Москва",
        categoryId: categories["sedany"],
        ownerId: ivan.id,
        attributes: { год: "2022", коробка: "механика", топливо: "бензин", мест: "5" },
      },
      {
        title: "Toyota Camry 2023",
        slug: "toyota-camry-2023",
        description: "Комфортный бизнес-седан, автомат, кожаный салон.",
        pricePerHour: 700,
        minHours: 4,
        city: "Москва",
        categoryId: categories["sedany"],
        ownerId: avtoprokat.id,
        attributes: { год: "2023", коробка: "автомат", топливо: "бензин", мест: "5" },
      },
      {
        title: "Kia Rio 2021",
        slug: "kia-rio-2021",
        description: "Компактный и манёвренный седан для поездок по городу.",
        pricePerHour: 300,
        minHours: 4,
        city: "Москва",
        categoryId: categories["sedany"],
        ownerId: ivan.id,
        attributes: { год: "2021", коробка: "автомат", топливо: "бензин", мест: "5" },
      },
      {
        title: "Toyota RAV4 2022",
        slug: "toyota-rav4-2022",
        description: "Полноприводный кроссовер, подходит для дальних поездок.",
        pricePerHour: 600,
        minHours: 4,
        city: "Москва",
        categoryId: categories["krossovery"],
        ownerId: avtoprokat.id,
        attributes: { год: "2022", коробка: "автомат", привод: "полный", мест: "5" },
      },
      {
        title: "Toyota Hiace 2020",
        slug: "toyota-hiace-2020",
        description: "Пассажирский минивэн на 8 мест для групповых поездок.",
        pricePerHour: 800,
        minHours: 4,
        city: "Москва",
        categoryId: categories["minivehny"],
        ownerId: avtoprokat.id,
        attributes: { год: "2020", коробка: "автомат", мест: "8" },
      },
      {
        title: "Экскаватор гусеничный CAT 320, 20 т",
        slug: "ekskavator-cat-320",
        description: "Аренда гусеничного экскаватора с оператором и без.",
        pricePerHour: 3500,
        minHours: 8,
        city: "Москва",
        categoryId: categories["ekskavatory"],
        ownerId: specteh.id,
        attributes: { мощность: "150 л.с.", масса: "20 т", ковш: "1.2 м3" },
      },
      {
        title: "Самосвал КАМАЗ 6520, 20 т",
        slug: "samosval-kamaz-6520",
        description: "Перевозка сыпучих материалов и грунта.",
        pricePerHour: 2500,
        minHours: 8,
        city: "Москва",
        categoryId: categories["samosvaly"],
        ownerId: specteh.id,
        attributes: { грузоподъёмность: "20 т", кузов: "самосвальный" },
      },
      {
        title: "Автокран Ивановец 25 т",
        slug: "avtokran-ivanovec-25t",
        description: "Аренда автокрана для монтажных работ.",
        pricePerHour: 4200,
        minHours: 8,
        city: "Москва",
        categoryId: categories["avtokrany"],
        ownerId: specteh.id,
        attributes: { грузоподъёмность: "25 т", вылет: "21 м" },
      },
      {
        title: "Газель NEXT, фургон 16 м3",
        slug: "gazel-next-furgon",
        description: "Грузоперевозки и переезды по городу и области.",
        pricePerHour: 900,
        minHours: 4,
        city: "Москва",
        categoryId: categories["gruzoviki"],
        ownerId: specteh.id,
        attributes: { грузоподъёмность: "1.5 т", объём: "16 м3" },
      },
    ],
  });

  await prisma.admin.create({
    data: {
      login: "admin",
      passwordHash: await hashPassword("admin12345"),
      name: "Администратор",
    },
  });

  console.log("Сид базы данных завершён.");
  console.log("Админ: login=admin, пароль=admin12345 (смените после первого входа)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
