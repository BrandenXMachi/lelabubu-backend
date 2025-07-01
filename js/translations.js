// LeLabubu.ca - Translations

// Default language
let currentLanguage = 'en';

// Load saved language preference if available
document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('lelabubuLanguage');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
        applyTranslation(currentLanguage);
    }
    
    // Update language toggle button state
    updateLanguageToggle();
});

// Toggle between English and French
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'fr' : 'en';
    
    // Save language preference
    localStorage.setItem('lelabubuLanguage', currentLanguage);
    
    // Apply translation
    applyTranslation(currentLanguage);
    
    // Update language toggle button
    updateLanguageToggle();
    
    return false; // Prevent default link behavior
}

// Update language toggle button text
function updateLanguageToggle() {
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.textContent = currentLanguage === 'en' ? 'Français' : 'English';
    }
}

// Apply translation to the page
function applyTranslation(language) {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key] && translations[key][language]) {
            element.textContent = translations[key][language];
        }
    });
    
    // Handle placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[key] && translations[key][language]) {
            element.placeholder = translations[key][language];
        }
    });
    
    // Handle button values
    document.querySelectorAll('[data-translate-value]').forEach(element => {
        const key = element.getAttribute('data-translate-value');
        if (translations[key] && translations[key][language]) {
            element.value = translations[key][language];
        }
    });
    
    // Handle alt text
    document.querySelectorAll('[data-translate-alt]').forEach(element => {
        const key = element.getAttribute('data-translate-alt');
        if (translations[key] && translations[key][language]) {
            element.alt = translations[key][language];
        }
    });
    
    // Handle title attributes
    document.querySelectorAll('[data-translate-title]').forEach(element => {
        const key = element.getAttribute('data-translate-title');
        if (translations[key] && translations[key][language]) {
            element.title = translations[key][language];
        }
    });
    
    // Update page title
    if (document.title) {
        const titleKey = document.querySelector('meta[name="title-key"]')?.content;
        if (titleKey && translations[titleKey] && translations[titleKey][language]) {
            document.title = translations[titleKey][language];
        }
    }
}

