import { AppDataSource } from "./src/config/data-source";
import { User } from "./src/entities/User.entity";
import bcrypt from 'bcrypt';

AppDataSource.initialize().then(async () => {
  const userRepo = AppDataSource.getRepository(User);

  const passwordHash = await bcrypt.hash("123456", 10);

  const newUser = userRepo.create({
    name: "Linh",
    email: "linh@example.com",
    password: passwordHash,
  });

  await userRepo.save(newUser);
  console.log("✅ Tạo user thành công:", newUser);
  process.exit(0);
}).catch((err) => {
  console.error("❌ Lỗi:", err);
  process.exit(1);
});
