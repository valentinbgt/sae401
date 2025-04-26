import prisma from "~/server/utils/prisma";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Validate semestre
  const semestre = parseInt(body.semestre);
  if (isNaN(semestre) || semestre < 1 || semestre > 6) {
    throw createError({
      statusCode: 400,
      message: "Le semestre doit être un nombre entre 1 et 6",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: {
        nom: body.nom,
        prenom: body.prenom,
        email: body.email,
        password: hashedPassword,
        statut: "student", // Default status
        avertissement: 0,
        limite: 0,
        prof: false, // Set default value for prof
        admin: false, // Set default value for admin
        semestre, // Store chosen semester
      },
    });

    return { status: "success", data: user };
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    throw createError({
      statusCode: 500,
      message: "Erreur lors de l'inscription",
    });
  }
});
