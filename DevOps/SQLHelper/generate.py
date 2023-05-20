import os
import csv
import random
from faker import Faker
from multiprocessing import Process
import hashlib
from enum import Enum

fake = Faker()

USERS_COUNT = 10_000
PAGE_PREFERENCE = 5

ARTISTS_COUNT = 1_000_000
PAINTINGS_COUNT = 1_000_000
MUSEUMS_COUNT = 1_000_000
EXHIBITIONS_COUNT = 10_000_000

UNIVERSITIES = [
    "University of Cambridge",
    "University of Oxford",
    "Stanford University",
    "Massachusetts Institute of Technology",
    "University of Chicago",
    "University of California",
    "University of Pennsylvania",
    "Yale University",
    "Columbia University",
    "Princeton University",
]

MOVEMENTS = [
    "Abstract Expressionism",
    "Baroque",
    "Cubism",
    "Dada",
    "Fauvism",
    "Impressionism",
    "Minimalism",
    "Pop Art",
    "Renaissance",
    "Romanticism",
    "Surrealism",
]

DESCRIPTIVE_WORDS = [
    "Majestic",
    "Ephemeral",
    "Whimsical",
    "Serene",
    "Mystical",
    "Vibrant",
    "Elegant",
    "Bold",
    "Surreal",
    "Dreamy",
]

MEDIUMS = ["Oil", "Acrylic", "Watercolor", "Pastel", "Charcoal", "Digital"]

SUBJECTS = [
    "Landscape",
    "Portrait",
    "Still Life",
    "Abstract",
    "Cityscape",
    "Wildlife",
    "Floral",
    "Historical",
    "Mythological",
    "Religious",
    "Marine",
]


class Gender(Enum):
    Female = 0
    Male = 1
    Other = 2


class MaritalStatus(Enum):
    Single = 0
    Married = 1
    Widowed = 2
    Separated = 3
    Divorced = 4


class AccessLevel(Enum):
    Unconfirmed = 0
    Regular = 1
    Moderator = 2
    Admin = 3


PASSWORD = hashlib.sha256(b"123").hexdigest()

ACCESS_LEVEL = AccessLevel.Regular.value


def create_users_csv():
    print("Begin create_users_csv")

    if os.path.exists("users.csv"):
        os.remove("users.csv")

    with open("users.csv", "w", newline="") as f:
        writer = csv.writer(f)

        unique_names = set()
        for i in range(1, USERS_COUNT + 1):
            while True:
                name = fake.user_name()
                if name not in unique_names:
                    unique_names.add(name)
                    break

            writer.writerow([i, name, PASSWORD, ACCESS_LEVEL])

    print("End create_users_csv")


def create_user_profiles_csv():
    print("Begin create_user_profiles_csv")
    genders = list(Gender)
    marital_statuses = list(MaritalStatus)

    if os.path.exists("user_profiles.csv"):
        os.remove("user_profiles.csv")

    with open("user_profiles.csv", "w", newline="") as f:
        writer = csv.writer(f)

        for i in range(1, USERS_COUNT + 1):
            bio = "\n".join(fake.paragraphs(nb=3))
            location = fake.city()
            birthday = fake.date_between(start_date="-60y", end_date="-18y")
            gender = random.choice(genders).value
            marital_status = random.choice(marital_statuses).value
            user_id = i

            writer.writerow(
                [
                    i,
                    user_id,
                    bio,
                    location,
                    birthday,
                    gender,
                    marital_status,
                    PAGE_PREFERENCE,
                ]
            )

    print("End create_user_profiles_csv")


def create_artists_csv():
    print("Begin create_artists_csv")

    if os.path.exists("artists.csv"):
        os.remove("artists.csv")

    with open("artists.csv", "w", newline="") as f:
        writer = csv.writer(f)
        for i in range(1, ARTISTS_COUNT + 1):
            first_name = fake.first_name()
            last_name = fake.last_name()
            birth_date = fake.date_between(start_date="-50y", end_date="today")
            birth_place = fake.city()
            education = random.choice(UNIVERSITIES)
            movement = random.choice(MOVEMENTS)

            user_id = random.randint(1, USERS_COUNT)
            writer.writerow(
                [
                    i,
                    first_name,
                    last_name,
                    birth_date,
                    birth_place,
                    education,
                    movement,
                    user_id,
                ]
            )

    print("End create_artists_csv")


def create_paintings_csv():
    print("Begin create_paintings_csv")

    if os.path.exists("paintings.csv"):
        os.remove("paintings.csv")

    with open("paintings.csv", "w", newline="") as f:
        writer = csv.writer(f)
        for i in range(1, PAINTINGS_COUNT + 1):
            title = f"{random.choice(DESCRIPTIVE_WORDS)} {fake.word()} {fake.word()}"
            creation_year = random.randint(1800, 2023)
            height = round(random.uniform(0.5, 5.0), 2)
            subject = random.choice(SUBJECTS)
            medium = random.choice(MEDIUMS)
            description = "\n\n".join(fake.paragraphs(nb=2, ext_word_list=None))
            artist_id = random.randint(1, ARTISTS_COUNT)

            user_id = random.randint(1, USERS_COUNT)
            writer.writerow(
                [
                    i,
                    title,
                    creation_year,
                    height,
                    subject,
                    medium,
                    description,
                    artist_id,
                    user_id,
                ]
            )

    print("End create_paintings_csv")


def create_museums_csv():
    print("Begin create_museums_csv")

    if os.path.exists("museums.csv"):
        os.remove("museums.csv")

    with open("museums.csv", "w", newline="") as f:
        writer = csv.writer(f)
        for i in range(1, MUSEUMS_COUNT + 1):
            name = f"{fake.company()} Museum"
            address = fake.street_address()
            foundation_date = fake.date_between(start_date="-50y", end_date="today")
            architect = f"{fake.first_name()} {fake.last_name()}"
            website = fake.url()

            user_id = random.randint(1, USERS_COUNT)
            writer.writerow(
                [i, name, address, foundation_date, architect, website, user_id]
            )

    print("End create_museums_csv")


def create_exhibitions_csv():
    print("Begin create_exhibitions_csv")

    if os.path.exists("exhibitions.csv"):
        os.remove("exhibitions.csv")

    with open("exhibitions.csv", "w", newline="") as f:
        writer = csv.writer(f)
        unique_exhibitions = set()
        for _ in range(EXHIBITIONS_COUNT):
            while True:
                artist_id = random.randint(1, ARTISTS_COUNT)
                museum_id = random.randint(1, MUSEUMS_COUNT)
                if (artist_id, museum_id) not in unique_exhibitions:
                    unique_exhibitions.add((artist_id, museum_id))
                    break

        print(f"Generated {len(unique_exhibitions)} unique exhibitions")

        for artist_id, museum_id in unique_exhibitions:
            start_date = fake.date_between(start_date="-10y", end_date="today")
            end_date = fake.date_between(start_date=start_date, end_date="today")

            user_id = random.randint(1, USERS_COUNT)
            writer.writerow([artist_id, museum_id, start_date, end_date, user_id])

    print("End create_exhibitions_csv")


if __name__ == "__main__":
    processes = []
    for func in [
        create_users_csv,
        create_user_profiles_csv,
        create_artists_csv,
        create_paintings_csv,
        create_museums_csv,
        create_exhibitions_csv,
    ]:
        p = Process(target=func)
        processes.append(p)
        p.start()

    for p in processes:
        p.join()

    print("Done")
