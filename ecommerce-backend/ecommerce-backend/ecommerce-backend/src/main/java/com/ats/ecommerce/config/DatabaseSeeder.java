package com.ats.ecommerce.config;

import com.ats.ecommerce.entity.*;
import com.ats.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (categoryRepository.count() > 0) {
            log.info("Database already seeded. Skipping seeding process.");
            return;
        }

        log.info("Starting database seeding...");

        // Seed roles
        seedRoles();

        // Seed users
        List<User> users = seedUsers();

        // Seed carts for users
        seedCarts(users);

        // Seed categories
        List<Category> categories = seedCategories();

        // Seed products
        seedProducts(categories);

        log.info("Database seeding completed successfully!");
    }

    private void seedRoles() {
        log.info("Seeding roles...");

        Role adminRole = new Role();
        adminRole.setName("ROLE_ADMIN");
        roleRepository.save(adminRole);

        Role userRole = new Role();
        userRole.setName("ROLE_USER");
        roleRepository.save(userRole);

        log.info("Roles seeded: ROLE_ADMIN, ROLE_USER");
    }

    private List<User> seedUsers() {
        log.info("Seeding users...");

        List<User> users = new ArrayList<>();

        // Admin user
        User admin = User.builder()
                .email("admin@ecommerce.com")
                .password(passwordEncoder.encode("admin123"))
                .firstName("Admin")
                .lastName("User")
                .enabled(true)
                .locked(false)
                .roles(new HashSet<>(Arrays.asList(
                    roleRepository.findByName("ROLE_ADMIN").orElseThrow(),
                    roleRepository.findByName("ROLE_USER").orElseThrow()
                )))
                .build();
        users.add(userRepository.save(admin));

        // Regular user 1
        User user1 = User.builder()
                .email("john.doe@example.com")
                .password(passwordEncoder.encode("user123"))
                .firstName("John")
                .lastName("Doe")
                .enabled(true)
                .locked(false)
                .roles(new HashSet<>(Arrays.asList(
                    roleRepository.findByName("ROLE_USER").orElseThrow()
                )))
                .build();
        users.add(userRepository.save(user1));

        // Regular user 2
        User user2 = User.builder()
                .email("jane.smith@example.com")
                .password(passwordEncoder.encode("user123"))
                .firstName("Jane")
                .lastName("Smith")
                .enabled(true)
                .locked(false)
                .roles(new HashSet<>(Arrays.asList(
                    roleRepository.findByName("ROLE_USER").orElseThrow()
                )))
                .build();
        users.add(userRepository.save(user2));

        log.info("Users seeded: admin@ecommerce.com, john.doe@example.com, jane.smith@example.com");
        return users;
    }

    private void seedCarts(List<User> users) {
        log.info("Seeding carts for users...");

        for (User user : users) {
            Cart cart = new Cart();
            cart.setUser(user);
            cart.setItems(new ArrayList<>());
            cart.setTotalAmount(BigDecimal.ZERO);
            cart.setCreatedAt(LocalDateTime.now());
            cartRepository.save(cart);
        }

        log.info("Carts created for " + users.size() + " users");
    }

    private List<Category> seedCategories() {
        log.info("Seeding categories...");

        List<Category> categories = new ArrayList<>();

        // Clothing category
        Category clothing = new Category();
        clothing.setName("Clothing");
        clothing.setDescription("Fashionable clothing items including t-shirts, hoodies, and caps");
        categories.add(clothing);

        // Drinkware category
        Category drinkware = new Category();
        drinkware.setName("Drinkware");
        drinkware.setDescription("Quality drinkware including bottles and mugs");
        categories.add(drinkware);

        // Accessories category
        Category accessories = new Category();
        accessories.setName("Accessories");
        accessories.setDescription("Everyday accessories including bags");
        categories.add(accessories);

        categoryRepository.saveAll(categories);
        log.info("Categories seeded: Clothing, Drinkware, Accessories");

        return categories;
    }

    private void seedProducts(List<Category> categories) {
        log.info("Seeding products...");

        List<Product> products = new ArrayList<>();

        // Get categories
        Category clothing = findCategoryByName(categories, "Clothing");
        Category drinkware = findCategoryByName(categories, "Drinkware");
        Category accessories = findCategoryByName(categories, "Accessories");

        // CLOTHING PRODUCTS

        // 1. T-Shirt
        products.add(createProduct(
            "TSHIRT-001",
            "Classic Cotton T-Shirt",
            "Premium 100% cotton t-shirt with comfortable fit. Perfect for everyday wear. Available in multiple colors.",
            new BigDecimal("24.99"),
            clothing,
            "/products/tshirt.png",
            150
        ));

        // 2. Hoodie
        products.add(createProduct(
            "HOODIE-001",
            "Comfortable Pullover Hoodie",
            "Cozy pullover hoodie with soft fleece interior and kangaroo pocket. Ideal for casual wear and layering.",
            new BigDecimal("49.99"),
            clothing,
            "/products/hoodie.png",
            100
        ));

        // 3. Cap
        products.add(createProduct(
            "CAP-001",
            "Classic Baseball Cap",
            "Adjustable cotton baseball cap with embroidered logo. One size fits most. Perfect for outdoor activities.",
            new BigDecimal("19.99"),
            clothing,
            "/products/cap.png",
            200
        ));

        // DRINKWARE PRODUCTS

        // 4. Bottle
        products.add(createProduct(
            "BOTTLE-001",
            "Stainless Steel Water Bottle",
            "Double-walled insulated bottle keeps drinks cold for 24 hours. BPA-free with leak-proof lid. 32oz capacity.",
            new BigDecimal("29.99"),
            drinkware,
            "/products/bottle.jpeg",
            180
        ));

        // 5. Mug
        products.add(createProduct(
            "MUG-001",
            "Ceramic Coffee Mug",
            "Classic 12oz ceramic mug with comfortable handle. Microwave and dishwasher safe. Perfect for coffee or tea.",
            new BigDecimal("14.99"),
            drinkware,
            "/products/mug.png",
            250
        ));

        // ACCESSORIES PRODUCTS

        // 6. Bag
        products.add(createProduct(
            "BAG-001",
            "Canvas Tote Bag",
            "Durable canvas tote bag with reinforced handles. Eco-friendly and spacious. Perfect for shopping or daily use.",
            new BigDecimal("34.99"),
            accessories,
            "/products/bag.png",
            120
        ));

        // 7. Notebook
        products.add(createProduct(
            "NOTEBOOK-001",
            "Premium Notebook",
            "Hardcover notebook with 192 lined pages. Elastic closure and ribbon bookmark. Ideal for journaling or note-taking.",
            new BigDecimal("16.99"),
            accessories,
            "/products/notebook.jpeg",
            150
        ));

        // 8. Pen
        products.add(createProduct(
            "PEN-001",
            "Professional Pen Set",
            "Premium ballpoint pen set with smooth ink flow. Pack of 5 pens. Perfect for writing and professional use.",
            new BigDecimal("12.99"),
            accessories,
            "/products/pen.jpeg",
            300
        ));

        // Save all products
        productRepository.saveAll(products);
        log.info("Products seeded: " + products.size() + " items");
        
        // Log product summary
        log.info("Product Summary:");
        log.info("  Clothing: T-Shirt ($24.99), Hoodie ($49.99), Cap ($19.99)");
        log.info("  Drinkware: Bottle ($29.99), Mug ($14.99)");
        log.info("  Accessories: Bag ($34.99), Notebook ($16.99), Pen ($12.99)");
    }

    private Product createProduct(String sku, String name, String description, 
                                   BigDecimal price, Category category, 
                                   String imageUrl, int stockQuantity) {
        Product product = new Product();
        product.setSku(sku);
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setCategory(category);
        product.setImageUrl(imageUrl);
        product.setActive(true);

        // Create and associate inventory
        Inventory inventory = new Inventory();
        inventory.setProduct(product);
        inventory.setQuantity(stockQuantity);
        
        product.setInventory(inventory);

        return product;
    }

    private Category findCategoryByName(List<Category> categories, String name) {
        return categories.stream()
                .filter(c -> c.getName().equals(name))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Category not found: " + name));
    }
}