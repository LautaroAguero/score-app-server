import Joi from "joi";

// ============ USER SCHEMAS ============
export const userRegisterSchema = Joi.object({
  name: Joi.string().required().min(2).max(100).trim().messages({
    "string.empty": "El nombre no puede estar vacío",
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "string.max": "El nombre no puede exceder 100 caracteres",
    "any.required": "El nombre es requerido",
  }),
  email: Joi.string().required().email().lowercase().trim().messages({
    "string.email": "El email debe ser válido",
    "string.empty": "El email no puede estar vacío",
    "any.required": "El email es requerido",
  }),
  password: Joi.string().required().min(6).max(50).messages({
    "string.empty": "La contraseña no puede estar vacía",
    "string.min": "La contraseña debe tener al menos 6 caracteres",
    "string.max": "La contraseña no puede exceder 50 caracteres",
    "any.required": "La contraseña es requerida",
  }),
  organization: Joi.string().max(100).optional().trim(),
  phoneNumber: Joi.string()
    .optional()
    .pattern(/^\+?[0-9]{10,}$/)
    .messages({
      "string.pattern.base": "El teléfono debe tener al menos 10 dígitos",
    }),
  experience: Joi.string().max(200).optional().trim(),
}).strict();

export const userLoginSchema = Joi.object({
  email: Joi.string().required().email().lowercase().trim().messages({
    "string.email": "El email debe ser válido",
    "string.empty": "El email no puede estar vacío",
    "any.required": "El email es requerido",
  }),
  password: Joi.string().required().messages({
    "string.empty": "La contraseña no puede estar vacía",
    "any.required": "La contraseña es requerida",
  }),
}).strict();

// ============ TOURNAMENT SCHEMAS ============
export const tournamentCreateSchema = Joi.object({
  name: Joi.string().required().min(3).max(100).trim().messages({
    "string.empty": "El nombre del torneo no puede estar vacío",
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no puede exceder 100 caracteres",
    "any.required": "El nombre del torneo es requerido",
  }),
  description: Joi.string().max(1000).optional().trim(),
  sportType: Joi.string()
    .required()
    .valid("soccer", "basketball", "volleyball", "tennis", "rugby")
    .messages({
      "any.only":
        "El tipo de deporte debe ser: soccer, basketball, volleyball, tennis o rugby",
      "any.required": "El tipo de deporte es requerido",
    }),
  tournamentFormat: Joi.string()
    .required()
    .valid("league", "knockout", "hybrid")
    .messages({
      "any.only": "El formato debe ser: league, knockout o hybrid",
      "any.required": "El formato del torneo es requerido",
    }),
  numberOfParticipants: Joi.number()
    .required()
    .integer()
    .min(2)
    .max(1000)
    .messages({
      "number.min": "Debe haber al menos 2 participantes",
      "number.max": "No puede haber más de 1000 participantes",
      "any.required": "El número de participantes es requerido",
    }),
  pointsForWin: Joi.number().integer().min(0).optional().default(3),
  pointsForDraw: Joi.number().integer().min(0).optional().default(1),
  pointsForLoss: Joi.number().integer().min(0).optional().default(0),
}).strict();

export const tournamentUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional().trim(),
  description: Joi.string().max(1000).optional().trim(),
  sportType: Joi.string()
    .optional()
    .valid("soccer", "basketball", "volleyball", "tennis", "rugby")
    .messages({
      "any.only":
        "El tipo de deporte debe ser: soccer, basketball, volleyball, tennis o rugby",
    }),
  tournamentFormat: Joi.string()
    .optional()
    .valid("league", "knockout", "hybrid")
    .messages({
      "any.only": "El formato debe ser: league, knockout o hybrid",
    }),
  numberOfParticipants: Joi.number()
    .integer()
    .min(2)
    .max(1000)
    .optional()
    .messages({
      "number.min": "Debe haber al menos 2 participantes",
      "number.max": "No puede haber más de 1000 participantes",
    }),
  pointsForWin: Joi.number().integer().min(0).optional(),
  pointsForDraw: Joi.number().integer().min(0).optional(),
  pointsForLoss: Joi.number().integer().min(0).optional(),
}).strict();

// ============ ADD TEAMS TO TOURNAMENT SCHEMA ============
export const addTeamsSchema = Joi.object({
  teamIds: Joi.array()
    .items(
      Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .messages({
          "string.pattern.base":
            "Cada ID de equipo debe ser un ObjectId válido",
        })
    )
    .min(1)
    .max(32)
    .required()
    .messages({
      "array.min": "Debe proporcionar al menos 1 equipo",
      "array.max": "No puede agregar más de 32 equipos",
      "any.required": "El campo teamIds es requerido",
    }),
}).strict();

// ============ AUTO-GENERATE MATCHES SCHEMA ============
export const autoGenerateMatchesSchema = Joi.object({
  format: Joi.string()
    .required()
    .valid("league", "knockout", "hybrid")
    .messages({
      "any.only": "El formato debe ser 'league', 'knockout' o 'hybrid'",
      "any.required": "El campo format es requerido",
    }),
  twoLegs: Joi.boolean().optional().default(false).messages({
    "boolean.base": "El campo twoLegs debe ser un booleano",
  }),
}).strict();

