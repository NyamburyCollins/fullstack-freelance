
from app import create_app, db
from app.models import User, Service, Application, Category, service_categories
from sqlalchemy.exc import IntegrityError

app = create_app()

with app.app_context():
    print("Creating tables if they don’t exist...")
    db.create_all()

    print("Clearing old data...")
    db.session.query(service_categories).delete()
    Application.query.delete()
    Service.query.delete()
    Category.query.delete()
    User.query.delete()

    print("Seeding users...")
    client1 = User(
        username="client_one",
        email="client1@example.com",
        password="password123",
        role="client",
        bio="Looking for top freelancers to bring my ideas to life."
    )
    client2 = User(
        username="client_two",
        email="client2@example.com",
        password="password123",
        role="client",
        bio="Startup founder looking for design help."
    )
    freelancer1 = User(
        username="freelancer_ken",
        email="freelancer1@example.com",
        password="password123",
        role="freelancer",
        bio="Fullstack dev with 5+ years experience."
    )
    freelancer2 = User(
        username="freelancer_jane",
        email="freelancer2@example.com",
        password="password123",
        role="freelancer",
        bio="UI/UX designer passionate about clean interfaces."
    )

    freelancer3 = User(
        username="webdev_mary",
        email="mary@example.com",
        password="password123",
        role="freelancer",
        bio="Expert in full-stack development, WordPress, and SEO. I can build responsive company websites with modern UI/UX."
    )
    freelancer4 = User(
        username="uiux_pro",
        email="jane@example.com",
        password="password123",
        role="freelancer",
        bio="UI/UX designer with 5+ years of experience in Figma, Adobe XD, and mobile-first design."
    )
    freelancer5 = User(
        username="android_ace",
        email="kevin@example.com",
        password="password123",
        role="freelancer",
        bio="Android developer specialized in e-commerce apps using Kotlin, Jetpack Compose, and Firebase."
    )
    freelancer6 = User(
        username="content_queen",
        email="linda@example.com",
        password="password123",
        role="freelancer",
        bio="Professional content writer with experience in SEO, blogs, and marketing copywriting."
    )
    freelancer7 = User(
        username="creative_writer",
        email="brian@example.com",
        password="password123",
        role="freelancer",
        bio="Skilled content creator focused on branding, social media, and product descriptions."
    )
    freelancer8 = User(
        username="pixel_artist",
        email="maria@example.com",
        password="password123",
        role="freelancer",
        bio="Web designer passionate about clean UI, responsive layouts, and accessibility best practices."
    )

    admin = User(
        username="admin",
        email="admin@example.com",
        password="admin123",
        role="admin",
        bio="Platform administrator"
    )

    db.session.add_all([
        client1, client2, freelancer1, freelancer2, admin,
        freelancer3, freelancer4, freelancer5,
        freelancer6, freelancer7, freelancer8
    ])
    db.session.commit()

    print("Seeding categories...")
    cat1 = Category(name="Web Development")
    cat2 = Category(name="Graphic Design")
    cat3 = Category(name="Mobile Apps")

    db.session.add_all([cat1, cat2, cat3])
    db.session.commit()

    print("Seeding services...")
    service1 = Service(
        title="Build a company website",
        description="Need a professional website built with React and Flask.",
        budget=15000,
        status="open",
        client_id=client1.id
    )
    service2 = Service(
        title="Design a mobile app UI",
        description="Looking for a sleek UI design for a social app.",
        budget=8000,
        status="open",
        client_id=client2.id
    )
    service3 = Service(
        title="E-commerce Android App",
        description="Full app with payment integration and admin dashboard.",
        budget=25000,
        status="open",
        client_id=client1.id
    )
    service4 = Service(
        title="Content",
        description="Need creative blog articles and SEO-focused content.",
        budget=1399,
        status="open",
        client_id=client1.id
    )
    service5 = Service(
        title="Content creation",
        description="Social media captions and short scripts for reels.",
        budget=1200,
        status="open",
        client_id=client2.id
    )
    service6 = Service(
        title="Website Design",
        description="Design the UI layout and color theme for a business site.",
        budget=10000,
        status="open",
        client_id=client1.id
    )

    db.session.add_all([service1, service2, service3, service4, service5, service6])
    db.session.commit()

    service1.categories.append(cat1)
    service2.categories.append(cat2)
    service3.categories.extend([cat1, cat3])
    service4.categories.append(cat2)
    service5.categories.append(cat2)
    service6.categories.append(cat2)
    db.session.commit()

    print("Seeding applications...")
    applications = [
        Application(status="pending", message="Hi, I have experience building e-commerce platforms. Let’s work together!", freelancer_id=freelancer1.id, service_id=service3.id),
        Application(status="pending", message="I’d love to help with the UI design. Check my portfolio.", freelancer_id=freelancer2.id, service_id=service2.id),
        Application(status="pending", message="I’ve built sites with Flask and React before — excited to collaborate!", freelancer_id=freelancer1.id, service_id=service1.id),
        Application(status="pending", message="Experienced with mobile-first design. Can deliver fast.", freelancer_id=freelancer2.id, service_id=service1.id),
        Application(status="pending", message="I’ve written SEO-friendly content for several brands.", freelancer_id=freelancer2.id, service_id=service4.id),
        Application(status="pending", message="Skilled in marketing content for Instagram and YouTube.", freelancer_id=freelancer2.id, service_id=service5.id),
        Application(status="pending", message="Let’s build a clean and modern website together!", freelancer_id=freelancer1.id, service_id=service6.id),
        Application(status="pending", message="Love web aesthetics. I can deliver beautiful UI in 5 days.", freelancer_id=freelancer2.id, service_id=service6.id),

        Application(status="pending", message="Experienced in responsive business websites using React and Django.", freelancer_id=freelancer3.id, service_id=service1.id),
        Application(status="pending", message="Specialist in UI/UX, excited to design your mobile app.", freelancer_id=freelancer4.id, service_id=service2.id),
        Application(status="pending", message="Built e-commerce apps with Firebase — ready to go!", freelancer_id=freelancer5.id, service_id=service3.id),
        Application(status="pending", message="SEO-focused writer ready to deliver great content.", freelancer_id=freelancer6.id, service_id=service4.id),
        Application(status="pending", message="Creative content creator ready to grow your brand!", freelancer_id=freelancer7.id, service_id=service5.id),
        Application(status="pending", message="Skilled in accessible and responsive web UI.", freelancer_id=freelancer8.id, service_id=service6.id),
    ]

    db.session.add_all(applications)
    db.session.commit()

    print(" Seeded users, categories, services, and applications successfully!")
