const { body, validationResult } = require('express-validator');
const { VALIDATION } = require('../../config/constants');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const firstError = errors.array()[0].msg;
  const error = new Error(firstError);
  error.status = 400;
  error.errors = errors.array();
  throw error;
};

exports.createRecipeValidator = [
  body('title')
    .notEmpty().withMessage('O título é obrigatório.')
    .isLength({ max: VALIDATION.TITLE_MAX })
    .withMessage(`O título deve ter no máximo ${VALIDATION.TITLE_MAX} caracteres.`)
    .trim(),

  body('ingredients')
    .notEmpty().withMessage('Os ingredientes são obrigatórios.')
    .isLength({ max: VALIDATION.INGREDIENTS_MAX })
    .withMessage(`Ingredientes muito longos (máx. ${VALIDATION.INGREDIENTS_MAX} caracteres).`)
    .trim(),

  body('instructions')
    .notEmpty().withMessage('O modo de preparo é obrigatório.')
    .isLength({ max: VALIDATION.INSTRUCTIONS_MAX })
    .withMessage(`Modo de preparo muito longo (máx. ${VALIDATION.INSTRUCTIONS_MAX} caracteres).`)
    .trim(),

  body('category')
    .notEmpty().withMessage('A categoria é obrigatória.')
    .trim(),

  body('description')
    .optional()
    .isLength({ max: VALIDATION.DESCRIPTION_MAX })
    .withMessage(`A descrição deve ter no máximo ${VALIDATION.DESCRIPTION_MAX} caracteres.`)
    .trim(),

  body('prepTime')
    .optional()
    .isInt({ min: 1 }).withMessage('O tempo de preparo deve ser um número inteiro positivo.')
    .toInt(),

  body('servings')
    .optional()
    .isInt({ min: 1 }).withMessage('O número de porções deve ser um inteiro positivo.')
    .toInt(),

  validate
];
