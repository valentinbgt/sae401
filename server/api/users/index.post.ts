import prisma from "~/server/utils/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  try {
    // Check if user is authenticated using JWT from Authorization header
    const authHeader = getRequestHeader(event, "authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        status: "error",
        message: "Token d'authentification manquant ou invalide",
      };
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return {
        status: "error",
        message: "Token d'authentification manquant",
      };
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET environment variable is not defined");
      return {
        status: "error",
        message: "Erreur de configuration du serveur",
      };
    }

    // Verify and decode the token
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    } catch (tokenError: any) {
      console.error("JWT verification error:", tokenError.message);
      return {
        status: "error",
        message: "Token d'authentification invalide",
      };
    }

    const userId = decoded.userId;
    if (!userId) {
      return {
        status: "error",
        message: "Token d'authentification invalide (userId manquant)",
      };
    }

    // Check if the current user is admin
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { admin: true },
    });

    if (!currentUser || !currentUser.admin) {
      return {
        status: "error",
        message: "Accès non autorisé. Vous devez être administrateur.",
      };
    }

    // Get the body of the request
    const body = await readBody(event);
    const { nom, prenom, email, password, semestre, prof, admin } = body;

    // Validate required fields
    if (!nom || !prenom || !email || !password) {
      return {
        status: "error",
        message: "Tous les champs obligatoires doivent être remplis",
      };
    }

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        status: "error",
        message: "Un utilisateur avec cette adresse email existe déjà",
      };
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        nom,
        prenom,
        email,
        password: hashedPassword,
        semestre: semestre ? parseInt(semestre) : null,
        prof: !!prof,
        admin: !!admin,
        avertissement: 0, // Initialize with a default value
        limite: 0, // Initialize with a default value
        statut: "actif", // Initialize with a default value
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return {
      status: "success",
      message: "Utilisateur créé avec succès",
      data: userWithoutPassword,
    };
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    return {
      status: "error",
      message: "Erreur lors de la création de l'utilisateur",
    };
  }
});
