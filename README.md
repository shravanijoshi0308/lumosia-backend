# Lumosia Backend ✨

The web backend for **Lumosia** — it handles user accounts and secure login.

Lumosia is a good-luck-charm companion. This is the part that runs on a server: people **sign up**, **log in**, and their passwords are stored **safely** — hashed, never as plain text. Built to learn (and show) real-world backend authentication from scratch.

## Tech stack

- **Java 21**
- **Spring Boot** : web framework
- **Spring Security** : authentication & access control
- **Spring Data JPA + Hibernate** : database access
- **H2** : database
- **BCrypt** : one-way password hashing
- **Maven** : build tool

## Features

- **Sign up** — create an account with a username, email, and password
- **Secure passwords** — hashed with BCrypt, never stored in plain text
- **Log in / log out** — session-based authentication
- **Protected pages** — some pages require a login to view

## How to run

You'll need **Java 21 or higher**. Then:

    git clone https://github.com/shravanijoshi0308/lumosia-backend.git
    cd lumosia-backend
    ./mvnw spring-boot:run

Open **http://localhost:8080** — sign up at `/signup`, then log in at `/login`.

*(Or open the folder in IntelliJ IDEA and run `LumosiaApplication`.)*

## Part of the Lumosia project

Lumosia has two parts, under one brand:

- **[Lumosia desktop app](https://github.com/shravanijoshi0308/project-lumosia)** — the good-luck charm that dangles on your Mac desktop
- **Lumosia Backend** (this repo) — accounts & login

---

Made by **Shravani Joshi** · [github.com/shravanijoshi0308](https://github.com/shravanijoshi0308)
