import prisma from "~/server/utils/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      throw createError({
        statusCode: 401,
        message: "Email ou mot de passe incorrect",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: "1h",
    });

    return { status: "success", token };
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la connexion",
    });
  }
});
