const Empresa = require('../models/empresaModel');
const fs = require("fs");
const Picture = require("../models/Picture");

const empresaController = {
create: async (req, res) => {
  try {
    const file = req.file;

    let foto_perfil = null;

    // Salva a imagem no Mongo
    if (file) {
      const picture = new Picture({
        name: file.originalname,
        src: file.path,
      });

      await picture.save();
      foto_perfil = file.filename; // ou file.path se quiser o caminho completo
    }

    // Salva a empresa no PostgreSQL
    const empresaData = {
      ...req.body,
      foto_perfil,
    };

    const empresa = await Empresa.create(empresaData);

    res.status(201).json({ empresa });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

  // Se quiser, pode fazer a mesma coisa para update, por exemplo:
update: async (req, res) => {
  try {
    const { id } = req.params;
    const empresaData = req.body;

    // Busca empresa atual
    const empresaAtual = await Empresa.findById(id);
    if (!empresaAtual) {
      return res.status(404).json({ message: "Empresa não encontrada" });
    }

    // Se houver nova imagem
    if (req.file) {
      const file = req.file;

      // 1. Salva nova imagem no MongoDB
      const novaImagem = new Picture({
        name: file.originalname,
        src: file.path,
      });
      await novaImagem.save();

      // 2. Atualiza campo `foto_perfil` na empresa
      empresaData.foto_perfil = file.filename;

      // 3. Remove imagem antiga (se existir)
      if (empresaAtual.foto_perfil) {
        const imagemAntiga = await Picture.findOne({
          src: new RegExp(empresaAtual.foto_perfil),
        });
        if (imagemAntiga) {
          fs.unlinkSync(imagemAntiga.src); // deleta o arquivo local
          await imagemAntiga.remove();     // remove do MongoDB
        }
      }
    }

    // Atualiza a empresa no PostgreSQL
    const empresaAtualizada = await Empresa.update(id, empresaData);
    res.status(200).json(empresaAtualizada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

getAll: async (req, res) => {
  try {
    const empresas = await Empresa.findAll();
    const pictures = await Picture.find();
    res.status(200).json({ empresas, pictures });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

getByUsuarioId: async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const empresa = await Empresa.findByUsuarioId(usuario_id);

    if (empresa) {
      res.status(200).json(empresa);
    } else {
      res.status(404).json({ message: 'Empresa não encontrada para este usuário' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},
getById: async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await Empresa.findById(id);
    if (empresa) {
      res.status(200).json(empresa);
    } else {
      res.status(404).json({ message: 'Empresa não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

 delete: async (req, res) => {
  try {
    const { id } = req.params;

    // Busca a empresa antes de deletar
    const empresa = await Empresa.findById(id);
    if (!empresa) {
      return res.status(404).json({ message: "Empresa não encontrada" });
    }

    // Remove do PostgreSQL
    await Empresa.delete(id);

    // Agora tenta remover a imagem do Mongo e do sistema de arquivos
    if (empresa.foto_perfil) {
      const picture = await Picture.findOne({ src: new RegExp(empresa.foto_perfil) });
      if (picture) {
        fs.unlinkSync(picture.src); // remove o arquivo
        await picture.remove(); // remove do Mongo
      }
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
};

module.exports = empresaController;
