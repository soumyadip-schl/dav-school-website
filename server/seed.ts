import { db } from "./db";
import { users, siteSettings } from "@shared/schema";
import { hashPassword } from "./auth";

async function seedDatabase() {
  console.log("Seeding database...");

  try {
    // Create default admin user
    const hashedPassword = await hashPassword("admin123");
    
    await db.insert(users).values({
      username: "admin",
      password: hashedPassword,
      role: "admin"
    }).onConflictDoNothing();

    // Create default site settings
    const defaultSettings = [
      // Theme settings
      { key: 'theme.primary_color', value: '#FF9933', category: 'theme' },
      { key: 'theme.secondary_color', value: '#8B1538', category: 'theme' },
      { key: 'theme.accent_color', value: '#FF6B35', category: 'theme' },
      { key: 'theme.font_family', value: 'Inter', category: 'theme' },
      
      // Contact settings
      { key: 'contact.school_name', value: 'DAV Public School, Asansol', category: 'contact' },
      { key: 'contact.address', value: 'Sector 12, Asansol - 713301, West Bengal', category: 'contact' },
      { key: 'contact.phone', value: '+91 341 234 5678', category: 'contact' },
      { key: 'contact.email', value: 'info@davpublicschoolasansol.edu.in', category: 'contact' },
      
      // Content settings
      { key: 'content.hero_title', value: 'Excellence in Education', category: 'content' },
      { key: 'content.hero_subtitle', value: 'Nurturing young minds for a brighter tomorrow', category: 'content' },
      { key: 'content.principal_name', value: 'Dr. Priya Sharma', category: 'content' },
      { key: 'content.principal_message', value: 'Welcome to DAV Public School, Asansol! We are committed to providing quality education that nurtures both academic excellence and character development. Our dedicated faculty and modern facilities ensure that every student receives the best possible learning experience.', category: 'content' },
      
      // Social media
      { key: 'social.facebook', value: 'https://facebook.com/davpublicschoolasansol', category: 'social' },
      { key: 'social.twitter', value: 'https://twitter.com/davschoolasansol', category: 'social' },
      { key: 'social.instagram', value: 'https://instagram.com/davschoolasansol', category: 'social' },
      { key: 'social.youtube', value: 'https://youtube.com/davschoolasansol', category: 'social' },
    ];

    for (const setting of defaultSettings) {
      await db.insert(siteSettings).values(setting).onConflictDoNothing();
    }

    console.log("Database seeded successfully!");
    console.log("Default admin user created:");
    console.log("Username: admin");
    console.log("Password: admin123");
    console.log("Please change this password after first login!");

  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();