// ============ TEAM SCHEMAS ============
export const teamCreateSchema = Joi.object({
  name: Joi.string().required().min(2).max(100).trim().messages({
    "string.empty": "El nombre del equipo no puede estar vacío",
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "string.max": "El nombre no puede exceder 100 caracteres",
    "any.required": "El nombre del equipo es requerido",
  }),
  tournament: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "El ID del torneo no es válido",
      "any.required": "El torneo es requerido",
    }),
  group: Joi.string().max(50).optional().trim(),
}).strict();

export const teamUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional().trim(),
  group: Joi.string().max(50).optional().trim(),
}).strict();

// ============ MATCH SCHEMAS ============
export const matchCreateSchema = Joi.object({
  tournament: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "El ID del torneo no es válido",
      "any.required": "El torneo es requerido",
    }),
  homeTeam: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "El ID del equipo local no es válido",
      "any.required": "El equipo local es requerido",
    }),
  awayTeam: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "El ID del equipo visitante no es válido",
      "any.required": "El equipo visitante es requerido",
    }),
  homeTeamScore: Joi.number().integer().min(0).optional(),
  awayTeamScore: Joi.number().integer().min(0).optional(),
  status: Joi.string()
    .optional()
    .valid("scheduled", "playing", "completed")
    .messages({
      "any.only": "El estado debe ser: scheduled, playing o completed",
    }),
  matchDate: Joi.string().optional().isoDate().messages({
    "string.isoDate":
      "La fecha debe estar en formato ISO 8601 (ej: 2025-11-11T03:00:00Z)",
  }),
  matchTime: Joi.string()
    .optional()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .messages({
      "string.pattern.base": "La hora debe estar en formato HH:MM",
    }),
}).strict();

export const matchUpdateSchema = Joi.object({
  homeTeamScore: Joi.number().integer().min(0).optional(),
  awayTeamScore: Joi.number().integer().min(0).optional(),
  status: Joi.string()
    .optional()
    .valid("scheduled", "playing", "completed")
    .messages({
      "any.only": "El estado debe ser: scheduled, playing o completed",
    }),
  matchDate: Joi.string().optional().isoDate().messages({
    "string.isoDate":
      "La fecha debe estar en formato ISO 8601 (ej: 2025-11-11T03:00:00Z)",
  }),
  matchTime: Joi.string()
    .optional()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .messages({
      "string.pattern.base": "La hora debe estar en formato HH:MM",
    }),
}).strict();

// ============ BULK SCHEDULE MATCHES SCHEMA ============
export const bulkScheduleMatchesSchema = Joi.object({
  updates: Joi.array()
    .items(
      Joi.object({
        matchId: Joi.string()
          .required()
          .regex(/^[0-9a-fA-F]{24}$/)
          .messages({
            "string.pattern.base": "El matchId debe ser un ObjectId válido",
            "any.required": "El campo matchId es requerido",
          }),
        matchDate: Joi.string().required().isoDate().messages({
          "string.isoDate":
            "La fecha debe estar en formato ISO 8601 (ej: 2025-11-11T03:00:00Z)",
          "any.required": "El campo matchDate es requerido",
        }),
        matchTime: Joi.string()
          .required()
          .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
          .messages({
            "string.pattern.base": "La hora debe estar en formato HH:MM",
            "any.required": "El campo matchTime es requerido",
          }),
      }).strict()
    )
    .min(1)
    .required()
    .messages({
      "array.min": "Debe proporcionar al menos 1 match para agendar",
      "any.required": "El campo updates es requerido",
    }),
}).strict();

// ============ PLAYER SCHEMAS ============
export const playerCreateSchema = Joi.object({
  name: Joi.string().required().min(2).max(100).trim().messages({
    "string.empty": "El nombre del jugador no puede estar vacío",
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "string.max": "El nombre no puede exceder 100 caracteres",
    "any.required": "El nombre del jugador es requerido",
  }),
  number: Joi.number().integer().min(0).max(99).optional(),
  position: Joi.string().max(50).optional().trim(),
  team: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "El ID del equipo no es válido",
      "any.required": "El equipo es requerido",
    }),
  height: Joi.number().min(50).max(300).optional(),
  weight: Joi.number().min(20).max(200).optional(),
  dateOfBirth: Joi.string()
    .optional()
    .isoDate()
    .custom((value, helpers) => {
      if (new Date(value) > new Date()) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "string.isoDate":
        "La fecha debe estar en formato ISO 8601 (ej: 1987-06-24)",
      "any.invalid": "La fecha de nacimiento no puede ser en el futuro",
    }),
  nationality: Joi.string().max(50).optional().trim(),
}).strict();

export const playerUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional().trim(),
  number: Joi.number().integer().min(0).max(99).optional(),
  position: Joi.string().max(50).optional().trim(),
  team: Joi.string()
    .optional()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "El ID del equipo no es válido",
    }),
  height: Joi.number().min(50).max(300).optional(),
  weight: Joi.number().min(20).max(200).optional(),
  dateOfBirth: Joi.string()
    .optional()
    .isoDate()
    .custom((value, helpers) => {
      if (new Date(value) > new Date()) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "string.isoDate":
        "La fecha debe estar en formato ISO 8601 (ej: 1987-06-24)",
      "any.invalid": "La fecha de nacimiento no puede ser en el futuro",
    }),
  nationality: Joi.string().max(50).optional().trim(),
}).strict();
