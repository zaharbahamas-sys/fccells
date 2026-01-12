import { db } from "./server/db";
import { sql } from "drizzle-orm";

async function reset() {
  console.log("🗑️  جاري تنظيف قاعدة البيانات...");
  try {
    // هذا الأمر يحذف كل شيء ويعيد بناء المخطط من الصفر
    await db.execute(sql`DROP SCHEMA public CASCADE;`);
    await db.execute(sql`CREATE SCHEMA public;`);
    await db.execute(sql`GRANT ALL ON SCHEMA public TO postgres;`);
    await db.execute(sql`GRANT ALL ON SCHEMA public TO public;`);
    console.log("✅ تم تنظيف القاعدة بنجاح! الآن جاهزة للبناء الجديد.");
  } catch (error) {
    console.error("❌ حدث خطأ:", error);
  }
  process.exit(0);
}

reset();