// Translation dictionary
const translations = {
    // Navigation
    "nav_home": {
        "en": "Home",
        "fr": "Accueil"
    },
    "nav_shop": {
        "en": "Shop",
        "fr": "Boutique"
    },
    "nav_about": {
        "en": "About",
        "fr": "À propos"
    },
    "nav_contact": {
        "en": "Contact",
        "fr": "Contact"
    },
    
    // Search
    "search_placeholder": {
        "en": "Search products...",
        "fr": "Rechercher des produits..."
    },
    "search_button": {
        "en": "Search",
        "fr": "Rechercher"
    },
    
    // Home Page
    "hero_title": {
        "en": "Discover the World of Labubu",
        "fr": "Découvrez le Monde de Labubu"
    },
    "hero_subtitle": {
        "en": "Authentic collectible art toys from Kasing Lung",
        "fr": "Jouets d'art de collection authentiques de Kasing Lung"
    },
    "hero_button": {
        "en": "Shop Now",
        "fr": "Acheter Maintenant"
    },
    "featured_title": {
        "en": "Featured Products",
        "fr": "Produits en Vedette"
    },
    "new_arrivals_title": {
        "en": "New Arrivals",
        "fr": "Nouveautés"
    },
    "best_sellers_title": {
        "en": "Best Sellers",
        "fr": "Meilleures Ventes"
    },
    "about_section_title": {
        "en": "About Labubu",
        "fr": "À propos de Labubu"
    },
    "about_section_text": {
        "en": "Labubu is a beloved character created by Hong Kong artist Kasing Lung. These collectible art toys have gained worldwide popularity for their unique blend of cute and mysterious aesthetics.",
        "fr": "Labubu est un personnage bien-aimé créé par l'artiste hongkongais Kasing Lung. Ces jouets d'art de collection ont gagné en popularité mondiale pour leur mélange unique d'esthétiques mignonnes et mystérieuses."
    },
    "learn_more": {
        "en": "Learn More",
        "fr": "En Savoir Plus"
    },
    
    // Shop Page
    "all_products": {
        "en": "All Products",
        "fr": "Tous les Produits"
    },
    "authentic_products": {
        "en": "Authentic Products",
        "fr": "Produits Authentiques"
    },
    "replica_products": {
        "en": "LaFuFus",
        "fr": "LaFuFus"
    },
    "search_results": {
        "en": "Search Results for",
        "fr": "Résultats de Recherche pour"
    },
    "sort_by": {
        "en": "Sort by:",
        "fr": "Trier par:"
    },
    "featured": {
        "en": "Featured",
        "fr": "En Vedette"
    },
    "price_low_high": {
        "en": "Price: Low to High",
        "fr": "Prix: Croissant"
    },
    "price_high_low": {
        "en": "Price: High to Low",
        "fr": "Prix: Décroissant"
    },
    "name_a_z": {
        "en": "Name: A to Z",
        "fr": "Nom: A à Z"
    },
    "name_z_a": {
        "en": "Name: Z to A",
        "fr": "Nom: Z à A"
    },
    "rating": {
        "en": "Rating",
        "fr": "Évaluation"
    },
    "products_count": {
        "en": "products",
        "fr": "produits"
    },
    "no_products_found": {
        "en": "No products found",
        "fr": "Aucun produit trouvé"
    },
    "try_adjusting_search": {
        "en": "Try adjusting your search terms.",
        "fr": "Essayez d'ajuster vos termes de recherche."
    },
    "add_to_cart": {
        "en": "Add to Cart",
        "fr": "Ajouter au Panier"
    },
    
    // Product Page
    "product_details": {
        "en": "Product Details",
        "fr": "Détails du Produit"
    },
    "color": {
        "en": "Color:",
        "fr": "Couleur:"
    },
    "size": {
        "en": "Size:",
        "fr": "Taille:"
    },
    "quantity": {
        "en": "Quantity:",
        "fr": "Quantité:"
    },
    "in_stock": {
        "en": "In Stock",
        "fr": "En Stock"
    },
    "out_of_stock": {
        "en": "Out of Stock",
        "fr": "Rupture de Stock"
    },
    "sku": {
        "en": "SKU:",
        "fr": "Référence:"
    },
    "category": {
        "en": "Category:",
        "fr": "Catégorie:"
    },
    "tags": {
        "en": "Tags:",
        "fr": "Étiquettes:"
    },
    "free_delivery": {
        "en": "Free shipping across montreal",
        "fr": "Livraison gratuite à travers Montréal"
    },
    "return_policy": {
        "en": "30-day return policy",
        "fr": "Politique de retour de 30 jours"
    },
    "description": {
        "en": "Description",
        "fr": "Description"
    },
    "details": {
        "en": "Details",
        "fr": "Détails"
    },
    "reviews": {
        "en": "Reviews",
        "fr": "Avis"
    },
    "you_may_also_like": {
        "en": "You May Also Like",
        "fr": "Vous Aimerez Aussi"
    },
    
    // Cart Page
    "your_cart": {
        "en": "Your Shopping Cart",
        "fr": "Votre Panier d'Achat"
    },
    "cart_empty": {
        "en": "Your cart is empty",
        "fr": "Votre panier est vide"
    },
    "cart_empty_message": {
        "en": "Looks like you haven't added any products to your cart yet.",
        "fr": "Il semble que vous n'ayez pas encore ajouté de produits à votre panier."
    },
    "continue_shopping": {
        "en": "Continue Shopping",
        "fr": "Continuer vos Achats"
    },
    "order_summary": {
        "en": "Order Summary",
        "fr": "Résumé de la Commande"
    },
    "subtotal": {
        "en": "Subtotal:",
        "fr": "Sous-total:"
    },
    "shipping": {
        "en": "Shipping:",
        "fr": "Livraison:"
    },
    "total": {
        "en": "Total:",
        "fr": "Total:"
    },
    "promo_code": {
        "en": "Promo Code",
        "fr": "Code Promo"
    },
    "enter_code": {
        "en": "Enter code",
        "fr": "Entrez le code"
    },
    "apply": {
        "en": "Apply",
        "fr": "Appliquer"
    },
    "checkout": {
        "en": "Proceed to Checkout",
        "fr": "Procéder au Paiement"
    },
    "shipping_policy": {
        "en": "Shipping Policy",
        "fr": "Politique de Livraison"
    },
    "secure_packaging": {
        "en": "Secure packaging for safe delivery",
        "fr": "Emballage sécurisé pour une livraison en toute sécurité"
    },
    "authenticity_guaranteed": {
        "en": "Authenticity guaranteed",
        "fr": "Authenticité garantie"
    },
    "need_help": {
        "en": "Need Help?",
        "fr": "Besoin d'Aide?"
    },
    "customer_service": {
        "en": "Our customer service team is here to assist you with any questions about your order.",
        "fr": "Notre équipe de service client est là pour vous aider avec toutes vos questions concernant votre commande."
    },
    
    // About Page
    "about_us": {
        "en": "About Us",
        "fr": "À Propos de Nous"
    },
    "about_intro_1": {
        "en": "We are a growing company proudly based in Montreal, Canada, specializing in delivering quality products directly to our local community. Our dedicated in-house team of carriers ensures fast, reliable, and secure delivery across Montreal — with guaranteed free shipping on every order.",
        "fr": "Nous sommes une entreprise en pleine croissance fièrement basée à Montréal, Canada, spécialisée dans la livraison de produits de qualité directement à notre communauté locale. Notre équipe dédiée de livreurs internes assure une livraison rapide, fiable et sécurisée à travers Montréal — avec une livraison gratuite garantie sur chaque commande."
    },
    "about_intro_2": {
        "en": "At Lelabubu, we're committed to providing exceptional service while supporting our city. Shop with confidence knowing your order will be handled with care and delivered right to your doorstep, at no extra cost. We rely solely on the growing trend of Labubu products.",
        "fr": "Chez Lelabubu, nous nous engageons à fournir un service exceptionnel tout en soutenant notre ville. Achetez en toute confiance en sachant que votre commande sera traitée avec soin et livrée directement à votre porte, sans frais supplémentaires. Nous nous appuyons uniquement sur la tendance croissante des produits Labubu."
    },
    "about_intro_3": {
        "en": "Our hardworking carriers take pride in delivering your orders across Montreal with care and reliability. They deeply appreciate the kindness and support from our customers, which motivates them to go the extra mile every day. When you choose us, you're supporting a passionate local team committed to serving the community.",
        "fr": "Nos livreurs dévoués sont fiers de livrer vos commandes à travers Montréal avec soin et fiabilité. Ils apprécient profondément la gentillesse et le soutien de nos clients, ce qui les motive à faire un effort supplémentaire chaque jour. Lorsque vous nous choisissez, vous soutenez une équipe locale passionnée et engagée à servir la communauté."
    },
    "our_story": {
        "en": "Our Story",
        "fr": "Notre Histoire"
    },
    "story_para_1": {
        "en": "LeLabubu.ca was born out of a passion for art toys and collectibles. Our founder, a long-time collector of Labubu dolls, noticed a gap in the Montreal market for authentic, high-quality Labubu products. What started as a small local store has grown into a thriving business serving collectors throughout the city.",
        "fr": "LeLabubu.ca est né d'une passion pour les jouets d'art et les objets de collection. Notre fondateur, collectionneur de longue date de poupées Labubu, a remarqué un manque sur le marché montréalais pour des produits Labubu authentiques et de haute qualité. Ce qui a commencé comme une petite boutique locale s'est transformé en une entreprise florissante servant les collectionneurs dans toute la ville."
    },
    "story_para_2": {
        "en": "We work directly with authorized distributors to ensure that every Labubu doll we sell is authentic and meets the highest standards of quality. Our team is made up of fellow collectors and dedicated local carriers who understand the passion and care that goes into both building a collection and delivering products safely.",
        "fr": "Nous travaillons directement avec des distributeurs autorisés pour garantir que chaque poupée Labubu que nous vendons est authentique et répond aux normes de qualité les plus élevées. Notre équipe est composée de collectionneurs et de livreurs locaux dévoués qui comprennent la passion et le soin nécessaires à la constitution d'une collection et à la livraison sécurisée des produits."
    },
    "story_para_3": {
        "en": "At LeLabubu.ca, we're not just selling products – we're creating a Montreal-based community of collectors and enthusiasts while providing exceptional local delivery service.",
        "fr": "Chez LeLabubu.ca, nous ne vendons pas seulement des produits - nous créons une communauté montréalaise de collectionneurs et d'enthousiastes tout en fournissant un service de livraison local exceptionnel."
    },
    "about_section_title": {
        "en": "About Labubu Dolls",
        "fr": "À Propos des Poupées Labubu"
    },
    "about_labubu_1": {
        "en": "Labubu dolls are the creation of renowned artist Kasing Lung. These distinctive characters feature a mischievous expression and unique design that has captured the hearts of collectors worldwide.",
        "fr": "Les poupées Labubu sont la création du célèbre artiste Kasing Lung. Ces personnages distinctifs présentent une expression espiègle et un design unique qui a conquis le cœur des collectionneurs du monde entier."
    },
    "about_labubu_2": {
        "en": "Each Labubu doll is crafted with meticulous attention to detail, showcasing Kasing Lung's artistic vision and storytelling. The character's playful yet slightly mysterious appearance has made it an icon in the art toy community.",
        "fr": "Chaque poupée Labubu est fabriquée avec une attention méticuleuse aux détails, mettant en valeur la vision artistique et la narration de Kasing Lung. L'apparence ludique mais légèrement mystérieuse du personnage en a fait une icône dans la communauté des jouets d'art."
    },
    "about_labubu_3": {
        "en": "What began as a limited edition art piece has evolved into a global phenomenon, with collectors eagerly anticipating new releases and special editions. Labubu dolls are more than just toys – they're collectible art pieces that bring joy and whimsy to any space.",
        "fr": "Ce qui a commencé comme une pièce d'art en édition limitée s'est transformé en un phénomène mondial, avec des collectionneurs attendant avec impatience les nouvelles sorties et les éditions spéciales. Les poupées Labubu sont plus que de simples jouets - ce sont des pièces d'art de collection qui apportent joie et fantaisie à n'importe quel espace."
    },
    "our_values": {
        "en": "Our Values",
        "fr": "Nos Valeurs"
    },
    "value_authenticity": {
        "en": "Authenticity",
        "fr": "Authenticité"
    },
    "value_authenticity_desc": {
        "en": "We guarantee that every Labubu doll we sell is 100% authentic. We work only with authorized distributors to ensure the highest quality products for our customers.",
        "fr": "Nous garantissons que chaque poupée Labubu que nous vendons est 100% authentique. Nous travaillons uniquement avec des distributeurs autorisés pour assurer les produits de la plus haute qualité à nos clients."
    },
    "value_passion": {
        "en": "Passion",
        "fr": "Passion"
    },
    "value_passion_desc": {
        "en": "We're collectors ourselves, and we bring our passion for Labubu dolls to everything we do. We love sharing our knowledge and enthusiasm with fellow collectors.",
        "fr": "Nous sommes nous-mêmes des collectionneurs, et nous apportons notre passion pour les poupées Labubu à tout ce que nous faisons. Nous aimons partager nos connaissances et notre enthousiasme avec d'autres collectionneurs."
    },
    "value_community": {
        "en": "Community",
        "fr": "Communauté"
    },
    "value_community_desc": {
        "en": "We're building more than a business – we're creating a local Montreal community of collectors and enthusiasts who share our love for these unique art toys while supporting our city's economy.",
        "fr": "Nous construisons plus qu'une entreprise - nous créons une communauté locale montréalaise de collectionneurs et d'enthousiastes qui partagent notre amour pour ces jouets d'art uniques tout en soutenant l'économie de notre ville."
    },
    "meet_the_team": {
        "en": "Meet Our Team",
        "fr": "Rencontrez Notre Équipe"
    },
    "team_member_1": {
        "en": "Sarah Chen",
        "fr": "Sarah Chen"
    },
    "team_role_1": {
        "en": "Founder & CEO",
        "fr": "Fondatrice et PDG"
    },
    "team_desc_1": {
        "en": "A passionate collector with over 10 years of experience in the art toy community. Sarah founded LeLabubu.ca to share her love for Labubu dolls with fellow enthusiasts.",
        "fr": "Une collectionneuse passionnée avec plus de 10 ans d'expérience dans la communauté des jouets d'art. Sarah a fondé LeLabubu.ca pour partager son amour des poupées Labubu avec d'autres passionnés."
    },
    "team_member_2": {
        "en": "Michael Rodriguez",
        "fr": "Michael Rodriguez"
    },
    "team_role_2": {
        "en": "Operations Manager",
        "fr": "Responsable des Opérations"
    },
    "team_desc_2": {
        "en": "With a background in logistics and e-commerce, Michael ensures that every order is processed efficiently and arrives safely at its destination.",
        "fr": "Avec une formation en logistique et en commerce électronique, Michael s'assure que chaque commande est traitée efficacement et arrive en toute sécurité à destination."
    },
    "team_member_3": {
        "en": "Emily Patel",
        "fr": "Emily Patel"
    },
    "team_role_3": {
        "en": "Customer Experience",
        "fr": "Expérience Client"
    },
    "team_desc_3": {
        "en": "Emily is dedicated to providing exceptional customer service. As a collector herself, she understands the importance of a positive shopping experience.",
        "fr": "Emily se consacre à fournir un service client exceptionnel. En tant que collectionneuse elle-même, elle comprend l'importance d'une expérience d'achat positive."
    },
    "faq": {
        "en": "Frequently Asked Questions",
        "fr": "Questions Fréquemment Posées"
    },
    "faq_q1": {
        "en": "What are your business hours?",
        "fr": "Quelles sont vos heures d'ouverture?"
    },
    "faq_a1": {
        "en": "Our customer service team is available Monday through Friday from 9:00 AM to 5:00 PM Eastern Time. While our online store is open 24/7, customer service inquiries received outside of business hours will be addressed on the next business day.",
        "fr": "Notre équipe de service client est disponible du lundi au vendredi de 9h00 à 17h00, heure de l'Est. Bien que notre boutique en ligne soit ouverte 24h/24 et 7j/7, les demandes de service client reçues en dehors des heures d'ouverture seront traitées le jour ouvrable suivant."
    },
    "faq_q2": {
        "en": "How quickly will I receive a response to my inquiry?",
        "fr": "Dans quel délai recevrai-je une réponse à ma demande?"
    },
    "faq_a2": {
        "en": "We strive to respond to all inquiries within 24 business hours. During peak periods or for complex inquiries, it may take up to 48 business hours to receive a comprehensive response. Rest assured, we're working diligently to address your questions as quickly as possible.",
        "fr": "Nous nous efforçons de répondre à toutes les demandes dans un délai de 24 heures ouvrables. Pendant les périodes de pointe ou pour les demandes complexes, il peut falloir jusqu'à 48 heures ouvrables pour recevoir une réponse complète. Soyez assuré que nous travaillons avec diligence pour répondre à vos questions aussi rapidement que possible."
    },
    "faq_q3": {
        "en": "Do you have a physical store I can visit?",
        "fr": "Avez-vous un magasin physique que je peux visiter?"
    },
    "faq_a3": {
        "en": "Currently, LeLabubu.ca operates exclusively as an online retailer with free delivery across Montreal. While we don't have a physical storefront open to the public, we occasionally participate in pop-up events and collectible toy conventions in the Montreal area. Follow us on social media or subscribe to our newsletter to stay informed about upcoming local events where you can see our products in person.",
        "fr": "Actuellement, LeLabubu.ca opère exclusivement en tant que détaillant en ligne avec livraison gratuite à Montréal. Bien que nous n'ayons pas de vitrine physique ouverte au public, nous participons occasionnellement à des événements éphémères et à des conventions de jouets de collection dans la région de Montréal. Suivez-nous sur les réseaux sociaux ou abonnez-vous à notre newsletter pour rester informé des événements locaux à venir où vous pourrez voir nos produits en personne."
    },
    "faq_q4": {
        "en": "How can I track my order?",
        "fr": "Comment puis-je suivre ma commande?"
    },
    "faq_a4": {
        "en": "Once your order ships, you'll receive a confirmation email with tracking information. You can also log into your account on our website to view your order status and tracking details. If you have any issues tracking your order, please contact our customer service team at support@lelabubu.ca with your order number.",
        "fr": "Une fois votre commande expédiée, vous recevrez un e-mail de confirmation avec les informations de suivi. Vous pouvez également vous connecter à votre compte sur notre site Web pour consulter l'état de votre commande et les détails de suivi. Si vous rencontrez des problèmes pour suivre votre commande, veuillez contacter notre équipe de service client à support@lelabubu.ca avec votre numéro de commande."
    },
    "faq_q5": {
        "en": "Do you offer wholesale opportunities?",
        "fr": "Proposez-vous des opportunités de vente en gros?"
    },
    "faq_a5": {
        "en": "Yes, we do offer wholesale opportunities for qualified retailers. If you're interested in carrying Labubu dolls in your store, please contact us at wholesale@lelabubu.ca with information about your business. Our wholesale team will review your inquiry and provide you with our wholesale catalog and terms.",
        "fr": "Oui, nous offrons des opportunités de vente en gros aux détaillants qualifiés. Si vous souhaitez proposer des poupées Labubu dans votre magasin, veuillez nous contacter à wholesale@lelabubu.ca avec des informations sur votre entreprise. Notre équipe de vente en gros examinera votre demande et vous fournira notre catalogue et nos conditions de vente en gros."
    },
    "product_faq_q1": {
        "en": "Are your Labubu dolls authentic?",
        "fr": "Vos poupées Labubu sont-elles authentiques?"
    },
    "product_faq_a1": {
        "en": "Yes, all of our Labubu dolls are 100% authentic. We work directly with authorized distributors to ensure that every product we sell is genuine. Each doll comes with its original packaging and authentication certificate.",
        "fr": "Oui, toutes nos poupées Labubu sont 100% authentiques. Nous travaillons directement avec des distributeurs autorisés pour garantir que chaque produit que nous vendons est authentique. Chaque poupée est livrée avec son emballage d'origine et son certificat d'authenticité."
    },
    "faq_q2": {
        "en": "How do I care for my Labubu doll?",
        "fr": "Comment prendre soin de ma poupée Labubu?"
    },
    "faq_a2_intro": {
        "en": "To keep your Labubu doll in pristine condition, we recommend the following:",
        "fr": "Pour garder votre poupée Labubu en parfait état, nous recommandons ce qui suit:"
    },
    "faq_a2_1": {
        "en": "Keep your doll away from direct sunlight to prevent color fading",
        "fr": "Gardez votre poupée à l'abri de la lumière directe du soleil pour éviter la décoloration"
    },
    "faq_a2_2": {
        "en": "Dust regularly with a soft, dry cloth",
        "fr": "Dépoussiérez régulièrement avec un chiffon doux et sec"
    },
    "faq_a2_3": {
        "en": "Avoid using cleaning chemicals or water on the doll",
        "fr": "Évitez d'utiliser des produits chimiques de nettoyage ou de l'eau sur la poupée"
    },
    "faq_a2_4": {
        "en": "Store in a cool, dry place when not on display",
        "fr": "Conservez dans un endroit frais et sec lorsqu'elle n'est pas exposée"
    },
    "faq_a2_5": {
        "en": "Handle with clean hands to prevent dirt or oil transfer",
        "fr": "Manipulez avec des mains propres pour éviter le transfert de saleté ou d'huile"
    },
    "faq_q3": {
        "en": "Do you ship internationally?",
        "fr": "Livrez-vous à l'international?"
    },
    "faq_a3": {
        "en": "Currently, we only ship within Montreal, Quebec. Our dedicated in-house team of carriers ensures fast, reliable delivery across the Montreal area with free shipping across montreal. We're focused on providing exceptional service to our local community before expanding to other regions.",
        "fr": "Actuellement, nous livrons uniquement à Montréal, Québec. Notre équipe dédiée de livreurs internes assure une livraison rapide et fiable dans toute la région de Montréal avec une livraison gratuite à travers Montréal. Nous nous concentrons sur la fourniture d'un service exceptionnel à notre communauté locale avant de nous étendre à d'autres régions."
    },
    "faq_q4": {
        "en": "How often do you get new Labubu releases?",
        "fr": "À quelle fréquence recevez-vous de nouvelles sorties Labubu?"
    },
    "faq_a4": {
        "en": "We receive new Labubu releases as soon as they become available from our distributors. The frequency of new releases varies, but we typically see new designs or colorways every few months. Limited editions may be released less frequently. We announce all new arrivals through our newsletter and social media channels, so be sure to follow us to stay updated.",
        "fr": "Nous recevons de nouvelles sorties Labubu dès qu'elles sont disponibles auprès de nos distributeurs. La fréquence des nouvelles sorties varie, mais nous voyons généralement de nouveaux designs ou coloris tous les quelques mois. Les éditions limitées peuvent être publiées moins fréquemment. Nous annonçons toutes les nouvelles arrivées via notre newsletter et nos canaux de médias sociaux, alors assurez-vous de nous suivre pour rester informé."
    },
    "faq_q5": {
        "en": "What is your return policy?",
        "fr": "Quelle est votre politique de retour?"
    },
    "faq_a5": {
        "en": "We offer a 30-day return policy for all unopened items in their original packaging. If you receive a damaged or defective item, please contact us within 7 days of receipt, and we'll arrange for a replacement or refund. Please note that limited edition items may have different return conditions. For full details, please visit our Return Policy page.",
        "fr": "Nous offrons une politique de retour de 30 jours pour tous les articles non ouverts dans leur emballage d'origine. Si vous recevez un article endommagé ou défectueux, veuillez nous contacter dans les 7 jours suivant la réception, et nous organiserons un remplacement ou un remboursement. Veuillez noter que les articles en édition limitée peuvent avoir des conditions de retour différentes. Pour plus de détails, veuillez consulter notre page Politique de retour."
    },
    "cta_title": {
        "en": "Ready to Start Your Collection?",
        "fr": "Prêt à Commencer Votre Collection?"
    },
    "cta_text": {
        "en": "Browse our selection of authentic Labubu dolls and enjoy free shipping across montreal!",
        "fr": "Parcourez notre sélection de poupées Labubu authentiques et profitez de la livraison gratuite à Montréal!"
    },
    "our_mission": {
        "en": "Our Mission",
        "fr": "Notre Mission"
    },
    
    // Contact Page
    "contact_us": {
        "en": "Contact Us",
        "fr": "Contactez-Nous"
    },
    "contact_message": {
        "en": "We'd love to hear from you! Reach out with any questions, comments, or inquiries.",
        "fr": "Nous aimerions avoir de vos nouvelles! Contactez-nous pour toute question, commentaire ou demande."
    },
    "our_location": {
        "en": "Our Location",
        "fr": "Notre Emplacement"
    },
    "map_placeholder": {
        "en": "(Map would be displayed here in a real implementation)",
        "fr": "(Une carte serait affichée ici dans une implémentation réelle)"
    },
    "get_directions": {
        "en": "Get Directions",
        "fr": "Obtenir l'Itinéraire"
    },
    "phone": {
        "en": "Phone",
        "fr": "Téléphone"
    },
    "customer_service_hours": {
        "en": "Monday-Friday: 9am-5pm EST",
        "fr": "Lundi-Vendredi: 9h-17h EST"
    },
    "email": {
        "en": "Email",
        "fr": "Courriel"
    },
    "general_inquiries": {
        "en": "General Inquiries:",
        "fr": "Demandes Générales:"
    },
    "customer_support": {
        "en": "Customer Support:",
        "fr": "Support Client:"
    },
    "wholesale_inquiries": {
        "en": "Wholesale Inquiries:",
        "fr": "Demandes de Vente en Gros:"
    },
    "send_message": {
        "en": "Send Us a Message",
        "fr": "Envoyez-Nous un Message"
    },
    "your_name": {
        "en": "Your Name",
        "fr": "Votre Nom"
    },
    "your_email": {
        "en": "Your Email",
        "fr": "Votre Courriel"
    },
    "subject": {
        "en": "Subject",
        "fr": "Sujet"
    },
    "message": {
        "en": "Message",
        "fr": "Message"
    },
    "subscribe_newsletter": {
        "en": "Subscribe to our newsletter for updates on new releases and promotions",
        "fr": "Abonnez-vous à notre newsletter pour des mises à jour sur les nouvelles sorties et promotions"
    },
    "send": {
        "en": "Send Message",
        "fr": "Envoyer le Message"
    },
    "faq": {
        "en": "Frequently Asked Questions",
        "fr": "Questions Fréquemment Posées"
    },
    
    // Footer
    "all_rights_reserved": {
        "en": "All rights reserved.",
        "fr": "Tous droits réservés."
    },
    "privacy_policy": {
        "en": "Privacy Policy",
        "fr": "Politique de Confidentialité"
    },
    "terms_of_service": {
        "en": "Terms of Service",
        "fr": "Conditions d'Utilisation"
    },
    "terms_conditions": {
        "en": "Terms & Conditions",
        "fr": "Termes et Conditions"
    },
    "subscribe_newsletter_footer": {
        "en": "Subscribe to Our Newsletter",
        "fr": "Abonnez-vous à Notre Newsletter"
    },
    "newsletter_description": {
        "en": "Stay updated on new releases, restocks, and exclusive offers.",
        "fr": "Restez informé des nouvelles sorties, des réapprovisionnements et des offres exclusives."
    },
    "your_email_address": {
        "en": "Your email address",
        "fr": "Votre adresse courriel"
    },
    "subscribe": {
        "en": "Subscribe",
        "fr": "S'abonner"
    },
    "subscribe_button": {
        "en": "Subscribe",
        "fr": "S'abonner"
    },
    "connect_with_us": {
        "en": "Connect With Us",
        "fr": "Connectez-vous Avec Nous"
    },
    "follow_social_media": {
        "en": "Follow us on social media for the latest updates, new releases, and community events.",
        "fr": "Suivez-nous sur les réseaux sociaux pour les dernières mises à jour, les nouvelles sorties et les événements communautaires."
    },
    "footer_description": {
        "en": "Your local Montreal destination for authentic Labubu dolls with free shipping across montreal.",
        "fr": "Votre destination locale à Montréal pour des poupées Labubu authentiques avec livraison gratuite dans toute la ville."
    },
    "footer_shop": {
        "en": "Shop",
        "fr": "Boutique"
    },
    "footer_company": {
        "en": "Company",
        "fr": "Entreprise"
    },
    "footer_information": {
        "en": "Information",
        "fr": "Information"
    },
    "copyright": {
        "en": "© 2025 LeLabubu.ca. All rights reserved.",
        "fr": "© 2025 LeLabubu.ca. Tous droits réservés."
    },
    "classic_labubu": {
        "en": "Classic Labubu",
        "fr": "Labubu Classique"
    },
    "mini_labubu": {
        "en": "Mini Labubu",
        "fr": "Mini Labubu"
    },
    "limited_edition": {
        "en": "Limited Edition",
        "fr": "Édition Limitée"
    },
    "accessories": {
        "en": "Accessories",
        "fr": "Accessoires"
    },
    "welcome_to": {
        "en": "Welcome to LeLabubu.ca",
        "fr": "Bienvenue sur LeLabubu.ca"
    },
    "hero_description": {
        "en": "Discover the enchanting world of Labubu dolls with free shipping across montreal - the perfect blend of cute and creepy that has captivated collectors worldwide.",
        "fr": "Découvrez le monde enchanteur des poupées Labubu avec livraison gratuite à Montréal - le mélange parfait de mignon et d'étrange qui a captivé les collectionneurs du monde entier."
    },
    "featured_products": {
        "en": "Featured Products",
        "fr": "Produits en Vedette"
    },
    "featured_products_desc": {
        "en": "Our most popular Labubu dolls and collectibles",
        "fr": "Nos poupées et objets de collection Labubu les plus populaires"
    },
    "view_all_products": {
        "en": "View All Products",
        "fr": "Voir Tous les Produits"
    },
    "new_arrivals": {
        "en": "New Arrivals",
        "fr": "Nouveautés"
    },
    "new_arrivals_desc": {
        "en": "The latest additions to our Labubu collection",
        "fr": "Les derniers ajouts à notre collection Labubu"
    },
    "best_sellers": {
        "en": "Best Sellers",
        "fr": "Meilleures Ventes"
    },
    "best_sellers_desc": {
        "en": "Our most popular Labubu dolls loved by collectors",
        "fr": "Nos poupées Labubu les plus populaires adorées par les collectionneurs"
    },
    "testimonials_title": {
        "en": "What Our Customers Say",
        "fr": "Ce Que Disent Nos Clients"
    },
    "testimonials_desc": {
        "en": "Read reviews from our happy customers in Montreal",
        "fr": "Lisez les avis de nos clients satisfaits à Montréal"
    },
    "newsletter_title": {
        "en": "Subscribe to Our Newsletter",
        "fr": "Abonnez-vous à Notre Newsletter"
    },
    "newsletter_desc": {
        "en": "Stay updated on new releases, restocks, and exclusive offers!",
        "fr": "Restez informé des nouvelles sorties, des réapprovisionnements et des offres exclusives!"
    },
    "email_placeholder": {
        "en": "Your email address",
        "fr": "Votre adresse e-mail"
    },
    "cart": {
        "en": "Cart",
        "fr": "Panier"
    },
    "proceed_to_checkout": {
        "en": "Proceed to Checkout",
        "fr": "Procéder au Paiement"
    },
    "customer_service_message": {
        "en": "Our customer service team is here to assist you with any questions about your order.",
        "fr": "Notre équipe de service client est là pour vous aider avec toutes vos questions concernant votre commande."
    },
    "price_advantage_banner": {
        "en": "Free shipping across montreal",
        "fr": "Livraison gratuite à travers Montréal"
    }
};
