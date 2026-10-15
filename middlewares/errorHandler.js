const path = require('path');
const fs   = require('fs');
const { error } = require('./apiResponse');

/**
 * errorHandler.js — middleware de erro global (sempre o último app.use).
 *
 * Além de formatar a resposta de erro, limpa arquivos órfãos:
 * se o Multer já salvou um arquivo em disco mas a requisição falhou
 * (validação 400, autorização 403, ou qualquer outro erro), o arquivo
 * ficaria no disco sem registro no banco — um "órfão".
 * req.file (upload único) ou req.files (múltiplos) contém o(s) arquivo(s)
 * que o Multer salvou antes do erro ser lançado.
 */
module.exports = (err, req, res, next) => {
  console.error(err);

  // Limpa arquivos órfãos deixados pelo Multer antes do erro
  const uploadedFiles = [];
  if (req.file) uploadedFiles.push(req.file);
  if (req.files) {
    if (Array.isArray(req.files)) {
      uploadedFiles.push(...req.files);
    } else {
      // multer.fields() → { fieldname: [file, ...], ... }
      Object.values(req.files).forEach(arr => uploadedFiles.push(...arr));
    }
  }
  uploadedFiles.forEach(f => {
    if (f.path && fs.existsSync(f.path)) {
      fs.unlinkSync(f.path);
    }
  });

  const statusCode = err.status || 500;
  const errors = err.errors || [];
  return error(res, err.message || 'Ocorreu um erro inesperado.', statusCode, errors);
};
